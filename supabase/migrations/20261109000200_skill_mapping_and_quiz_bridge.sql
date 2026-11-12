-- MERIDIAN XP BRIDGE: Connects legacy quiz completions to the 15-skill OSRS engine
BEGIN;

-- 1. THE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.bridge_skill_xp_on_completion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, meridian, pg_temp AS $$
DECLARE
  v_skill_id UUID;
  v_xp INT;
  v_key TEXT;
BEGIN
  -- Only fire when a lesson is newly marked completed
  IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
    
    -- Find the skill mapped to this lesson
    SELECT skill_id, xp_amount INTO v_skill_id, v_xp
    FROM public.content_skill_reward_rules
    WHERE resource_type = 'lesson' AND resource_id = NEW.lesson_id AND is_active = true
    LIMIT 1;

    IF v_skill_id IS NOT NULL AND v_xp > 0 THEN
      v_key := 'auto_bridge_' || NEW.user_id::TEXT || '_' || NEW.lesson_id::TEXT;
      
      -- Insert into ledger (idempotent)
      INSERT INTO public.xp_award_ledger (user_id, skill_id, resource_type, resource_id, completion_event, xp_amount, idempotency_key, metadata)
      VALUES (NEW.user_id, v_skill_id, 'lesson', NEW.lesson_id, 'lesson_completed', v_xp, v_key, '{"source": "completion_trigger"}')
      ON CONFLICT (idempotency_key) DO NOTHING;
      
      -- Update OSRS skill progress
      INSERT INTO public.user_skill_progress (user_id, skill_id, xp, level, updated_at)
      VALUES (NEW.user_id, v_skill_id, v_xp, meridian.level_for_xp(v_xp), now())
      ON CONFLICT (user_id, skill_id) DO UPDATE SET 
        xp = public.user_skill_progress.xp + EXCLUDED.xp,
        level = meridian.level_for_xp(public.user_skill_progress.xp + EXCLUDED.xp),
        updated_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bridge_skill_xp ON public.lesson_progress;
CREATE TRIGGER trg_bridge_skill_xp
AFTER UPDATE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.bridge_skill_xp_on_completion();

-- 2. AUTO-MAP EXISTING COURSES TO THE 15 SKILLS
-- Dutch/Language -> Languages
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 50, 'lesson_completed', true
FROM public.lessons l
JOIN public.missions m ON m.id = l.mission_id
JOIN public.modules mod ON mod.id = m.module_id
JOIN public.courses c ON c.id = mod.course_id
JOIN public.skills s ON s.slug = 'languages'
WHERE lower(c.title) LIKE '%dutch%' OR lower(c.title) LIKE '%language%' OR lower(c.title) LIKE '%linguistic%'
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

-- Tech/Code -> Programming
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 75, 'lesson_completed', true
FROM public.lessons l
JOIN public.missions m ON m.id = l.mission_id
JOIN public.modules mod ON mod.id = m.module_id
JOIN public.courses c ON c.id = mod.course_id
JOIN public.skills s ON s.slug = 'programming'
WHERE lower(c.title) LIKE '%code%' OR lower(c.title) LIKE '%programming%' OR lower(c.title) LIKE '%software%' OR lower(c.title) LIKE '%tech%' OR lower(c.title) LIKE '%ai%' OR lower(c.title) LIKE '%prompt%'
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

-- Business/Startup -> Strategy
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 60, 'lesson_completed', true
FROM public.lessons l
JOIN public.missions m ON m.id = l.mission_id
JOIN public.modules mod ON mod.id = m.module_id
JOIN public.courses c ON c.id = mod.course_id
JOIN public.skills s ON s.slug = 'strategy'
WHERE lower(c.title) LIKE '%business%' OR lower(c.title) LIKE '%startup%' OR lower(c.title) LIKE '%entrepreneur%' OR lower(c.title) LIKE '%hustle%' OR lower(c.title) LIKE '%agency%' OR lower(c.title) LIKE '%marketing%'
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

-- Philosophy/Mental Models -> Philosophy
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 60, 'lesson_completed', true
FROM public.lessons l
JOIN public.missions m ON m.id = l.mission_id
JOIN public.modules mod ON mod.id = m.module_id
JOIN public.courses c ON c.id = mod.course_id
JOIN public.skills s ON s.slug = 'philosophy'
WHERE lower(c.title) LIKE '%philosophy%' OR lower(c.title) LIKE '%stoic%' OR lower(c.title) LIKE '%examined life%' OR lower(c.title) LIKE '%mental model%' OR lower(c.title) LIKE '%psychology%'
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

-- Design/Creative -> Design
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 60, 'lesson_completed', true
FROM public.lessons l
JOIN public.missions m ON m.id = l.mission_id
JOIN public.modules mod ON mod.id = m.module_id
JOIN public.courses c ON c.id = mod.course_id
JOIN public.skills s ON s.slug = 'design'
WHERE lower(c.title) LIKE '%design%' OR lower(c.title) LIKE '%creative%' OR lower(c.title) LIKE '%architecture%' OR lower(c.title) LIKE '%ux%'
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

-- Catch-all: Unmapped lessons -> First Principles
INSERT INTO public.content_skill_reward_rules (skill_id, resource_type, resource_id, xp_amount, completion_event, is_active)
SELECT s.id, 'lesson', l.id, 40, 'lesson_completed', true
FROM public.lessons l
JOIN public.skills s ON s.slug = 'first_principles'
WHERE NOT EXISTS (
  SELECT 1 FROM public.content_skill_reward_rules r 
  WHERE r.resource_type = 'lesson' AND r.resource_id = l.id
)
ON CONFLICT (skill_id, resource_type, resource_id, completion_event) DO NOTHING;

COMMIT;



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."auto_unlock_for_admins"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.lesson_progress (user_id, lesson_id, completed, completed_at)
  select u.id, new.id, true, now()
  from auth.users u
  where lower(u.email) in ('yassine_lek@hotmail.com', 'stephaniederoeck.jedits@gmail.com')
  on conflict (user_id, lesson_id) do nothing;

  return new;
end;
$$;


ALTER FUNCTION "public"."auto_unlock_for_admins"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_shards"("shard_amount" integer, "activity_reason" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Update the user's shards securely on the server
  UPDATE public.profiles
  SET shards = COALESCE(shards, 0) + shard_amount
  WHERE id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."award_shards"("shard_amount" integer, "activity_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_skill_xp"("p_skill_slug" "text", "p_xp_amount" integer, "p_reason" "text" DEFAULT 'activity'::"text") RETURNS TABLE("new_xp" integer, "new_level" integer, "leveled_up" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_skill_id UUID;
  v_old_level INTEGER := 1;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_leveled BOOLEAN := false;
BEGIN
  SELECT id INTO v_skill_id FROM public.skills WHERE slug = p_skill_slug;
  IF v_skill_id IS NULL THEN RAISE EXCEPTION 'Skill not found: %', p_skill_slug; END IF;

  SELECT level INTO v_old_level FROM public.user_skill_progress 
    WHERE user_id = auth.uid() AND skill_id = v_skill_id;

  INSERT INTO public.user_skill_progress (user_id, skill_id, xp, level, updated_at)
  VALUES (auth.uid(), v_skill_id, p_xp_amount, public.calc_skill_level(p_xp_amount), NOW())
  ON CONFLICT (user_id, skill_id) DO UPDATE
  SET xp = public.user_skill_progress.xp + p_xp_amount,
      level = public.calc_skill_level(public.user_skill_progress.xp + p_xp_amount),
      updated_at = NOW()
  RETURNING xp, level INTO v_new_xp, v_new_level;

  IF v_new_level > COALESCE(v_old_level, 1) THEN v_leveled := true; END IF;

  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled;
END;
$$;


ALTER FUNCTION "public"."award_skill_xp"("p_skill_slug" "text", "p_xp_amount" integer, "p_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calc_skill_level"("p_xp" integer) RETURNS integer
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
  lvl INTEGER := 1;
  needed INTEGER := 83;
BEGIN
  WHILE lvl < 99 AND p_xp >= needed LOOP
    lvl := lvl + 1;
    needed := needed + FLOOR(needed * 0.1) + 30;
  END LOOP;
  RETURN lvl;
END;
$$;


ALTER FUNCTION "public"."calc_skill_level"("p_xp" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_combat_level"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
  v_total_xp INTEGER;
  v_total_levels INTEGER;
  v_skill_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(xp), 0), COALESCE(SUM(level), 0), COUNT(*)
  INTO v_total_xp, v_total_levels, v_skill_count
  FROM public.user_skill_progress WHERE user_id = p_user_id;
  
  IF v_skill_count = 0 THEN RETURN 1; END IF;
  RETURN FLOOR(v_total_levels::FLOAT / v_skill_count) + FLOOR(SQRT(v_total_xp / 100.0))::INTEGER;
END;
$$;


ALTER FUNCTION "public"."get_combat_level"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_quiz_questions"("p_lesson_id" "uuid") RETURNS TABLE("id" "uuid", "question" "text", "options" "jsonb", "order_index" integer)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select id, question, options, order_index
  from public.quiz_questions
  where lesson_id = p_lesson_id
  order by order_index;
$$;


ALTER FUNCTION "public"."get_quiz_questions"("p_lesson_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin_user"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
      and lower(email) in ('yassine_lek@hotmail.com', 'stephaniederoeck.jedits@gmail.com')
  );
$$;


ALTER FUNCTION "public"."is_admin_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_quiz"("p_lesson_id" "uuid", "p_answers" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_user_id uuid := auth.uid();
  v_total int;
  v_correct int := 0;
  v_score int;
  v_pass int;
  v_passed boolean;
  v_rec record;
  v_idx int;
  v_prev_best int := 0;
  v_prev_attempts int := 0;
  v_prev_passed boolean := false;
  v_is_new_best boolean := false;
  v_xp_base int := 0;
  v_xp_bonus int := 0;
  v_review jsonb := '[]'::jsonb;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  select pass_threshold into v_pass from public.lessons where id = p_lesson_id;
  if v_pass is null then raise exception 'Lesson not found: %', p_lesson_id; end if;

  select count(*) into v_total from public.quiz_questions where lesson_id = p_lesson_id;

  for v_rec in
    select id, correct_index, order_index
    from public.quiz_questions
    where lesson_id = p_lesson_id
    order by order_index
  loop
    v_idx := nullif(p_answers ->> v_rec.id::text, '')::int;
    if v_idx is not null and v_idx = v_rec.correct_index then
      v_correct := v_correct + 1;
    end if;
    v_review := v_review || jsonb_build_object(
      'id', v_rec.id,
      'user_index', v_idx,
      'correct_index', v_rec.correct_index,
      'order_index', v_rec.order_index
    );
  end loop;

  if v_total > 0 then v_score := round((v_correct::numeric / v_total::numeric) * 100);
  else v_score := 100; end if;

  v_passed := v_score >= v_pass;

  select coalesce(best_score,0), coalesce(attempts,0), coalesce(completed,false)
    into v_prev_best, v_prev_attempts, v_prev_passed
  from public.lesson_progress
  where user_id = v_user_id and lesson_id = p_lesson_id;

  if v_passed then
    if not v_prev_passed then v_xp_base := 50; end if;
    if v_score > v_prev_best then
      v_is_new_best := true;
      if v_prev_passed then
        v_xp_bonus := 25;
        if v_score = 100 then v_xp_bonus := v_xp_bonus + 25; end if;
      end if;
    end if;
  end if;

  if exists (select 1 from public.lesson_progress
             where user_id = v_user_id and lesson_id = p_lesson_id) then
    update public.lesson_progress
    set completed = completed or v_passed,
        completed_at = case when completed then completed_at
                            when v_passed then now()
                            else completed_at end,
        best_score = greatest(coalesce(best_score,0), v_score),
        attempts = coalesce(attempts,0) + 1,
        last_attempt_at = now()
    where user_id = v_user_id and lesson_id = p_lesson_id;
  else
    insert into public.lesson_progress
      (user_id, lesson_id, completed, completed_at, best_score, attempts, last_attempt_at)
    values
      (v_user_id, p_lesson_id, v_passed,
       case when v_passed then now() else null end,
       v_score, 1, now());
  end if;

  return jsonb_build_object(
    'score', v_score,
    'passed', v_passed,
    'correct', v_correct,
    'total', v_total,
    'pass_threshold', v_pass,
    'best_score', greatest(coalesce(v_prev_best,0), v_score),
    'previous_best', coalesce(v_prev_best,0),
    'is_new_best', v_is_new_best,
    'attempts', v_prev_attempts + 1,
    'xp_base', v_xp_base,
    'xp_bonus', v_xp_bonus,
    'xp_total', v_xp_base + v_xp_bonus,
    'review', v_review
  );
end;
$$;


ALTER FUNCTION "public"."submit_quiz"("p_lesson_id" "uuid", "p_answers" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."unlock_skills_on_xp_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Avid Reader (500 XP)
  IF NEW.xp >= 500 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Avid Reader', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Builder (1500 XP)
  IF NEW.xp >= 1500 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Builder', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Systems Thinker (4000 XP)
  IF NEW.xp >= 4000 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Systems Thinker', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Language Architect (8000 XP)
  IF NEW.xp >= 8000 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Language Architect', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Disciplined Mind (15000 XP)
  IF NEW.xp >= 15000 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Disciplined Mind', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Digital Systems Architect (30000 XP)
  IF NEW.xp >= 30000 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Digital Systems Architect', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  -- Digital Renaissance Architect (60000 XP)
  IF NEW.xp >= 60000 THEN
    INSERT INTO public.user_skills (user_id, skill_name, unlocked) 
    VALUES (NEW.id, 'Digital Renaissance Architect', true) 
    ON CONFLICT (user_id, skill_name) DO UPDATE SET unlocked = true;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."unlock_skills_on_xp_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Meridian Academy" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."Meridian Academy" OWNER TO "postgres";


COMMENT ON TABLE "public"."Meridian Academy" IS 'University of the art of knowledge';



ALTER TABLE "public"."Meridian Academy" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Meridian Academy_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."blog_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "article_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "parent_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."channel_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "channel_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."channel_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."channel_poll_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "poll_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "option_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."channel_poll_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."channel_polls" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "channel_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."channel_polls" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."channels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."channels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "track" "text" NOT NULL,
    "level" "text" NOT NULL,
    "thumbnail_url" "text",
    "published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "courses_track_check" CHECK (("track" = ANY (ARRAY['nl_to_en'::"text", 'en_to_nl'::"text"])))
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_news" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "url" "text" NOT NULL,
    "source" "text" NOT NULL,
    "category" "text" NOT NULL,
    "excerpt" "text",
    "image_url" "text",
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."daily_news" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."enrollments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "course_id" "uuid",
    "progress" integer DEFAULT 0,
    "enrolled_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."enrollments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."group_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "owner_id" "uuid" NOT NULL,
    "is_public" boolean DEFAULT true,
    "accent_color" "text" DEFAULT '#8b5cf6'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_articles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "excerpt" "text",
    "body" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "cover_image" "text",
    "category_id" "uuid",
    "format" "text" DEFAULT 'standard'::"text",
    "author_name" "text" DEFAULT 'Meridian Editorial'::"text",
    "author_avatar" "text",
    "author_bio" "text",
    "reading_minutes" integer DEFAULT 5,
    "status" "text" DEFAULT 'published'::"text",
    "featured" boolean DEFAULT false,
    "published_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "views" integer DEFAULT 0,
    CONSTRAINT "journal_articles_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'review'::"text", 'approved'::"text", 'published'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."journal_articles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "article_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."journal_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "accent_color" "text" DEFAULT '#22d3ee'::"text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."journal_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_reading_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "article_id" "uuid" NOT NULL,
    "scroll_percentage" integer DEFAULT 0,
    "completed" boolean DEFAULT false,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."journal_reading_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."knowledge_vault" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "discipline" "text" NOT NULL,
    "title" "text" NOT NULL,
    "core_concept" "text" NOT NULL,
    "detailed_explanation" "text" NOT NULL,
    "first_principles" "jsonb" NOT NULL,
    "analogies" "jsonb" NOT NULL,
    "connections" "jsonb" NOT NULL,
    "applications" "jsonb" NOT NULL,
    "further_questions" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."knowledge_vault" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lesson_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "completed" boolean DEFAULT false,
    "completed_at" timestamp with time zone,
    "quiz_score" integer,
    "quiz_passed" boolean DEFAULT false,
    "best_score" integer DEFAULT 0,
    "attempts" integer DEFAULT 0,
    "last_attempt_at" timestamp with time zone
);


ALTER TABLE "public"."lesson_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid",
    "title" "text" NOT NULL,
    "order_index" integer NOT NULL,
    "video_url" "text",
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "mission_id" "uuid",
    "is_final_exam" boolean DEFAULT false,
    "pass_threshold" integer DEFAULT 80
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "book_id" "uuid",
    "chapter_id" "uuid",
    "label" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."library_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_books" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text" NOT NULL,
    "description" "text",
    "accent_color" "text" DEFAULT '#22d3ee'::"text",
    "published" boolean DEFAULT false,
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category" "text" DEFAULT 'Languages and Communication'::"text",
    "cover_style" "text" DEFAULT 'classic'::"text",
    "xp_reward" integer DEFAULT 250
);


ALTER TABLE "public"."library_books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_chapters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "book_id" "uuid",
    "chapter_number" integer NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "word_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."library_chapters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "book_id" "uuid",
    "chapter_id" "uuid",
    "selected_text" "text" NOT NULL,
    "note_content" "text",
    "page_number" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."library_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."library_progress" (
    "user_id" "uuid" NOT NULL,
    "book_id" "uuid" NOT NULL,
    "scroll_percentage" integer DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "completed_at" timestamp with time zone,
    "chapter_id" "uuid",
    "is_bookmarked" boolean DEFAULT false
);


ALTER TABLE "public"."library_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."missions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "module_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."missions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "thread_id" "uuid",
    "user_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "native_language" "text",
    "learning_language" "text",
    "level" "text" DEFAULT 'A1'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_admin" boolean DEFAULT false,
    "xp" integer DEFAULT 0,
    "shards" integer DEFAULT 0,
    CONSTRAINT "profiles_learning_language_check" CHECK (("learning_language" = ANY (ARRAY['en'::"text", 'nl'::"text"]))),
    CONSTRAINT "profiles_native_language_check" CHECK (("native_language" = ANY (ARRAY['en'::"text", 'nl'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" NOT NULL,
    "correct_index" integer NOT NULL,
    "order_index" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."quiz_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skill_domains" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text" DEFAULT '◈'::"text",
    "accent_color" "text" DEFAULT '#22d3ee'::"text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."skill_domains" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "domain_id" "uuid",
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "max_level" integer DEFAULT 99,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."study_specs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "objective" "text" NOT NULL,
    "methodology" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."study_specs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."threads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "channel_id" "uuid",
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_resume_state" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "resource_type" "text" NOT NULL,
    "resource_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "href" "text" NOT NULL,
    "progress_data" "jsonb" DEFAULT '{}'::"jsonb",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_resume_state" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_skill_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "skill_id" "uuid" NOT NULL,
    "xp" integer DEFAULT 0 NOT NULL,
    "level" integer DEFAULT 1 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_skill_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_skills" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "skill_name" "text" NOT NULL,
    "skill_level" integer DEFAULT 1,
    "unlocked" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_skills" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Meridian Academy"
    ADD CONSTRAINT "Meridian Academy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_comments"
    ADD CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channel_messages"
    ADD CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channel_poll_votes"
    ADD CONSTRAINT "channel_poll_votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channel_poll_votes"
    ADD CONSTRAINT "channel_poll_votes_poll_id_user_id_key" UNIQUE ("poll_id", "user_id");



ALTER TABLE ONLY "public"."channel_polls"
    ADD CONSTRAINT "channel_polls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channels"
    ADD CONSTRAINT "channels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."channels"
    ADD CONSTRAINT "channels_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."daily_news"
    ADD CONSTRAINT "daily_news_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_news"
    ADD CONSTRAINT "daily_news_url_key" UNIQUE ("url");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."journal_articles"
    ADD CONSTRAINT "journal_articles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_articles"
    ADD CONSTRAINT "journal_articles_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."journal_bookmarks"
    ADD CONSTRAINT "journal_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_bookmarks"
    ADD CONSTRAINT "journal_bookmarks_user_id_article_id_key" UNIQUE ("user_id", "article_id");



ALTER TABLE ONLY "public"."journal_categories"
    ADD CONSTRAINT "journal_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_categories"
    ADD CONSTRAINT "journal_categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."journal_reading_progress"
    ADD CONSTRAINT "journal_reading_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_reading_progress"
    ADD CONSTRAINT "journal_reading_progress_user_id_article_id_key" UNIQUE ("user_id", "article_id");



ALTER TABLE ONLY "public"."knowledge_vault"
    ADD CONSTRAINT "knowledge_vault_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_bookmarks"
    ADD CONSTRAINT "library_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_books"
    ADD CONSTRAINT "library_books_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."library_chapters"
    ADD CONSTRAINT "library_chapters_book_id_chapter_number_key" UNIQUE ("book_id", "chapter_number");



ALTER TABLE ONLY "public"."library_chapters"
    ADD CONSTRAINT "library_chapters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_notes"
    ADD CONSTRAINT "library_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_pkey" PRIMARY KEY ("user_id", "book_id");



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_user_book_unique" UNIQUE ("user_id", "book_id");



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_user_id_book_id_key" UNIQUE ("user_id", "book_id");



ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skill_domains"
    ADD CONSTRAINT "skill_domains_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skill_domains"
    ADD CONSTRAINT "skill_domains_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."study_specs"
    ADD CONSTRAINT "study_specs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_resume_state"
    ADD CONSTRAINT "user_resume_state_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_resume_state"
    ADD CONSTRAINT "user_resume_state_user_id_resource_type_key" UNIQUE ("user_id", "resource_type");



ALTER TABLE ONLY "public"."user_skill_progress"
    ADD CONSTRAINT "user_skill_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_skill_progress"
    ADD CONSTRAINT "user_skill_progress_user_id_skill_id_key" UNIQUE ("user_id", "skill_id");



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_user_id_skill_name_key" UNIQUE ("user_id", "skill_name");



CREATE INDEX "blog_comments_article_idx" ON "public"."blog_comments" USING "btree" ("article_id", "created_at" DESC);



CREATE INDEX "channel_messages_channel_idx" ON "public"."channel_messages" USING "btree" ("channel_id", "created_at" DESC);



CREATE INDEX "daily_news_category_idx" ON "public"."daily_news" USING "btree" ("category", "published_at" DESC);



CREATE INDEX "group_messages_group_idx" ON "public"."group_messages" USING "btree" ("group_id", "created_at" DESC);



CREATE INDEX "journal_articles_category_idx" ON "public"."journal_articles" USING "btree" ("category_id");



CREATE INDEX "journal_articles_featured_idx" ON "public"."journal_articles" USING "btree" ("featured") WHERE ("featured" = true);



CREATE INDEX "journal_articles_status_idx" ON "public"."journal_articles" USING "btree" ("status", "published_at" DESC);



CREATE OR REPLACE TRIGGER "trg_auto_unlock_admins" AFTER INSERT ON "public"."lessons" FOR EACH ROW EXECUTE FUNCTION "public"."auto_unlock_for_admins"();



CREATE OR REPLACE TRIGGER "trigger_unlock_skills" AFTER UPDATE OF "xp" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."unlock_skills_on_xp_update"();



CREATE OR REPLACE TRIGGER "update_user_resume_state_updated_at" BEFORE UPDATE ON "public"."user_resume_state" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."blog_comments"
    ADD CONSTRAINT "blog_comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."journal_articles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_comments"
    ADD CONSTRAINT "blog_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_comments"
    ADD CONSTRAINT "blog_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_messages"
    ADD CONSTRAINT "channel_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_messages"
    ADD CONSTRAINT "channel_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_poll_votes"
    ADD CONSTRAINT "channel_poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "public"."channel_polls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_poll_votes"
    ADD CONSTRAINT "channel_poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_polls"
    ADD CONSTRAINT "channel_polls_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."channel_polls"
    ADD CONSTRAINT "channel_polls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."enrollments"
    ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_messages"
    ADD CONSTRAINT "group_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_articles"
    ADD CONSTRAINT "journal_articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."journal_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."journal_bookmarks"
    ADD CONSTRAINT "journal_bookmarks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."journal_articles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_bookmarks"
    ADD CONSTRAINT "journal_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_reading_progress"
    ADD CONSTRAINT "journal_reading_progress_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."journal_articles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_reading_progress"
    ADD CONSTRAINT "journal_reading_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lesson_progress"
    ADD CONSTRAINT "lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "public"."missions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."library_bookmarks"
    ADD CONSTRAINT "library_bookmarks_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_bookmarks"
    ADD CONSTRAINT "library_bookmarks_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."library_chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_bookmarks"
    ADD CONSTRAINT "library_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_chapters"
    ADD CONSTRAINT "library_chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_notes"
    ADD CONSTRAINT "library_notes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_notes"
    ADD CONSTRAINT "library_notes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."library_chapters"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_notes"
    ADD CONSTRAINT "library_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."library_books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "public"."library_chapters"("id");



ALTER TABLE ONLY "public"."library_progress"
    ADD CONSTRAINT "library_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."missions"
    ADD CONSTRAINT "missions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "public"."skill_domains"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."threads"
    ADD CONSTRAINT "threads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_resume_state"
    ADD CONSTRAINT "user_resume_state_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_skill_progress"
    ADD CONSTRAINT "user_skill_progress_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_skill_progress"
    ADD CONSTRAINT "user_skill_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_skills"
    ADD CONSTRAINT "user_skills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Auth can delete courses" ON "public"."courses" FOR DELETE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can delete lessons" ON "public"."lessons" FOR DELETE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can delete quiz questions" ON "public"."quiz_questions" FOR DELETE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can insert courses" ON "public"."courses" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can insert lessons" ON "public"."lessons" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can insert missions" ON "public"."missions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can insert modules" ON "public"."modules" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can insert quiz questions" ON "public"."quiz_questions" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can update courses" ON "public"."courses" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can update missions" ON "public"."missions" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can update modules" ON "public"."modules" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth can update quiz questions" ON "public"."quiz_questions" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Auth users can create posts" ON "public"."posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Auth users can create threads" ON "public"."threads" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Auth users can update lessons" ON "public"."lessons" FOR UPDATE USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Channels viewable by everyone" ON "public"."channels" FOR SELECT USING (true);



CREATE POLICY "Enable read access for everyone on books" ON "public"."library_books" FOR SELECT USING (true);



CREATE POLICY "Enable read access for everyone on chapters" ON "public"."library_chapters" FOR SELECT USING (true);



ALTER TABLE "public"."Meridian Academy" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Missions viewable" ON "public"."missions" FOR SELECT USING (true);



CREATE POLICY "Modules viewable" ON "public"."modules" FOR SELECT USING (true);



CREATE POLICY "Posts viewable by everyone" ON "public"."posts" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Public read knowledge_vault" ON "public"."knowledge_vault" FOR SELECT USING (true);



CREATE POLICY "Public read study_specs" ON "public"."study_specs" FOR SELECT USING (true);



CREATE POLICY "Published courses are viewable by everyone" ON "public"."courses" FOR SELECT USING (("published" = true));



CREATE POLICY "Threads viewable by everyone" ON "public"."threads" FOR SELECT USING (true);



CREATE POLICY "User bookmarks access" ON "public"."library_bookmarks" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own posts" ON "public"."posts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own threads" ON "public"."threads" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can enroll themselves" ON "public"."enrollments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert own progress" ON "public"."library_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own progress" ON "public"."library_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own resume state" ON "public"."user_resume_state" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own skills" ON "public"."user_skills" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own progress" ON "public"."library_progress" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own progress" ON "public"."library_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own resume state" ON "public"."user_resume_state" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own skills" ON "public"."user_skills" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own progress" ON "public"."library_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own progress" ON "public"."library_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own resume state" ON "public"."user_resume_state" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own skills" ON "public"."user_skills" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users insert own progress" ON "public"."lesson_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own bookmarks" ON "public"."library_bookmarks" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own notes" ON "public"."library_notes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users see own enrollments" ON "public"."enrollments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users see own progress" ON "public"."lesson_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users update own progress" ON "public"."lesson_progress" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "articles_public_published" ON "public"."journal_articles" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "bc_own" ON "public"."blog_comments" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "bc_read" ON "public"."blog_comments" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."blog_comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bookmarks_own" ON "public"."journal_bookmarks" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "categories_public_read" ON "public"."journal_categories" FOR SELECT USING (true);



ALTER TABLE "public"."channel_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."channel_poll_votes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."channel_polls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."channels" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cm_read" ON "public"."channel_messages" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "cm_write" ON "public"."channel_messages" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cp_read" ON "public"."channel_polls" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "cp_write" ON "public"."channel_polls" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "cpv_own" ON "public"."channel_poll_votes" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."daily_news" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "daily_news_public" ON "public"."daily_news" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."enrollments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "g_own" ON "public"."groups" TO "authenticated" USING (("owner_id" = "auth"."uid"())) WITH CHECK (("owner_id" = "auth"."uid"()));



CREATE POLICY "g_read" ON "public"."groups" FOR SELECT TO "authenticated" USING ((("is_public" = true) OR ("owner_id" = "auth"."uid"())));



CREATE POLICY "gm_read" ON "public"."group_messages" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "gm_write" ON "public"."group_messages" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."group_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."groups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_articles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_reading_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."knowledge_vault" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lesson_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lessons_select_public" ON "public"."lessons" FOR SELECT USING (true);



ALTER TABLE "public"."library_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."library_books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."library_chapters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."library_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."library_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."missions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "progress_own" ON "public"."journal_reading_progress" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."quiz_questions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "quiz_questions_select_public" ON "public"."quiz_questions" FOR SELECT USING (true);



ALTER TABLE "public"."skill_domains" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "skill_domains_read" ON "public"."skill_domains" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "skills_read" ON "public"."skills" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."study_specs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."threads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_resume_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_skill_progress" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_skill_progress_own" ON "public"."user_skill_progress" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."user_skills" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_quiz_questions"("p_lesson_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_quiz_questions"("p_lesson_id" "uuid") TO "anon";



GRANT ALL ON FUNCTION "public"."is_admin_user"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."submit_quiz"("p_lesson_id" "uuid", "p_answers" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_quiz"("p_lesson_id" "uuid", "p_answers" "jsonb") TO "anon";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."Meridian Academy" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."Meridian Academy" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."Meridian Academy" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."blog_comments" TO "anon";
GRANT ALL ON TABLE "public"."blog_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_comments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_messages" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_messages" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_messages" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_poll_votes" TO "anon";
GRANT ALL ON TABLE "public"."channel_poll_votes" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_poll_votes" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_polls" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_polls" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channel_polls" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channels" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channels" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."channels" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."courses" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."daily_news" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."daily_news" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_news" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enrollments" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."enrollments" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."enrollments" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."group_messages" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."group_messages" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."group_messages" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."groups" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_articles" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_articles" TO "authenticated";
GRANT ALL ON TABLE "public"."journal_articles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."journal_bookmarks" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_bookmarks" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_categories" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."journal_categories" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_reading_progress" TO "anon";
GRANT ALL ON TABLE "public"."journal_reading_progress" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."journal_reading_progress" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."knowledge_vault" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."knowledge_vault" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."knowledge_vault" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lesson_progress" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."lesson_progress" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lesson_progress" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."lessons" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_bookmarks" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_bookmarks" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_bookmarks" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_books" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_books" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_books" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_chapters" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_chapters" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_chapters" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_notes" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_notes" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_notes" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."library_progress" TO "anon";
GRANT ALL ON TABLE "public"."library_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."library_progress" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."missions" TO "anon";
GRANT ALL ON TABLE "public"."missions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."missions" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."modules" TO "anon";
GRANT ALL ON TABLE "public"."modules" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."modules" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."posts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."posts" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."posts" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."profiles" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."profiles" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."profiles" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."quiz_questions" TO "anon";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."quiz_questions" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."quiz_questions" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skill_domains" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skill_domains" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skill_domains" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skills" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skills" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skills" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."study_specs" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."study_specs" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."study_specs" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."threads" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."threads" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."threads" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_resume_state" TO "anon";
GRANT ALL ON TABLE "public"."user_resume_state" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_resume_state" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_skill_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_skill_progress" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_skill_progress" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_skills" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_skills" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."user_skills" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";








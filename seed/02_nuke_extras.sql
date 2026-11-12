-- ═══════════════════════════════════════
-- NUKE all non-Meridian-Dutch-Mastery courses
-- Keeps ONLY: english-to-dutch-mastery
-- ═══════════════════════════════════════
DO $nuke$
DECLARE c uuid;
BEGIN
  FOR c IN SELECT id FROM courses WHERE slug <> 'english-to-dutch-mastery' LOOP
    DELETE FROM quiz_questions WHERE lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN missions m ON l.mission_id = m.id
      JOIN modules mo ON m.module_id = mo.id
      WHERE mo.course_id = c
    );
    DELETE FROM lesson_progress WHERE lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN missions m ON l.mission_id = m.id
      JOIN modules mo ON m.module_id = mo.id
      WHERE mo.course_id = c
    );
    DELETE FROM lessons WHERE mission_id IN (
      SELECT m.id FROM missions m
      JOIN modules mo ON m.module_id = mo.id
      WHERE mo.course_id = c
    );
    DELETE FROM missions WHERE module_id IN (
      SELECT id FROM modules WHERE course_id = c
    );
    DELETE FROM modules WHERE course_id = c;
    DELETE FROM enrollments WHERE course_id = c;
    DELETE FROM courses WHERE id = c;
  END LOOP;
END $nuke$;

-- Verify — should show ONLY our course
SELECT slug, title FROM courses;
-- ═══════════════════════════════════════════════════
-- MERIDIAN DUTCH — CLEAN REBUILD
-- ═══════════════════════════════════════════════════

DO $nuke$
DECLARE c uuid;
BEGIN
  SELECT id INTO c FROM courses WHERE slug = 'english-to-dutch-mastery';
  IF c IS NOT NULL THEN
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
  END IF;
END $nuke$;

DO $build$
DECLARE
  c uuid; m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid;
BEGIN
  INSERT INTO courses (slug, title, description, track, level, published)
  VALUES (
    'english-to-dutch-mastery',
    'Meridian Academy Language Mastery: Dutch',
    'Zero to Hero. Learn Dutch from absolute zero through pattern recognition, cognate decoding, and structured sentence building.',
    'en_to_nl', 'A0-A2', true
  ) RETURNING id INTO c;

  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (c, 'First Contact & The Decoder Key', 'Discover Dutch from zero. Decode the sound engine, unlock the cognate vault, and build your first sentences.', 1) RETURNING id INTO m1;

  INSERT INTO missions (module_id, title, description, order_index) VALUES
    (m1, 'The Cognate Vault',      'Words you already know. Unlock the shared vocabulary between English and Dutch.', 1),
    (m1, 'The Sound Engine',       'Decode Dutch vowels. OO, OE, AA, EE, and the long/short rule.', 2),
    (m1, 'Consonants & The Dutch R','R, G, CH, SCH — sounds that do not exist in English.', 3),
    (m1, 'Articles, Pronouns & Frames', 'De / het. Ik / jij / hij / zij. Reusable sentence frames.', 4),
    (m1, 'Mission 1 Exam — Decoder Mastery', 'Cumulative exam across Sagas 1.1–1.4.', 5);

  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (c, 'The Sentence Builder', 'Build reliable Dutch sentences. Pronouns, regular verbs, V2 word order.', 2) RETURNING id INTO m2;

  INSERT INTO missions (module_id, title, description, order_index) VALUES
    (m2, 'Pronouns & Regular Present Tense', 'Ik werk, jij werkt, hij werkt. The engine of every Dutch sentence.', 1),
    (m2, 'The V2 Word Order Rule', 'Why the verb sits in position 2 — and never moves.', 2),
    (m2, 'Questions, Negation & Answers', 'Ja, nee, niet, geen. Asking and refusing.', 3),
    (m2, 'Adjectives & Description', 'een groot huis, het kleine kind.', 4),
    (m2, 'Mission 2 Exam — Sentence Architect', 'Cumulative exam across Sagas 2.1–2.4.', 5);

  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (c, 'Dutch in Everyday Life', 'Move from isolated sentences into practical everyday communication.', 3) RETURNING id INTO m3;

  INSERT INTO missions (module_id, title, description, order_index) VALUES
    (m3, 'Time, Days, Months, Numbers', 'Klok, datum, week, maand, jaar, 1–100.', 1),
    (m3, 'Food, Drink & Shopping', 'Boodschappen, restaurant, geld, bestellen.', 2),
    (m3, 'Family, Home & Daily Routines', 'Familie, huis, woonkamer, routines.', 3),
    (m3, 'Modal Verbs & Practical Requests', 'Kunnen, moeten, willen, mogen, zullen.', 4),
    (m3, 'Mission 3 Exam — Everyday Communicator', 'Cumulative exam across Sagas 3.1–3.4.', 5);

  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (c, 'Connecting Ideas & Real Dutch', 'Link sentences, express time, understand real Dutch texts.', 4) RETURNING id INTO m4;

  INSERT INTO missions (module_id, title, description, order_index) VALUES
    (m4, 'Conjunctions & Linking Ideas', 'en, maar, omdat, want, dus, terwijl.', 1),
    (m4, 'Past Tense — Perfectum & Imperfectum', 'Ik heb gewerkt. Ik werkte. When to use which.', 2),
    (m4, 'Subordinate Clauses & Word Order', 'The verb moves to the end of bijzinnen.', 3),
    (m4, 'Separable Verbs & Future', 'opbellen, meenemen, gaan, zullen.', 4),
    (m4, 'Mission 4 Exam — Connected Thinker', 'Cumulative exam across Sagas 4.1–4.4.', 5);

  INSERT INTO modules (course_id, title, description, order_index)
  VALUES (c, 'Independent Reader & Communicator', 'Reduce dependence on translations. Read, write, and think in Dutch.', 5) RETURNING id INTO m5;

  INSERT INTO missions (module_id, title, description, order_index) VALUES
    (m5, 'Reading Strategies & Context Clues', 'Guess meaning from grammar and context.', 1),
    (m5, 'Real Dutch — News, Stories, Emails', 'Authentic simplified texts.', 2),
    (m5, 'Opinions & Complex Ideas', 'Ik vind dat..., volgens mij..., ik geloof...', 3),
    (m5, 'Idioms & Natural Phrasing', 'Native expressions and informal Dutch.', 4),
    (m5, 'FINAL EXAM — Independent Dutch', 'Cumulative exam across the whole course.', 5);
END $build$;

SELECT m.title AS saga, mi.title AS mission, mi.order_index
FROM modules m JOIN missions mi ON mi.module_id = m.id
ORDER BY m.order_index, mi.order_index;
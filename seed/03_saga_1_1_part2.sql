DO $saga11b$
DECLARE s uuid; l uuid;
BEGIN
  SELECT id INTO s FROM missions WHERE title = 'The Cognate Vault' LIMIT 1;

  -- ═══════ LESSON 6 — Nature & Weather ═══════
  INSERT INTO lessons (mission_id, title, order_index, content, is_final_exam, pass_threshold)
  VALUES (s, 'Nature & Weather — The World Outside', 6, $c$
# 🌤️ Nature & Weather — The World Outside

Step outside. Sun, moon, wind, rain — all words you already half-know.

---

## 🌍 01 The Sky and the Seasons

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| sun | zon |
| moon | maan |
| star | ster |
| sky | lucht |
| cloud | wolk |
| wind | wind |
| rain | regen |
| snow | sneeuw |
| ice | ijs |
| storm | storm |

Notice: some are identical (wind, storm). Others shifted (sun → zon, moon → maan).

---

## 🌳 02 Landscape

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| tree | boom |
| flower | bloem |
| grass | gras |
| leaf | blad |
| forest | bos |
| mountain | berg |
| sea | zee |
| beach | strand |

> ⚠️ **Careful:** *bos* is not "boss". It means **forest**.

---

## 🎯 03 Weather in a Sentence

Two new frames:

**Het is ___.** (It is ___.)

**Het ___t.** (It ___s.)

Examples:

- Het is warm. *(It is warm.)*
- Het is koud. *(It is cold.)*
- Het regent. *(It is raining.)*
- Het sneeuwt. *(It is snowing.)*

---

## 💡 04 Meridian Insight

> Weather is the easiest Dutch small talk.

Dutch people talk about weather constantly. Three sentences — **Het is warm / koud / regent** — will carry a whole conversation.

---

# 🎉 Side Quest Complete

You now possess:
- 18 nature words
- Frames **Het is ___** and **Het ___t**

Test your understanding before moving on.
  $c$, false, 80) RETURNING id INTO l;

  INSERT INTO quiz_questions (lesson_id, question, options, correct_index, order_index) VALUES
    (l, 'What is "sun" in Dutch?', '["zon","sun","son","sanne"]'::jsonb, 0, 1),
    (l, 'What is "moon" in Dutch?', '["moon","maan","mane","moan"]'::jsonb, 1, 2),
    (l, 'What is "rain" in Dutch?', '["regen","rain","reign","ragen"]'::jsonb, 0, 3),
    (l, 'What is "snow" in Dutch?', '["snow","sneeuw","snauw","sneeu"]'::jsonb, 1, 4),
    (l, 'What is "tree" in Dutch?', '["boom","tree","tre","bom"]'::jsonb, 0, 5),
    (l, 'What does "koud" mean?', '["cold","cloud","could","code"]'::jsonb, 0, 6),
    (l, 'What does "warm" mean?', '["warm","worm","worn","woman"]'::jsonb, 0, 7),
    (l, 'What does "bos" mean?', '["boss","forest","bus","box"]'::jsonb, 1, 8),
    (l, 'What does "zee" mean?', '["sea","see","say","so"]'::jsonb, 0, 9),
    (l, 'Translate: "It is raining."', '["Het regent.","Het is regen.","Regen het.","Het regenen."]'::jsonb, 0, 10),
    (l, 'Translate: "It is cold."', '["Het is koud.","Het koud is.","Koud het is.","Is het koud."]'::jsonb, 0, 11),
    (l, 'Which word is identical in Dutch and English?', '["zon","maan","wind","boom"]'::jsonb, 2, 12);

  -- ═══════ LESSON 7 — Food & Drink ═══════
  INSERT INTO lessons (mission_id, title, order_index, content, is_final_exam, pass_threshold)
  VALUES (s, 'Food & Drink — The Dutch Table', 7, $c$
# 🍞 Food & Drink — The Dutch Table

Food cognates are everywhere. Trade routes spread the same words across Europe for centuries.

---

## 🍎 01 What You Eat

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| apple | appel |
| banana | banaan |
| tomato | tomaat |
| bread | brood |
| cheese | kaas |
| egg | ei |
| fish | vis |
| rice | rijst |
| soup | soep |
| butter | boter |

---

## ☕ 02 What You Drink

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| water | water |
| milk | melk |
| coffee | koffie |
| tea | thee |
| wine | wijn |
| beer | bier |
| juice | sap |

---

## 🎯 03 New Verbs

| Dutch | English |
|---|---|
| eet | eat |
| drink | drink |

Frames:

**Ik eet ___.** (I eat ___.)

**Ik drink ___.** (I drink ___.)

Examples:

- Ik eet brood.
- Ik eet een appel.
- Ik drink koffie.
- Ik drink water.
- Wij drinken wijn.

---

## 💡 04 Meridian Insight

> Bread has no article when uncountable.

**Ik eet brood.** ✅

**Ik eet een brood.** ❌ (unless you mean "a loaf")

This is the same rule in English: *I eat bread* — not *I eat a bread*.

---

# 🎉 Side Quest Complete

You now possess:
- 17 food + drink words
- Verbs **eet** and **drink**
- 2 new frames

Test your understanding before moving on.
  $c$, false, 80) RETURNING id INTO l;

  INSERT INTO quiz_questions (lesson_id, question, options, correct_index, order_index) VALUES
    (l, 'What is "apple" in Dutch?', '["appel","apple","apel","appl"]'::jsonb, 0, 1),
    (l, 'What is "bread" in Dutch?', '["bread","brood","brod","broad"]'::jsonb, 1, 2),
    (l, 'What is "cheese" in Dutch?', '["cheese","kaas","kas","chese"]'::jsonb, 1, 3),
    (l, 'What is "milk" in Dutch?', '["milk","melk","melc","malc"]'::jsonb, 1, 4),
    (l, 'What is "coffee" in Dutch?', '["coffee","koffie","kofi","cofe"]'::jsonb, 1, 5),
    (l, 'What is "tea" in Dutch?', '["tea","thee","tee","the"]'::jsonb, 1, 6),
    (l, 'What is "wine" in Dutch?', '["wine","wijn","wein","win"]'::jsonb, 1, 7),
    (l, 'What is "beer" in Dutch?', '["beer","bier","bere","bear"]'::jsonb, 1, 8),
    (l, 'What does "ei" mean?', '["egg","eye","eight","a"]'::jsonb, 0, 9),
    (l, 'Translate: "I drink coffee."', '["Ik drink koffie.","Ik eet koffie.","Koffie ik drink.","Ik heb koffie."]'::jsonb, 0, 10),
    (l, 'Translate: "I eat bread."', '["Ik eet brood.","Ik drink brood.","Ik heb brood.","Brood ik eet."]'::jsonb, 0, 11),
    (l, 'Which is correct?', '["Ik eet een brood.","Ik eet brood.","Ik drink brood.","Brood eet ik een."]'::jsonb, 1, 12);

  -- ═══════ LESSON 8 — Time, Numbers & Family ═══════
  INSERT INTO lessons (mission_id, title, order_index, content, is_final_exam, pass_threshold)
  VALUES (s, 'Time, Numbers & Family', 8, $c$
# ⏰ Time, Numbers & Family

Two domains that come up constantly. Time to own them.

---

## 📅 01 Time

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| day | dag |
| week | week |
| month | maand |
| year | jaar |
| hour | uur |
| minute | minuut |
| today | vandaag |
| tomorrow | morgen |
| morning | morgen |
| evening | avond |
| night | nacht |

> ⚠️ **morgen** is a double agent:
> - **de morgen** = the morning
> - **morgen** = tomorrow
> Context decides.

---

## 🔢 02 Numbers 1–10

| # | English | Dutch |
|---|---|---|
| 1 | one | een |
| 2 | two | twee |
| 3 | three | drie |
| 4 | four | vier |
| 5 | five | vijf |
| 6 | six | zes |
| 7 | seven | zeven |
| 8 | eight | acht |
| 9 | nine | negen |
| 10 | ten | tien |

---

## 👨‍👩‍👧 03 Family

| 🇬🇧 English | 🇳🇱 Dutch |
|---|---|
| father | vader |
| mother | moeder |
| brother | broer |
| sister | zus |
| son | zoon |
| daughter | dochter |
| grandfather | grootvader |
| grandmother | grootmoeder |

---

## 🎯 04 Sentences

- **Ik heb twee broers.** *(I have two brothers.)*
- **Mijn moeder is lief.** *(My mother is kind.)*
- **Vandaag is het maandag.** *(Today is Monday.)*
- **Het is drie uur.** *(It is three o'clock.)*

New word: **mijn** = my.

---

## 💡 05 Meridian Insight

> Family words use **mijn**, not **ik heb**.

**Mijn moeder** is more natural than *Ik heb een moeder* — like English "my mother" vs. "I have a mother".

---

# 🎉 Side Quest Complete

You now possess:
- 11 time words
- 10 numbers
- 8 family words
- Pronouns **mijn**

Test your understanding before moving on.
  $c$, false, 80) RETURNING id INTO l;

  INSERT INTO quiz_questions (lesson_id, question, options, correct_index, order_index) VALUES
    (l, 'What is "day" in Dutch?', '["dag","day","dach","dah"]'::jsonb, 0, 1),
    (l, 'What is "week" in Dutch?', '["week","wik","weke","weeke"]'::jsonb, 0, 2),
    (l, 'What is "year" in Dutch?', '["year","jaar","yar","jar"]'::jsonb, 1, 3),
    (l, 'What does "uur" mean?', '["our","hour","your","year"]'::jsonb, 1, 4),
    (l, 'What does "morgen" mean?', '["morning / tomorrow","morrow","morgan","moor"]'::jsonb, 0, 5),
    (l, 'What is "three" in Dutch?', '["three","drie","tre","tri"]'::jsonb, 1, 6),
    (l, 'What is "seven" in Dutch?', '["seven","zeven","seve","sevene"]'::jsonb, 1, 7),
    (l, 'What is "mother" in Dutch?', '["moeder","mother","muder","moder"]'::jsonb, 0, 8),
    (l, 'What is "brother" in Dutch?', '["brother","broer","bruder","brair"]'::jsonb, 1, 9),
    (l, 'What does "mijn" mean?', '["me","my","mine","main"]'::jsonb, 1, 10),
    (l, 'Translate: "I have two brothers."', '["Ik heb twee broers.","Ik heb twee broer.","Twee broers ik heb.","Ik ben twee broers."]'::jsonb, 0, 11),
    (l, 'What is "five" in Dutch?', '["five","vijf","fijf","fiv"]'::jsonb, 1, 12);

  -- ═══════ LESSON 9 — False Friends ═══════
  INSERT INTO lessons (mission_id, title, order_index, content, is_final_exam, pass_threshold)
  VALUES (s, 'False Friends — Words That Trick You', 9, $c$
# ⚠️ False Friends — Words That Trick You

Not every similar word means the same thing. Some look like English but mean something else. Learn to spot them early.

---

## 🚨 01 The Big Traps

| 🇳🇱 Dutch | Looks like | Actually means |
|---|---|---|
| brood | brood | bread |
| room | room | cream |
| bos | boss | forest |
| meer | mere | lake / more |
| wil | will | want |
| rook | rook | smoke |
| pad | pad | path / toad |
| doos | dose | box |

One word can completely change the meaning of a sentence.

---

## 🎯 02 Context Saves You

Even if a false friend trips you up, the sentence rescues you.

- **Ik eet brood met kaas.** → You *eat* brood, so it means **bread**, not offspring.

- **Ik wil een doos.** → You *want* a box, not a dose of medicine.

---

## 💡 03 Meridian Insight

> Meaning lives in the sentence, not the word.

Reading the whole sentence is a superpower. Individual words can lie; sentences tell the truth.

---

## 🎯 04 New Words to Remember

| Dutch | English |
|---|---|
| met | with |
| wil | want |
| het meer | the lake |
| de doos | the box |

---

# 🎉 Side Quest Complete

You now possess:
- 8 false-friend warnings
- The habit of reading full sentences

Test your understanding before moving on.
  $c$, false, 80) RETURNING id INTO l;

  INSERT INTO quiz_questions (lesson_id, question, options, correct_index, order_index) VALUES
    (l, 'What does "brood" mean in Dutch?', '["bread","brood (offspring)","bird","big"]'::jsonb, 0, 1),
    (l, 'What does "room" mean in Dutch?', '["room","cream","roof","rum"]'::jsonb, 1, 2),
    (l, 'What does "bos" mean in Dutch?', '["boss","forest","bus","box"]'::jsonb, 1, 3),
    (l, 'What does "meer" mean?', '["lake / more","mere","sea","mirror"]'::jsonb, 0, 4),
    (l, 'What does "wil" mean?', '["will","want","wheel","wild"]'::jsonb, 1, 5),
    (l, 'What does "doos" mean?', '["dose","box","does","door"]'::jsonb, 1, 6),
    (l, 'What does "rook" mean?', '["smoke","rook","rock","role"]'::jsonb, 0, 7),
    (l, 'What does "pad" mean?', '["path / toad","pad","paddle","paw"]'::jsonb, 0, 8),
    (l, 'What does "met" mean?', '["met","with","made","mate"]'::jsonb, 1, 9),
    (l, 'Which word is a false friend?', '["hand","bed","room","lamp"]'::jsonb, 2, 10),
    (l, 'Translate: "I eat bread with cheese."', '["Ik eet brood met kaas.","Ik eet kaas met brood.","Ik heb brood.","Brood met kaas eet ik."]'::jsonb, 0, 11),
    (l, 'Why do false friends not fully trip you up?', '["You ignore them","Context in the sentence","Dutch has no false friends","The dictionary helps"]'::jsonb, 1, 12);

  -- ═══════ LESSON 10 — SAGA 1.1 EXAM ═══════
  INSERT INTO lessons (mission_id, title, order_index, content, is_final_exam, pass_threshold)
  VALUES (s, 'SAGA 1.1 EXAM — Cognate Vault Mastery', 10, $c$
# 🏆 SAGA 1.1 EXAM — Cognate Vault Mastery

You have completed all nine Side Quests of Saga 1.1.

This exam tests everything you have learned:
- The Cognate Vault (identical + shifted words)
- The body
- Home & objects
- Nature & weather
- Food & drink
- Time, numbers, family
- False friends

---

## 📋 Exam Structure

| Section | Questions | Topic |
|---|---|---|
| A | 1–8 | Vocabulary recall |
| B | 9–14 | English → Dutch translation |
| C | 15–17 | Sound shift recognition |
| D | 18–20 | False friends |

**Total: 20 questions.**

---

## ✅ Passing Criteria

**65% (13 correct out of 20)** to clear Saga 1.1.

Below that, you will need to retake the exam. There is no penalty — retake as many times as you need.

---

## 🎯 What This Exam Proves

Passing means you now hold:
- 80+ Dutch words
- 5 sentence frames
- The foundation needed to build sentences in Saga 1.2

Passing unlocks **Saga 1.2 — The Sound Engine**.

---

## 💡 Final Reminder

> Read every option. The wrong answers are designed to look right.

- **zon** vs *sun* (identical spelling? no)
- **brood** vs *bread* (false friend?)
- **vinger** vs *finger* (shifted consonant?)

Trust the pattern. Trust the shift.

---

# 🎉 Ready?

Click **Finish Mission → Take Exam** to begin.
  $c$, true, 65) RETURNING id INTO l;

  INSERT INTO quiz_questions (lesson_id, question, options, correct_index, order_index) VALUES
    (l, 'What is "water" in Dutch?', '["water","watter","watr","waater"]'::jsonb, 0, 1),
    (l, 'What is "finger" in Dutch?', '["finger","vinger","fingr","vingr"]'::jsonb, 1, 2),
    (l, 'What is "book" in Dutch?', '["book","boek","bock","buk"]'::jsonb, 1, 3),
    (l, 'What is "sun" in Dutch?', '["sun","zon","son","sunn"]'::jsonb, 1, 4),
    (l, 'What is "cheese" in Dutch?', '["cheese","kaas","kas","chese"]'::jsonb, 1, 5),
    (l, 'What is "father" in Dutch?', '["father","vader","fader","fater"]'::jsonb, 1, 6),
    (l, 'What is "apple" in Dutch?', '["apple","appel","apel","appl"]'::jsonb, 1, 7),
    (l, 'What is "mother" in Dutch?', '["moeder","mother","muder","moder"]'::jsonb, 0, 8),
    (l, 'Translate: "I have a book."', '["Ik heb een boek.","Ik heb boek.","Ik ben boek.","Boek ik heb."]'::jsonb, 0, 9),
    (l, 'Translate: "It is raining."', '["Het regent.","Het is regen.","Regen het.","Het regenen."]'::jsonb, 0, 10),
    (l, 'Translate: "I drink coffee."', '["Ik drink koffie.","Ik eet koffie.","Koffie ik drink.","Ik heb koffie."]'::jsonb, 0, 11),
    (l, 'Translate: "I eat bread."', '["Ik eet brood.","Ik drink brood.","Ik heb brood.","Brood ik eet."]'::jsonb, 0, 12),
    (l, 'Translate: "The sun is warm."', '["De zon is warm.","Het zon is warm.","Zon is warm.","Warm is de zon."]'::jsonb, 0, 13),
    (l, 'Translate: "I have two brothers."', '["Ik heb twee broers.","Ik heb twee broer.","Twee broers ik heb.","Ik ben twee broers."]'::jsonb, 0, 14),
    (l, 'Which shift is correct?', '["finger → vinger","finger → pinger","finger → binger","finger → winger"]'::jsonb, 0, 15),
    (l, 'Which shift is correct?', '["foot → voet","foot → fout","foot → fut","foot → foet"]'::jsonb, 0, 16),
    (l, 'Which word has a vowel shift?', '["hand → hand","moon → maan","water → water","bed → bed"]'::jsonb, 1, 17),
    (l, 'Which is a false friend?', '["hand","room","water","lamp"]'::jsonb, 1, 18),
    (l, 'What does "room" mean in Dutch?', '["room","cream","roof","rum"]'::jsonb, 1, 19),
    (l, 'What does "bos" mean in Dutch?', '["boss","forest","bus","box"]'::jsonb, 1, 20);
END $saga11b$;
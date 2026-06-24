import React, { useState, useEffect, useRef, useMemo } from "react";

// ── Vocab Data ────────────────────────────────────────────────────────────────
const DEFAULT_VOCAB = [
  // Chapter 4
  { greek: "ἄγγελος, -ου, ὁ *", hint: "EN: angel • FR: ange", english: "messenger, angel", chapter: 4 },
  { greek: "ἀμήν *", english: "truly, verily, amen, so let it be", chapter: 4 },
  { greek: "ἄνθρωπος, -ου, ὁ *", hint: "EN: anthropology — study of humankind", english: "man, person, human being, people, mankind", chapter: 4 },
  { greek: "ἀπόστολος, -ου, ὁ *", hint: "EN: apostle — one sent out", english: "apostle, envoy, messenger", chapter: 4 },
  { greek: "Γαλιλαία, -ας, ἡ", english: "Galilee", chapter: 4 },
  { greek: "γραφή, -ῆς, ἡ *", hint: "EN: graphic, biography — written things", english: "writing, scripture", chapter: 4 },
  { greek: "δόξα, -ης, ἡ *", hint: "EN: doxology — hymn of glory • FR: gloire", english: "glory, majesty, fame", chapter: 4 },
  { greek: "ἐγώ *", english: "I", chapter: 4 },
  { greek: "ἔσχατος, -η, -ον *", english: "last", chapter: 4 },
  { greek: "ζωή, -ῆς, ἡ *", hint: "EN: zoo, zoology — living things • FR: zoologie", english: "life", chapter: 4 },
  { greek: "θεός, -οῦ, ὁ *", hint: "EN: theology, theist • FR: théologie", english: "God, god", chapter: 4 },
  { greek: "καί *", english: "and, even, also, namely", chapter: 4 },
  { greek: "καρδία, -ας, ἡ *", hint: "EN: cardiac, cardiology • FR: cardiaque", english: "heart, inner self", chapter: 4 },
  { greek: "κόσμος, -ου, ὁ *", hint: "EN: cosmos, cosmopolitan • FR: cosmos", english: "world, universe, mankind", chapter: 4 },
  { greek: "λόγος, -ου, ὁ *", hint: "EN: logic, -logy suffix (theology etc.) — word/reason", english: "word, statement, message", chapter: 4 },
  { greek: "πνεῦμα, -ατος, τό *", hint: "EN: pneumatic, pneumonia • FR: pneumatique", english: "spirit, wind, breath, inner life", chapter: 4 },
  { greek: "προφήτης, -ου, ὁ *", english: "prophet", chapter: 4 },
  { greek: "σάββατον, -ου, τό *", hint: "Hebrew loanword: shabbat — the day of rest", english: "Sabbath, week", chapter: 4 },
  { greek: "φωνή, -ῆς, ἡ *", hint: "EN: phone, phonics, symphony • FR: phonique", english: "sound, noise, voice", chapter: 4 },
  { greek: "Χριστός, -οῦ, ὁ *", hint: "EN: Christ — the anointed one", english: "Christ, Messiah, anointed one", chapter: 4 },
  { greek: "Ἀβραάμ", english: "Abraham", chapter: 4 },
  { greek: "Δαυίδ", english: "David", chapter: 4 },
  { greek: "Παῦλος, -ου, ὁ", english: "Paul", chapter: 4 },
  { greek: "Πέτρος, -ου, ὁ", english: "Peter", chapter: 4 },
  { greek: "Πιλᾶτος, -ου, ὁ", english: "Pilate", chapter: 4 },
  { greek: "Σίμων, -ωνος, ὁ", english: "Simon", chapter: 4 },

  // Chapter 6
  { greek: "ἀγάπη, -ης, ἡ *", hint: "EN: agape — selfless, unconditional love", english: "love", chapter: 6 },
  { greek: "ἄλλος, -η, -ο *", english: "other, another", chapter: 6 },
  { greek: "βασιλεία, -ας, ἡ *", hint: "FR: basilique (basilica) — a royal hall", english: "kingdom", chapter: 6 },
  { greek: "δέ *", english: "but, and", chapter: 6 },
  { greek: "ἐν *", hint: "EN: endemic, energy — in, within • FR: endémique", english: "in, on, among", chapter: 6 },
  { greek: "ἔργον, -ου, τό *", hint: "EN: energy, ergonomics • FR: énergie (ἐν + ἔργον)", english: "work, deed", chapter: 6 },
  { greek: "καιρός, -οῦ, ὁ *", english: "time, season", chapter: 6 },
  { greek: "νῦν *", english: "adv. now | noun. the present", chapter: 6 },
  { greek: "ὁ, ἡ, τό *", english: "the (definite article)", chapter: 6 },
  { greek: "ὅτι *", english: "that, since, because", chapter: 6 },
  { greek: "οὐ, οὐκ, οὐχ *", english: "not", chapter: 6 },
  { greek: "αὐτός, -ή, -ό *", hint: "EN: auto- prefix (self) — automobile = self-moving", english: "sing. he, she, it, him, her | pl. they, them | also: same, self", chapter: 6 },
  { greek: "ὥρα, -ας, ἡ *", hint: "EN/FR: horoscope — ὥρα + σκοπέω (hour-watcher)", english: "hour, occasion, moment", chapter: 6 },

  // Chapter 7
  { greek: "ἁμαρτία, -ας, ἡ *", hint: "From ἁμαρτάνω — to miss the mark (archery term)", english: "sin", chapter: 7 },
  { greek: "ἀρχή, -ῆς, ἡ *", english: "beginning", chapter: 7 },
  { greek: "γάρ *", english: "for, because, then, or", chapter: 7 },
  { greek: "εἶπεν", english: "he/she/it said", chapter: 7 },
  { greek: "εἰς *", english: "into", chapter: 7 },
  { greek: "ἐξουσία, -ας, ἡ *", hint: "FR: pouvoir — the right and power to act", english: "authority, power", chapter: 7 },
  { greek: "εὐαγγέλιον, -ου, τό *", hint: "εὖ (good) + ἄγγελος (messenger) — good news", english: "good news, gospel", chapter: 7 },
  { greek: "Ἰησοῦς, -οῦ, ὁ", english: "Jesus, Joshua", chapter: 7 },
  { greek: "κύριος, -ου, ὁ *", hint: "EN: Kyrie eleison — Lord have mercy (liturgy)", english: "lord, master, sir", chapter: 7 },
  { greek: "μή *", english: "not, lest (with non-indicative moods)", chapter: 7 },
  { greek: "μηδέ *", english: "nor, not even, lest", chapter: 7 },
  { greek: "οὐρανός, -οῦ, ὁ *", hint: "EN: Uranus — the heavenly planet • FR: Uranus", english: "heaven, sky", chapter: 7 },
  { greek: "οὗτος, αὕτη, τοῦτο *", english: "this one, these", chapter: 7 },
  { greek: "σύ, σοῦ *", english: "you (singular)", chapter: 7 },
  { greek: "υἱός, -οῦ, ὁ *", hint: "Think: υἱός τοῦ θεοῦ — Son of God", english: "son, descendant", chapter: 7 },
  { greek: "ὥστε *", english: "therefore, so that", chapter: 7 },

  // Chapter 8
  { greek: "ἀλλά *", english: "but, rather", chapter: 8 },
  { greek: "ἀπό *", english: "away from (gen.)", chapter: 8 },
  { greek: "εἰμί *", hint: "Think: I am — same as Latin sum, FR: je suis", english: "I am, exist, live", chapter: 8 },
  { greek: "ἐκ, ἐξ *", english: "from, out of (gen. only)", chapter: 8 },
  { greek: "ἡμέρα, -ας, ἡ *", english: "day", chapter: 8 },
  { greek: "ἦν", english: "he/she/it was", chapter: 8 },
  { greek: "θάλασσα, -ης, ἡ *", hint: "EN: thalassotherapy — sea therapy • FR: thalasso", english: "sea, lake", chapter: 8 },
  { greek: "θάνατος, -ου, ὁ *", hint: "EN: euthanasia — a good (eu) death • FR: thanatos", english: "death", chapter: 8 },
  { greek: "ἵνα *", english: "in order that, so that", chapter: 8 },
  { greek: "Ἰωάννης, -ου, ὁ", english: "John", chapter: 8 },
  { greek: "λέγω *", english: "I say, speak", chapter: 8 },
  { greek: "οἶκος, -ου, ὁ *", hint: "EN: ecology, economy (οἶκος + νόμος) • FR: écologie", english: "house, household (masc.)", chapter: 8 },
  { greek: "οἰκία, -ας, ἡ *", english: "house, household (fem.)", chapter: 8 },
  { greek: "ὄχλος, -ου, ὁ *", english: "crowd", chapter: 8 },
  { greek: "παραβολή, -ῆς, ἡ *", english: "parable", chapter: 8 },
  { greek: "πρός *", english: "to, towards (acc.)", chapter: 8 },
  { greek: "διά *", hint: "EN: diameter, dialogue — through • FR: dialogue", english: "through (gen.) / because of (acc.)", chapter: 8 },
  { greek: "μετά *", hint: "EN: metamorphosis — after/with • FR: métamorphose", english: "with (gen.) / after (acc.)", chapter: 8 },
  { greek: "παρά *", hint: "EN: parallel, parable — beside • FR: parallèle", english: "beside, from (gen.) / with (dat.) / alongside (acc.)", chapter: 8 },
  { greek: "ὑπό *", hint: "EN: hypo- prefix — under, beneath • FR: hypo", english: "under (gen.) / by means of (acc.)", chapter: 8 },

  // Chapter 9
  { greek: "ἀγαθός, -ή, -όν *", hint: "EN: Agatha — a good/kind name", english: "good, useful", chapter: 9 },
  { greek: "ἀγαπητός, -ή, -όν *", english: "beloved", chapter: 9 },
  { greek: "ἅγιος, -α, -ον *", hint: "EN: hagiography — writing about holy people", english: "holy, saints", chapter: 9 },
  { greek: "αἰώνιος, -ον *", english: "eternal", chapter: 9 },
  { greek: "ἀλλήλων *", english: "one another", chapter: 9 },
  { greek: "ἀπεκρίθη", english: "he/she/it answered", chapter: 9 },
  { greek: "δοῦλος, -ου, ὁ *", hint: "Paul calls himself δοῦλος Χριστοῦ — slave of Christ", english: "slave, servant", chapter: 9 },
  { greek: "ἐάν *", english: "if, when", chapter: 9 },
  { greek: "ἐμός, ἐμή, ἐμόν *", english: "my, mine (emphatic)", chapter: 9 },
  { greek: "μου *", english: "my (simple genitive)", chapter: 9 },
  { greek: "ἐντολή, -ῆς, ἡ *", hint: "Think: the Ten Commandments — ἐντολαί", english: "commandment", chapter: 9 },
  { greek: "καθώς *", english: "as, even as", chapter: 9 },
  { greek: "κακός, -ή, -όν *", english: "bad, evil (general)", chapter: 9 },
  { greek: "νεκρός, -ά, -όν *", english: "dead, dead body", chapter: 9 },
  { greek: "πιστός, -ή, -όν *", english: "faithful, believing", chapter: 9 },
  { greek: "πονηρός, -ά, -όν *", english: "evil, bad (active malice)", chapter: 9 },
  { greek: "πρῶτος, -η, -ον *", english: "first, earlier", chapter: 9 },
  { greek: "τρίτος, -η, -ον *", english: "third", chapter: 9 },

  // Chapter 10
  { greek: "εἰ *", english: "if", chapter: 10 },
  { greek: "εἰ μή *", english: "if not, except", chapter: 10 },
  { greek: "εἷς, μία, ἕν *", english: "one (masc./fem./neut.)", chapter: 10 },
  { greek: "ἤδη *", english: "now, already", chapter: 10 },
  { greek: "ὄνομα, -ατος, τό *", hint: "EN: onomatopoeia — a name-making word • FR: nom", english: "name, reputation", chapter: 10 },
  { greek: "οὐδείς, οὐδεμία, οὐδέν *", english: "no one, none, nothing", chapter: 10 },
  { greek: "πᾶς, πᾶσα, πᾶν *", english: "each, every, all", chapter: 10 },
  { greek: "περί *", hint: "EN: perimeter, peripheral — around • FR: périmètre", english: "concerning, about (gen.) / around (acc.)", chapter: 10 },
  { greek: "σάρξ, σαρκός, ἡ *", hint: "EN: sarcophagus — flesh-eating stone coffin", english: "flesh, body", chapter: 10 },
  { greek: "σύν *", english: "with (dat.)", chapter: 10 },
  { greek: "σῶμα, -ατος, τό *", hint: "EN: somatic, psychosomatic — of the body", english: "body", chapter: 10 },
  { greek: "τέκνον, -ου, τό *", hint: "EN: technology (τέχνη — craft/skill, same family)", english: "child, descendant", chapter: 10 },
  { greek: "τίς, τί *", english: "who? what? which? why? (interrogative)", chapter: 10 },
  { greek: "τις, τι *", english: "someone, something, a certain one (indefinite)", chapter: 10 },

  // Chapter 11
  { greek: "ἀδελφός, -οῦ, ὁ *", hint: "EN: Philadelphia — city of brotherly love", english: "brother", chapter: 11 },
  { greek: "ἄν", english: "untranslatable particle (conditional/potential)", chapter: 11 },
  { greek: "ἀνήρ, ἀνδρός, ὁ *", english: "man, husband", chapter: 11 },
  { greek: "ἐκκλησία, -ας, ἡ *", hint: "ἐκ (out of) + καλέω (to call) — the called-out ones", english: "church, assembly, congregation", chapter: 11 },
  { greek: "ἐλπίς, -ίδος, ἡ *", hint: "Pandora's box — ἐλπίς (hope) was left inside", english: "hope, expectation", chapter: 11 },
  { greek: "ἔξω *", english: "without, outside", chapter: 11 },
  { greek: "ἐπί *", hint: "EN: epidemic, epitaph — upon, over • FR: épidémie", english: "on, over, on the basis of (gen.) / at, on (dat.) / to, against (acc.)", chapter: 11 },
  { greek: "ἡμεῖς *", english: "we (plural)", chapter: 11 },
  { greek: "θέλω *", english: "I will, desire", chapter: 11 },
  { greek: "ἰδού / ἴδε *", english: "see! behold!", chapter: 11 },
  { greek: "καλός, -ή, -όν *", english: "good, beautiful", chapter: 11 },
  { greek: "μήτηρ, μητρός, ἡ *", hint: "EN: maternal, matriarch • FR: mère", english: "mother", chapter: 11 },
  { greek: "οὐδέ *", english: "and not, not even, neither, nor", chapter: 11 },
  { greek: "πατήρ, πατρός, ὁ *", hint: "EN: paternal, patriarch • FR: père", english: "father", chapter: 11 },
  { greek: "πίστις, -εως, ἡ *", hint: "EN: faith — the root of fidelity and trust", english: "faith, belief, trust, teaching", chapter: 11 },
  { greek: "ὕδωρ, ὕδατος, τό *", hint: "EN: hydrant, hydraulic, dehydrate • FR: hydratation", english: "water", chapter: 11 },
  { greek: "ὑμεῖς *", english: "you (plural)", chapter: 11 },
  { greek: "φῶς, φωτός, τό *", hint: "EN: photo, photography — writing with light • FR: photo", english: "light", chapter: 11 },
  { greek: "χάρις, -ιτος, ἡ *", hint: "EN: charisma — a gift of grace • FR: charisme", english: "grace, favor, kindness", chapter: 11 },
  { greek: "ὧδε *", english: "here", chapter: 11 },

  // Chapter 12
  { greek: "αἰών, -ῶνος, ὁ *", hint: "EN: aeon — a long age • FR: éon", english: "age, eternity", chapter: 12 },
  { greek: "διδάσκαλος, -ου, ὁ *", hint: "EN: didactic — intended to teach • FR: didactique", english: "teacher", chapter: 12 },
  { greek: "εὐθύς *", hint: "εὖ (well/straight) — going straight, immediately", english: "immediately", chapter: 12 },
  { greek: "ἕως *", english: "until, as far as", chapter: 12 },
  { greek: "μαθητής, -οῦ, ὁ *", hint: "EN: mathematics — from μανθάνω (to learn)", english: "disciple", chapter: 12 },
  { greek: "μέν *", english: "on the one hand, indeed", chapter: 12 },
  { greek: "μηδείς, μηδεμία, μηδέν *", english: "no one, nothing (3 forms)", chapter: 12 },
  { greek: "μόνος, -η, -ον *", english: "alone, only", chapter: 12 },
  { greek: "ὅπως *", english: "how, in order that", chapter: 12 },
  { greek: "ὅσος, -η, -ον *", english: "as great as, as many as", chapter: 12 },
  { greek: "οὖν *", english: "therefore", chapter: 12 },
  { greek: "ὀφθαλμός, -οῦ, ὁ *", hint: "EN: ophthalmologist — eye doctor • FR: ophtalmologiste", english: "eye, sight", chapter: 12 },
  { greek: "πάλιν *", english: "again", chapter: 12 },
  { greek: "πούς, ποδός, ὁ *", hint: "EN: podiatry, tripod • FR: podiatre", english: "foot", chapter: 12 },
  { greek: "ὑπέρ *", hint: "EN: hyper- prefix — over, above, beyond • FR: hyper", english: "in behalf of (gen.) / above (acc.)", chapter: 12 },

  // Chapter 13
  { greek: "γυνή, γυναικός, ἡ *", hint: "EN: gynecology • FR: gynécologie", english: "woman, wife", chapter: 13 },
  { greek: "δικαιοσύνη, -ης, ἡ *", hint: "From δίκαιος (righteous) — the state of being right/just", english: "righteousness", chapter: 13 },
  { greek: "δώδεκα *", english: "twelve", chapter: 13 },
  { greek: "ἑαυτοῦ, -ῆς, -οῦ *", english: "himself, herself, itself, themselves", chapter: 13 },
  { greek: "ἐκεῖνος, -η, -ο *", english: "that man/woman/thing, those", chapter: 13 },
  { greek: "ἤ *", english: "or, than", chapter: 13 },
  { greek: "κἀγώ *", hint: "Contraction: καί + ἐγώ = and I / but I", english: "and I, but I (= καί + ἐγώ)", chapter: 13 },
  { greek: "μακάριος, -α, -ον *", english: "blessed, happy", chapter: 13 },
  { greek: "μέγας, μεγάλη, μέγα *", hint: "EN: mega-, megaphone — large • FR: méga", english: "large, great", chapter: 13 },
  { greek: "πόλις, -εως, ἡ *", hint: "EN: politics, police, metropolis • FR: politique", english: "city, town", chapter: 13 },
  { greek: "πολύς, πολλή, πολύ *", hint: "EN: polygon, polyglot — many • FR: polygone", english: "much, many, often", chapter: 13 },
  { greek: "πῶς *", english: "how", chapter: 13 },
  { greek: "σημεῖον, -ου, τό *", hint: "EN: semiotics — the study of signs", english: "sign, miracle", chapter: 13 },

  // Chapter 14
  { greek: "ἀλήθεια, -ας, ἡ *", hint: "ἀ (not) + λήθη (forgetfulness) — un-forgetting = truth", english: "truth", chapter: 14 },
  { greek: "εἰρήνη, -ης, ἡ *", hint: "EN/FR name: Irene / Irène — means peace", english: "peace", chapter: 14 },
  { greek: "ἐνώπιον *", english: "before, in the presence of (gen.)", chapter: 14 },
  { greek: "ἐπαγγελία, -ας, ἡ *", hint: "ἐπί + ἀγγέλλω (to announce) — a proclaimed promise", english: "promise", chapter: 14 },
  { greek: "ἑπτά *", english: "seven", chapter: 14 },
  { greek: "θρόνος, -ου, ὁ *", hint: "EN: throne — borrowed directly into English", english: "throne", chapter: 14 },
  { greek: "Ἰερουσαλήμ / Ἱεροσόλυμα", english: "Jerusalem", chapter: 14 },
  { greek: "κατά *", hint: "EN: cataclysm, catalog, catapult — down/against prefix", english: "down from, against (gen.) / according to, throughout, during (acc.)", chapter: 14 },
  { greek: "κεφαλή, -ῆς, ἡ *", hint: "EN: encephalitis — inflammation of the head/brain", english: "head", chapter: 14 },
  { greek: "ὁδός, -οῦ, ἡ *", hint: "EN: exodus (ἐξ + ὁδός = way out), method (μετά + ὁδός) • Note: feminine despite -ος ending!", english: "way, road, journey, conduct (fem.!)", chapter: 14 },
  { greek: "ὅς, ἥ, ὅ *", hint: "Relative pronoun — who, whom, which (refers back to noun)", english: "who, whom, which (relative pronoun, 3 forms)", chapter: 14 },
  { greek: "ὅτε *", english: "when", chapter: 14 },
  { greek: "οὕτως *", english: "thus, so, in this manner", chapter: 14 },
  { greek: "πλοῖον, -ου, τό *", hint: "Picture the disciples in their boat on the Sea of Galilee", english: "ship, boat", chapter: 14 },
  { greek: "ῥῆμα, -ατος, τό *", hint: "EN: rhetoric — the art of words/speaking", english: "word, saying", chapter: 14 },
  { greek: "τε *", english: "and, so (postpositive particle)", chapter: 14 },
  { greek: "χείρ, χειρός, ἡ *", hint: "EN: chiropractor, chirography — hand work • FR: chirurgie", english: "hand", chapter: 14 },
  { greek: "ψυχή, -ῆς, ἡ *", hint: "EN: psychology, psychiatry • FR: psychologie", english: "life, soul, self", chapter: 14 },

  // Personal Pronouns — ἐγώ (I/me)
  { greek: "ἐγώ", hint: "EN: ego — the self", english: "I (nom. sg.)", chapter: 11 },
  { greek: "ἐμοῦ / μου", hint: "ἐμοῦ is emphatic; μου is unemphatic", english: "of me, my (gen. sg.)", chapter: 11 },
  { greek: "ἐμοί / μοι", hint: "ἐμοί is emphatic; μοι is unemphatic", english: "to/for me (dat. sg.)", chapter: 11 },
  { greek: "ἐμέ / με", hint: "ἐμέ is emphatic; με is unemphatic", english: "me (acc. sg.)", chapter: 11 },
  { greek: "ἡμεῖς", hint: "EN: hemi- prefix (half of us?) — we", english: "we (nom. pl.)", chapter: 11 },
  { greek: "ἡμῶν", hint: "Genitive plural of ἐγώ", english: "of us, our (gen. pl.)", chapter: 11 },
  { greek: "ἡμῖν", hint: "Dative plural of ἐγώ", english: "to/for us (dat. pl.)", chapter: 11 },
  { greek: "ἡμᾶς", hint: "Accusative plural of ἐγώ", english: "us (acc. pl.)", chapter: 11 },

  // Personal Pronouns — σύ (you)
  { greek: "σύ", hint: "FR: tu — you (singular)", english: "you (nom. sg.)", chapter: 11 },
  { greek: "σοῦ / σου", hint: "σοῦ is emphatic; σου is unemphatic", english: "of you, your (gen. sg.)", chapter: 11 },
  { greek: "σοί / σοι", hint: "σοί is emphatic; σοι is unemphatic", english: "to/for you (dat. sg.)", chapter: 11 },
  { greek: "σέ / σε", hint: "σέ is emphatic; σε is unemphatic", english: "you (acc. sg.)", chapter: 11 },
  { greek: "ὑμεῖς", hint: "2nd person plural — you all", english: "you all (nom. pl.)", chapter: 11 },
  { greek: "ὑμῶν", hint: "Genitive plural of σύ", english: "of you all, your (gen. pl.)", chapter: 11 },
  { greek: "ὑμῖν", hint: "Dative plural of σύ", english: "to/for you all (dat. pl.)", chapter: 11 },
  { greek: "ὑμᾶς", hint: "Accusative plural of σύ", english: "you all (acc. pl.)", chapter: 11 },

  // Postpositives
  { greek: "δέ", hint: "Postpositive — never first in its clause", english: "but, and (postpositive)", chapter: 6 },
  { greek: "γάρ", hint: "Postpositive — explains or gives reason for previous statement", english: "for, because, then (postpositive)", chapter: 7 },
  { greek: "οὖν", hint: "Postpositive — draws conclusion from what preceded • FR: donc (therefore)", english: "therefore, then (postpositive)", chapter: 12 },
  { greek: "μέν", hint: "Postpositive — almost always followed by δέ: μέν...δέ = on one hand...on the other", english: "on the one hand (postpositive)", chapter: 12 },
  { greek: "τε", hint: "Postpositive — weaker than καί; often in τε...καί = both...and", english: "and, so (postpositive)", chapter: 14 },
  { greek: "ἄν", hint: "Postpositive — makes verbs conditional or potential; untranslatable alone", english: "(conditional particle, postpositive)", chapter: 11 },
  { greek: "δή", hint: "Postpositive — adds emphasis or urgency to what precedes", english: "indeed, now, therefore (postpositive)", chapter: 11 },

  // Present Active Indicative Verbs
  { greek: "λύω", hint: "1st sg. — I loose/destroy. Pattern: -ω", english: "I loose, destroy", chapter: 15 },
  { greek: "λύεις", hint: "2nd sg. — you loose. Pattern: -εις", english: "you loose, destroy", chapter: 15 },
  { greek: "λύει", hint: "3rd sg. — he/she/it looses. Pattern: -ει", english: "he/she/it looses, destroys", chapter: 15 },
  { greek: "λύομεν", hint: "1st pl. — we loose. Pattern: -ομεν", english: "we loose, destroy", chapter: 15 },
  { greek: "λύετε", hint: "2nd pl. — you all loose. Pattern: -ετε", english: "you all loose, destroy", chapter: 15 },
  { greek: "λύουσι(ν)", hint: "3rd pl. — they loose. Pattern: -ουσι(ν)", english: "they loose, destroy", chapter: 15 },

  { greek: "πιστεύω", hint: "1st sg. — I believe. EN: pistol (faithfulness)", english: "I believe", chapter: 15 },
  { greek: "πιστεύεις", hint: "2nd sg. — you believe", english: "you believe", chapter: 15 },
  { greek: "πιστεύει", hint: "3rd sg. — he/she/it believes", english: "he/she/it believes", chapter: 15 },
  { greek: "πιστεύομεν", hint: "1st pl. — we believe", english: "we believe", chapter: 15 },
  { greek: "πιστεύετε", hint: "2nd pl. — you all believe", english: "you all believe", chapter: 15 },
  { greek: "πιστεύουσι(ν)", hint: "3rd pl. — they believe", english: "they believe", chapter: 15 },

  { greek: "γινώσκω", hint: "1st sg. — I know. EN: gnostic, agnostic", english: "I know", chapter: 15 },
  { greek: "γινώσκεις", hint: "2nd sg. — you know", english: "you know", chapter: 15 },
  { greek: "γινώσκει", hint: "3rd sg. — he/she/it knows", english: "he/she/it knows", chapter: 15 },
  { greek: "γινώσκομεν", hint: "1st pl. — we know", english: "we know", chapter: 15 },
  { greek: "γινώσκετε", hint: "2nd pl. — you all know", english: "you all know", chapter: 15 },
  { greek: "γινώσκουσι(ν)", hint: "3rd pl. — they know", english: "they know", chapter: 15 },

  { greek: "λέγω", hint: "1st sg. — I say, speak. EN: lexicon, logic", english: "I say, speak", chapter: 15 },
  { greek: "λέγεις", hint: "2nd sg. — you say, speak", english: "you say, speak", chapter: 15 },
  { greek: "λέγει", hint: "3rd sg. — he/she/it says, speaks", english: "he/she/it says, speaks", chapter: 15 },
  { greek: "λέγομεν", hint: "1st pl. — we say, speak", english: "we say, speak", chapter: 15 },
  { greek: "λέγετε", hint: "2nd pl. — you all say, speak", english: "you all say, speak", chapter: 15 },
  { greek: "λέγουσι(ν)", hint: "3rd pl. — they say, speak", english: "they say, speak", chapter: 15 },

  { greek: "ἔχω", hint: "1st sg. — I have, hold", english: "I have, hold", chapter: 15 },
  { greek: "ἔχεις", hint: "2nd sg. — you have, hold", english: "you have, hold", chapter: 15 },
  { greek: "ἔχει", hint: "3rd sg. — he/she/it has, holds", english: "he/she/it has, holds", chapter: 15 },
  { greek: "ἔχομεν", hint: "1st pl. — we have, hold", english: "we have, hold", chapter: 15 },
  { greek: "ἔχετε", hint: "2nd pl. — you all have, hold", english: "you all have, hold", chapter: 15 },
  { greek: "ἔχουσι(ν)", hint: "3rd pl. — they have, hold", english: "they have, hold", chapter: 15 },

  // Chapter 16
  { greek: "ἀκούω *", hint: "EN: acoustic — I hear, learn, obey", english: "I hear, learn, obey", chapter: 16 },
  { greek: "βλέπω *", hint: "EN: blepharoplasty (eyelid surgery) — I see", english: "I see, look at", chapter: 16 },
  { greek: "ἔχω *", hint: "1st sg. present active — I have, hold", english: "I have, hold", chapter: 16 },
  { greek: "λέγω *", hint: "EN: lexicon — I say, speak", english: "I say, speak", chapter: 16 },
  { greek: "λύω *", hint: "EN: analysis (ana + lysis) — loosening apart", english: "I loose, untie, destroy", chapter: 16 },
  { greek: "νόμος, -ου, ὁ *", hint: "EN: autonomy, astronomy — law/rule governing things", english: "law, principle", chapter: 16 },
  { greek: "ὅπου *", hint: "Relative adverb of place — where", english: "where", chapter: 16 },
  { greek: "πιστεύω *", hint: "From πίστις (faith) — I believe, have faith in", english: "I believe, have faith in", chapter: 16 },
  { greek: "πρόσωπον, -ου, τό *", hint: "πρός (toward) + ὤψ (eye) — what faces you", english: "face, appearance", chapter: 16 },
  { greek: "τυφλός, -ή, -όν *", hint: "Think of Typhlo- prefix meaning blind in medical terms", english: "blind", chapter: 16 },
  { greek: "τότε *", hint: "EN: think 'tot-ally then' — then, at that time", english: "then, thereafter", chapter: 16 },
  { greek: "χαρά, -ᾶς, ἡ *", hint: "Related to χάρις (grace) — joy flows from grace • FR: charisme", english: "joy, delight", chapter: 16 },

  // Chapter 17
  { greek: "ἀγαπάω *", hint: "From ἀγάπη — I love, cherish (contract verb)", english: "I love, cherish", chapter: 17 },
  { greek: "δαιμόνιον, -ου, τό *", hint: "EN: demon — borrowed directly • FR: démon", english: "demon", chapter: 17 },
  { greek: "ζητέω *", hint: "EN: zero in on something — I seek, desire, try to obtain", english: "I seek, desire, try to obtain", chapter: 17 },
  { greek: "καλέω *", hint: "EN: ecclesiastic (ἐκ + καλέω) — called out ones • FR: appeler", english: "I call, name, invite", chapter: 17 },
  { greek: "λαλέω *", hint: "Onomatopoeic — sounds like talking/babbling. I speak, say", english: "I speak, say", chapter: 17 },
  { greek: "οἶδα *", hint: "Perfect form with present meaning — irregular! EN: idea (something seen/known)", english: "I know, understand", chapter: 17 },
  { greek: "ὅταν *", hint: "ὅτε + ἄν = whenever (conditional temporal)", english: "whenever", chapter: 17 },
  { greek: "πλείων, πλεῖον *", hint: "Comparative of πολύς — EN: pleonasm (too many words)", english: "larger, greater, more", chapter: 17 },
  { greek: "πληρόω *", hint: "From πλήρης (full) — EN: plenary (full assembly) • FR: plénitude", english: "I fill, complete, fulfill", chapter: 17 },
  { greek: "ποιέω *", hint: "EN: poem, poet — a maker, one who creates", english: "I do, make", chapter: 17 },
  { greek: "τηρέω *", hint: "Think: to keep/guard carefully — I keep, guard, observe", english: "I keep, guard, observe", chapter: 17 },
];

// ── Storage Keys ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "gk-vocab";
const SCORES_KEY  = "gk-scores";
const QUIZ_KEY    = "gk-quiz";

// ── Storage helpers (with localStorage fallback) ───────────────────────────────
const store = {
  async get(key) {
    return localStorage.getItem(key);
  },
  async set(key, val) {
    localStorage.setItem(key, val);
  },
  async del(key) {
    localStorage.removeItem(key);
  },
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreKey(greek) {
  return greek.split(",")[0].replace(/\s*\*\s*$/, "").trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function normalizeStr(s) {
  return s.toLowerCase().trim().replace(/[.,;!?()\[\]]/g, "").replace(/\s+/g, " ");
}

function sortedWords(s) {
  return normalizeStr(s).split(/[\s,/]+/).filter(Boolean).sort().join(" ");
}

function isCorrect(userInput, correctAnswer) {
  const user = normalizeStr(userInput);
  const variants = correctAnswer.split("|").flatMap(v => v.split("/")).map(normalizeStr);
  const glosses  = correctAnswer.split(/[,/|]/).map(normalizeStr).filter(w => w.length > 1);
  for (const v of [...variants, ...glosses]) {
    if (!v) continue;
    if (user === v) return true;
    if (sortedWords(user) === sortedWords(v)) return true;
    const thresh = v.length >= 8 ? 2 : v.length >= 5 ? 1 : 0;
    if (levenshtein(user, v) <= thresh) return true;
    if (user.length > 3 && v.includes(user)) return true;
    if (v.length > 3 && user.includes(v)) return true;
  }
  return false;
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const DARK = {
  bg:"#111118", card:"#1e1e2c", cardBorder:"#383850",
  text:"#f0ead8", textMuted:"#9a9080", textFaint:"#5a5450",
  gold:"#e8c060", goldBg:"rgba(232,192,96,0.15)", goldBorder:"rgba(232,192,96,0.45)",
  inputBg:"#2a2a3a", inputBorder:"#484860",
  btnGhost:"#252535", btnGhostBorder:"#484860", btnGhostText:"#c0b898",
  tableBorder:"#383850", progressBg:"#2a2a3a", statLabel:"#6a6458",
  correctBg:"#183428", correctText:"#50e880", correctBorder:"#38885a",
  wrongBg:"#3a1818", wrongText:"#ff6868", wrongBorder:"#884040",
  missedBorder:"#c08030",
};
const LIGHT = {
  bg:"#f4efe4", card:"#ffffff", cardBorder:"#d8d0c0",
  text:"#1a1610", textMuted:"#605848", textFaint:"#908070",
  gold:"#7a5808", goldBg:"rgba(122,88,8,0.09)", goldBorder:"rgba(122,88,8,0.4)",
  inputBg:"#ede8dc", inputBorder:"#c0b8a8",
  btnGhost:"#ede8dc", btnGhostBorder:"#c0b8a8", btnGhostText:"#504838",
  tableBorder:"#d8d0c0", progressBg:"#d8d0c0", statLabel:"#908070",
  correctBg:"#c8f0d8", correctText:"#1a5530", correctBorder:"#50a870",
  wrongBg:"#f8d8d8", wrongText:"#7a1818", wrongBorder:"#c06060",
  missedBorder:"#c08030",
};

function mkS(t) {
  const isD = t === DARK;
  return {
    root:{ minHeight:"100vh", background:t.bg, color:t.text, fontFamily:"Georgia,'Times New Roman',serif", position:"relative" },
    bgLayer:{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
      background: isD
        ? "radial-gradient(ellipse at 20% 10%,#1c1040 0%,transparent 55%),radial-gradient(ellipse at 80% 90%,#0d2030 0%,transparent 55%)"
        : "radial-gradient(ellipse at 20% 10%,#ece4f4 0%,transparent 55%),radial-gradient(ellipse at 80% 90%,#d8eaf5 0%,transparent 55%)" },
    page:{ position:"relative", zIndex:1, maxWidth:560, margin:"0 auto", padding:"24px 16px 64px" },
    card:{ background:t.card, border:"1px solid "+t.cardBorder, borderRadius:12, padding:"18px 20px", marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.08)" },
    secTitle:{ margin:"0 0 14px", fontSize:12, letterSpacing:2, textTransform:"uppercase", color:t.gold, fontWeight:700 },
    label:{ display:"block", fontSize:12, color:t.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:7, marginTop:14, fontWeight:600 },
    primaryBtn:{ display:"block", width:"100%", padding:"14px", marginTop:16, background:t.gold, border:"none", borderRadius:8, color:isD?"#111":"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:1 },
    ghostBtn:{ display:"block", width:"100%", padding:"11px", marginTop:8, background:t.btnGhost, border:"1px solid "+t.btnGhostBorder, borderRadius:8, color:t.btnGhostText, fontSize:14, cursor:"pointer", fontFamily:"inherit", fontWeight:500 },
    toggle:{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:4 },
    toggleBtn:{ padding:"8px 15px", borderRadius:6, border:"1px solid "+t.cardBorder, background:t.btnGhost, color:t.textMuted, cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:500 },
    toggleActive:{ background:t.goldBg, borderColor:t.gold, color:t.gold, fontWeight:700 },
    chapterBtn:{ padding:"7px 12px", borderRadius:6, border:"1px solid "+t.cardBorder, background:t.btnGhost, color:t.textMuted, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:500 },
    chapterActive:{ background:t.correctBg, borderColor:t.correctBorder, color:t.correctText, fontWeight:700 },
    input:{ width:"100%", padding:"13px 16px", background:t.inputBg, border:"2px solid "+t.inputBorder, borderRadius:8, color:t.text, fontSize:16, fontFamily:"inherit", outline:"none", boxSizing:"border-box" },
    feedbackOk:{ padding:"13px", borderRadius:8, fontSize:16, fontWeight:700, textAlign:"center", background:t.correctBg, color:t.correctText, border:"1px solid "+t.correctBorder },
    feedbackBad:{ padding:"13px", borderRadius:8, fontSize:16, fontWeight:700, textAlign:"center", background:t.wrongBg, color:t.wrongText, border:"1px solid "+t.wrongBorder },
    feedbackMid:{ padding:"13px", borderRadius:8, fontSize:15, fontWeight:700, textAlign:"center", background:isD?"#2a3a1a":"#d8f0c0", color:isD?"#a0d860":"#2a5010", border:"1px solid "+(isD?"#4a7a2a":"#70b040") },
    gradeOk:{ flex:1, padding:"13px", border:"1px solid "+t.correctBorder, borderRadius:8, background:t.correctBg, color:t.correctText, fontSize:15, cursor:"pointer", fontFamily:"inherit", fontWeight:700 },
    gradeBad:{ flex:1, padding:"13px", border:"1px solid "+t.wrongBorder, borderRadius:8, background:t.wrongBg, color:t.wrongText, fontSize:15, cursor:"pointer", fontFamily:"inherit", fontWeight:700 },
    hintBtn:{ width:"100%", padding:"10px 14px", background:t.goldBg, border:"1px solid "+t.goldBorder, borderRadius:8, color:t.gold, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:600 },
    hintBox:{ padding:"12px 14px", background:t.goldBg, border:"1px solid "+t.goldBorder, borderRadius:8, color:t.gold, fontSize:13, lineHeight:1.6 },
    quizHdr:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 },
    backBtn:{ background:"none", border:"none", color:t.textMuted, cursor:"pointer", fontSize:14, fontFamily:"inherit", fontWeight:600 },
    progressBar:{ height:4, background:t.progressBg, borderRadius:2, marginBottom:24, overflow:"hidden" },
    progressFill:{ height:"100%", background:t.gold, borderRadius:2, transition:"width 0.3s" },
    statStrip:{ display:"flex", justifyContent:"center", gap:28, marginBottom:16 },
    statNum:{ display:"block", fontSize:28, color:t.gold, fontWeight:300 },
    statLabel:{ display:"block", fontSize:11, color:t.statLabel, textTransform:"uppercase", letterSpacing:1 },
    refTabs:{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" },
    refTab:{ padding:"7px 13px", borderRadius:6, border:"1px solid "+t.cardBorder, background:t.btnGhost, color:t.textMuted, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:600 },
    refTabActive:{ background:t.goldBg, borderColor:t.gold, color:t.gold, fontWeight:700 },
    th:{ padding:"8px 10px", textAlign:"left", fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:1, fontWeight:700, borderBottom:"2px solid "+t.tableBorder },
    tdLabel:{ padding:"8px 10px", color:t.textMuted, fontSize:12, whiteSpace:"nowrap", fontWeight:600 },
    tdGreek:{ padding:"8px 10px", color:t.text, fontSize:15, borderBottom:"1px solid "+t.tableBorder },
    refNote:{ margin:"10px 0 0", fontSize:13, color:t.textMuted, lineHeight:1.6 },
    themeTgl:{ background:t.btnGhost, border:"1px solid "+t.btnGhostBorder, borderRadius:20, padding:"5px 14px", cursor:"pointer", color:t.textMuted, fontSize:13, fontFamily:"inherit", fontWeight:600 },
    select:{ background:t.inputBg, border:"1px solid "+t.inputBorder, borderRadius:6, color:t.text, padding:"7px 12px", fontFamily:"inherit", fontSize:13 },
    wordGreek:{ fontSize:17, color:t.text, fontWeight:600 },
    wordEn:{ fontSize:12, color:t.textMuted },
    pctGood:{ fontSize:11, padding:"2px 7px", borderRadius:4, fontWeight:700, background:t.correctBg, color:t.correctText },
    pctBad:{ fontSize:11, padding:"2px 7px", borderRadius:4, fontWeight:700, background:t.wrongBg, color:t.wrongText },
    deleteBtn:{ background:"none", border:"none", color:t.textFaint, cursor:"pointer", fontSize:14, padding:"2px 4px" },
    flashcard:{ width:"100%", minHeight:200, background:t.card, border:"2px solid "+t.cardBorder, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:32, boxShadow:"0 4px 20px rgba(0,0,0,0.1)" },
    questionCard:{ background:t.card, border:"2px solid "+t.cardBorder, borderRadius:12, padding:"32px 24px", textAlign:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" },
  };
}

// ── Square of Stops ───────────────────────────────────────────────────────────
const STOPS = {
  "Labial-Voiceless":"π","Labial-Voiced":"β","Labial-Aspirate":"φ","Labial-+σ":"ψ",
  "Velar-Voiceless":"κ","Velar-Voiced":"γ","Velar-Aspirate":"χ","Velar-+σ":"ξ",
  "Dental-Voiceless":"τ","Dental-Voiced":"δ","Dental-Aspirate":"θ","Dental-+σ":"σ",
};
const STOP_ROWS = ["Labial","Velar","Dental"];
const STOP_COLS = ["Voiceless","Voiced","Aspirate","+σ"];

function SquareOfStops({ s, t }) {
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState(false);
  const [sel, setSel] = useState(null);
  const pool = useMemo(() => shuffle(Object.values(STOPS)), []);
  const place = (key) => {
    if (!sel) return;
    setPlaced(p => ({ ...p, [key]: sel }));
    setChecked(false); setSel(null);
  };
  const reset = () => { setPlaced({}); setChecked(false); setSel(null); };
  const numOk = checked ? Object.entries(STOPS).filter(([k,v]) => placed[k]===v).length : 0;
  const total = Object.keys(STOPS).length;
  return (
    <div style={s.card}>
      <div style={s.secTitle}>Square of Stops (Mutes)</div>
      <p style={s.refNote}>Tap a letter to select it (it will highlight), then tap the correct cell.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
        <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Letters Pool</div>
        {pool.map((l, i) => {
          const usedCount = Object.values(placed).filter(v => v===l).length;
          const totalCount = Object.values(STOPS).filter(v => v===l).length;
          const isSel = sel === l;
          return (
            <div key={i} onClick={() => setSel(isSel ? null : l)}
              style={{ padding:"6px 14px", background:isSel ? t.goldBg : t.card, border:"1px solid "+(isSel ? t.gold : t.cardBorder), borderRadius:6, color:isSel ? t.gold : t.text, fontSize:22, cursor:"pointer", userSelect:"none", opacity:usedCount >= totalCount ? 0.25 : 1 }}>
              {l}
            </div>
          );
        })}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr>
              <th style={s.th}></th>
              {STOP_COLS.map(c => <th key={c} style={{ ...s.th, textAlign:"center" }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {STOP_ROWS.map(row => (
              <tr key={row}>
                <td style={{ ...s.tdLabel, fontStyle:"italic" }}>{row}</td>
                {STOP_COLS.map(col => {
                  const key = row+"-"+col;
                  const val = placed[key];
                  const ok = checked && val === STOPS[key];
                  const bad = checked && val && val !== STOPS[key];
                  const missed = checked && !val;
                  return (
                    <td key={col} onClick={() => sel ? place(key) : val ? (setPlaced(p => { const n={...p}; delete n[key]; return n; }), setChecked(false)) : null}
                      style={{ padding:"8px 4px", textAlign:"center", minWidth:64, borderRadius:6, cursor:"pointer",
                        border: ok?"2px solid "+t.correctBorder : bad?"2px solid "+t.wrongBorder : missed?"2px solid "+t.missedBorder : sel?"2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
                        background: ok?t.correctBg : bad?t.wrongBg : "transparent" }}>
                      {val
                        ? <span style={{ fontSize:22, color:ok?t.correctText:bad?t.wrongText:t.text }}>{val}</span>
                        : missed ? <span style={{ fontSize:16, color:t.missedBorder }}>{STOPS[key]}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
        <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
      </div>
      {checked && (
        <div style={{ marginTop:10, ...(numOk===total ? s.feedbackOk : numOk > 8 ? s.feedbackMid : s.feedbackBad) }}>
          {numOk}/{total} correct {numOk===total ? "🏆" : "— missed cells shown in orange"}
        </div>
      )}
      <div style={{ marginTop:14 }}>
        {[["Labials + σ","π β φ → all become ψ"],["Velars + σ","κ γ χ → all become ξ"],["Dentals + σ","τ δ θ → all become σ"]].map(([title,rule]) => (
          <div key={title} style={{ padding:"8px 12px", marginBottom:6, background:t.inputBg, borderRadius:6, borderLeft:"3px solid "+t.goldBorder }}>
            <div style={{ fontSize:11, color:t.gold, marginBottom:2 }}>{title}</div>
            <div style={{ fontSize:14, color:t.textMuted }}>{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Postpositives ─────────────────────────────────────────────────────────────
const POSTPOS = [
  { word:"δέ",  meaning:"but, and",                    note:"Most common postpositive — always the 2nd word in its clause. Never first!" },
  { word:"γάρ", meaning:"for, because, then",           note:"Explains or gives reason for the previous statement" },
  { word:"οὖν", meaning:"therefore, then",              note:"Draws a conclusion from what preceded • FR: donc" },
  { word:"μέν", meaning:"on the one hand",              note:"Almost always followed by δέ — μέν...δέ = on one hand...on the other" },
  { word:"τε",  meaning:"and, so",                      note:"Weaker than καί; often in τε...καί = both...and" },
  { word:"ἄν",  meaning:"(conditional particle)",       note:"Makes verbs conditional or potential — untranslatable alone" },
  { word:"δή",  meaning:"indeed, now, therefore",       note:"Adds emphasis or urgency to what precedes" },
];

function Postpositives({ s, t }) {
  const [quizMode, setQuizMode] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [score, setScore] = useState({ correct:0, total:0 });
  const reset = () => { setRevealed({}); setScore({ correct:0, total:0 }); };
  return (
    <div style={s.card}>
      <div style={s.secTitle}>Postpositive Words</div>
      <p style={s.refNote}>These words cannot stand first in their clause — they are always the 2nd word or later.</p>
      <div style={{ display:"flex", gap:8, margin:"12px 0" }}>
        {[["ref","Reference"],["quiz","Quiz Me"]].map(([k,l]) => (
          <button key={k} style={(!quizMode && k==="ref") || (quizMode && k==="quiz") ? { ...s.toggleBtn, ...s.toggleActive } : s.toggleBtn}
            onClick={() => { setQuizMode(k==="quiz"); reset(); }}>{l}</button>
        ))}
      </div>
      {!quizMode ? (
        <div>
          {POSTPOS.map(p => (
            <div key={p.word} style={{ padding:"12px", marginBottom:8, background:t.inputBg, borderRadius:8, borderLeft:"3px solid "+t.goldBorder }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:4 }}>
                <span style={{ fontSize:22, color:t.text }}>{p.word}</span>
                <span style={{ fontSize:14, color:t.gold, fontWeight:600 }}>{p.meaning}</span>
              </div>
              <div style={{ fontSize:12, color:t.textMuted, lineHeight:1.5 }}>{p.note}</div>
            </div>
          ))}
          <p style={s.refNote}>💡 If δέ or γάρ appears, something must precede it in the clause even if it looks first in English translation.</p>
        </div>
      ) : (
        <div>
          {score.total > 0 && <div style={{ fontSize:13, color:t.textMuted, marginBottom:10 }}>Score: {score.correct}/{score.total}</div>}
          {POSTPOS.map(p => (
            <div key={p.word} style={{ marginBottom:8, borderRadius:8, overflow:"hidden", border:"1px solid "+t.cardBorder }}>
              <div onClick={() => setRevealed(r => ({ ...r, [p.word]: !r[p.word] }))}
                style={{ padding:"14px 16px", background:t.card, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:24, color:t.text }}>{p.word}</span>
                <span style={{ fontSize:12, color:t.textFaint }}>{revealed[p.word] ? "▲ hide" : "▼ reveal"}</span>
              </div>
              {revealed[p.word] && (
                <div style={{ padding:"12px 16px", background:t.inputBg }}>
                  <div style={{ fontSize:15, color:t.gold, fontWeight:600, marginBottom:3 }}>{p.meaning}</div>
                  <div style={{ fontSize:12, color:t.textMuted, marginBottom:12 }}>{p.note}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={s.gradeOk} onClick={() => setScore(sc => ({ correct:sc.correct+1, total:sc.total+1 }))}>✓ Knew it</button>
                    <button style={s.gradeBad} onClick={() => setScore(sc => ({ ...sc, total:sc.total+1 }))}>✗ Missed it</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button style={s.ghostBtn} onClick={reset}>Reset Quiz</button>
        </div>
      )}
    </div>
  );
}

// ── Case Endings ──────────────────────────────────────────────────────────────
const CE_ROWS_SG = ["Nom.Sg","Gen.Sg","Dat.Sg","Acc.Sg"];
const CE_ROWS_PL = ["Nom.Pl","Gen.Pl","Dat.Pl","Acc.Pl"];
const CE_COLS    = ["2nd Masc","1st Fem","2nd Neut","3rd"];
const CE_LABELS_R = { "Nom.Sg":"Nom. Sg.","Gen.Sg":"Gen. Sg.","Dat.Sg":"Dat. Sg.","Acc.Sg":"Acc. Sg.","Nom.Pl":"Nom. Pl.","Gen.Pl":"Gen. Pl.","Dat.Pl":"Dat. Pl.","Acc.Pl":"Acc. Pl." };
const CE_LABELS_C = { "2nd Masc":"2nd Masc.","1st Fem":"1st Fem.","2nd Neut":"2nd Neut.","3rd":"3rd" };
const CE_ANS = {
  "Nom.Sg-2nd Masc":"-ος","Nom.Sg-1st Fem":"-η / -α","Nom.Sg-2nd Neut":"-ον","Nom.Sg-3rd":"—",
  "Gen.Sg-2nd Masc":"-ου","Gen.Sg-1st Fem":"-ης / -ας","Gen.Sg-2nd Neut":"-ου","Gen.Sg-3rd":"-ος",
  "Dat.Sg-2nd Masc":"-ῳ","Dat.Sg-1st Fem":"-ῃ / -ᾳ","Dat.Sg-2nd Neut":"-ῳ","Dat.Sg-3rd":"-ι",
  "Acc.Sg-2nd Masc":"-ον","Acc.Sg-1st Fem":"-ην / -αν","Acc.Sg-2nd Neut":"-ον","Acc.Sg-3rd":"-α",
  "Nom.Pl-2nd Masc":"-οι","Nom.Pl-1st Fem":"-αι","Nom.Pl-2nd Neut":"-α","Nom.Pl-3rd":"-ες",
  "Gen.Pl-2nd Masc":"-ων","Gen.Pl-1st Fem":"-ων","Gen.Pl-2nd Neut":"-ων","Gen.Pl-3rd":"-ων",
  "Dat.Pl-2nd Masc":"-οις","Dat.Pl-1st Fem":"-αις","Dat.Pl-2nd Neut":"-οις","Dat.Pl-3rd":"-σι(ν)",
  "Acc.Pl-2nd Masc":"-ους","Acc.Pl-1st Fem":"-ας","Acc.Pl-2nd Neut":"-α","Acc.Pl-3rd":"-ας",
};

function CaseEndings({ s, t }) {
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState(false);
  const [sel, setSel] = useState(null);
  const pool = useMemo(() => shuffle([...new Set(Object.values(CE_ANS))]), []);
  const place = (key) => {
    if (!sel) return;
    setPlaced(p => ({ ...p, [key]: sel }));
    setChecked(false); setSel(null);
  };
  const reset = () => { setPlaced({}); setChecked(false); setSel(null); };
  const numOk = checked ? Object.entries(CE_ANS).filter(([k,v]) => placed[k]===v).length : 0;
  const total = Object.keys(CE_ANS).length;
  const allRows = [...CE_ROWS_SG, ...CE_ROWS_PL];
  return (
    <div style={s.card}>
      <div style={s.secTitle}>Case Endings — All Four Declensions</div>
      <p style={s.refNote}>Tap an ending to select it, then tap a cell to place it. Tap a filled cell to remove it.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
        <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Endings Pool</div>
        {pool.map((e, i) => {
          const used = Object.values(placed).filter(v => v===e).length;
          const need = Object.values(CE_ANS).filter(v => v===e).length;
          const isSel = sel===e;
          return (
            <div key={i} onClick={() => setSel(isSel ? null : e)}
              style={{ padding:"5px 10px", background:isSel?t.goldBg:t.card, border:"1px solid "+(isSel?t.gold:t.cardBorder), borderRadius:6, color:isSel?t.gold:t.text, fontSize:14, cursor:"pointer", userSelect:"none", opacity:used>=need?0.25:1 }}>
              {e}
            </div>
          );
        })}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:360 }}>
          <thead>
            <tr>
              <th style={s.th}></th>
              {CE_COLS.map(c => <th key={c} style={{ ...s.th, textAlign:"center" }}>{CE_LABELS_C[c]}</th>)}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, idx) => (
              <React.Fragment key={row}>
                {idx === 4 && (
                  <tr>
                    <td colSpan={5} style={{ padding:"4px 0 2px", borderTop:"2px solid "+t.goldBorder }}>
                      <span style={{ fontSize:10, color:t.gold, textTransform:"uppercase", letterSpacing:1, opacity:0.6 }}>── plural ──</span>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={s.tdLabel}>{CE_LABELS_R[row]}</td>
                  {CE_COLS.map(col => {
                    const key = row+"-"+col;
                    const val = placed[key];
                    const ok = checked && val===CE_ANS[key];
                    const bad = checked && val && val!==CE_ANS[key];
                    const missed = checked && !val;
                    return (
                      <td key={col}
                        onClick={() => sel ? place(key) : val ? (setPlaced(p => { const n={...p}; delete n[key]; return n; }), setChecked(false)) : null}
                        style={{ padding:"7px 4px", textAlign:"center", minWidth:70, borderRadius:6, cursor:"pointer",
                          border: ok?"2px solid "+t.correctBorder : bad?"2px solid "+t.wrongBorder : missed?"2px solid "+t.missedBorder : sel?"2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
                          background: ok?t.correctBg : bad?t.wrongBg : "transparent" }}>
                        {val
                          ? <span style={{ fontSize:13, color:ok?t.correctText:bad?t.wrongText:t.text }}>{val}</span>
                          : missed ? <span style={{ fontSize:11, color:t.missedBorder }}>{CE_ANS[key]}</span> : null}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
        <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
      </div>
      {checked && (
        <div style={{ marginTop:10, ...(numOk===total ? s.feedbackOk : numOk > total*0.7 ? s.feedbackMid : s.feedbackBad) }}>
          {numOk}/{total} correct {numOk===total ? "🏆" : "— missed cells in orange"}
        </div>
      )}
      <p style={{ ...s.refNote, marginTop:10 }}>💡 All four declensions share -ων in the genitive plural!</p>
    </div>
  );
}

// ── Preposition Diagram ───────────────────────────────────────────────────────
const PREP_ZONES = [
  { id:"hyper", label:"above",     x:"37%", y:"2%",  ans:"ὑπέρ" },
  { id:"epi",   label:"upon",      x:"37%", y:"17%", ans:"ἐπί"  },
  { id:"en",    label:"in",        x:"37%", y:"34%", ans:"ἐν"   },
  { id:"dia",   label:"through",   x:"37%", y:"50%", ans:"διά"  },
  { id:"hypo",  label:"under",     x:"37%", y:"66%", ans:"ὑπό"  },
  { id:"kata",  label:"down",      x:"37%", y:"82%", ans:"κατά" },
  { id:"para",  label:"← beside", x:"2%",  y:"42%", ans:"παρά" },
  { id:"pros",  label:"toward →",  x:"71%", y:"42%", ans:"πρός" },
  { id:"ek",    label:"out of",    x:"2%",  y:"18%", ans:"ἐκ"   },
  { id:"apo",   label:"away from", x:"71%", y:"18%", ans:"ἀπό"  },
  { id:"meta",  label:"with/after",x:"2%",  y:"66%", ans:"μετά" },
  { id:"eis",   label:"into →",    x:"71%", y:"66%", ans:"εἰς"  },
];

function PrepDiagram({ s, t }) {
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState(false);
  const [sel, setSel] = useState(null);
  const pool = useMemo(() => shuffle(PREP_ZONES.map(z => z.ans)), []);
  const place = (id) => {
    if (!sel) return;
    setPlaced(p => ({ ...p, [id]: sel }));
    setChecked(false); setSel(null);
  };
  const reset = () => { setPlaced({}); setChecked(false); setSel(null); };
  const numOk = checked ? PREP_ZONES.filter(z => placed[z.id]===z.ans).length : 0;
  return (
    <div style={s.card}>
      <div style={s.secTitle}>Preposition Diagram</div>
      <p style={s.refNote}>Tap a preposition to select it, then tap its position in the diagram.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
        <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Prepositions</div>
        {pool.map((p, i) => {
          const isSel = sel===p;
          const used = Object.values(placed).filter(v => v===p).length;
          return (
            <div key={i} onClick={() => setSel(isSel ? null : p)}
              style={{ padding:"5px 12px", background:isSel?t.goldBg:t.card, border:"1px solid "+(isSel?t.gold:t.cardBorder), borderRadius:6, color:isSel?t.gold:t.text, fontSize:17, cursor:"pointer", userSelect:"none", opacity:used>0?0.3:1 }}>
              {p}
            </div>
          );
        })}
      </div>
      <div style={{ position:"relative", width:"100%", paddingBottom:"72%", background:t.inputBg, border:"1px solid "+t.cardBorder, borderRadius:12, marginBottom:14 }}>
        <div style={{ position:"absolute", top:"46%", left:"50%", transform:"translate(-50%,-50%)", width:56, height:36, background:t.goldBg, border:"2px solid "+t.gold, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:t.gold, zIndex:2 }}>object</div>
        {PREP_ZONES.map(zone => {
          const val = placed[zone.id];
          const ok = checked && val===zone.ans;
          const bad = checked && val && val!==zone.ans;
          const missed = checked && !val;
          return (
            <div key={zone.id}
              onClick={() => sel ? place(zone.id) : val ? (setPlaced(p => { const n={...p}; delete n[zone.id]; return n; }), setChecked(false)) : null}
              style={{ position:"absolute", left:zone.x, top:zone.y, minWidth:64, padding:"4px 6px", textAlign:"center", cursor:"pointer", zIndex:3, borderRadius:8,
                border: ok?"2px solid "+t.correctBorder : bad?"2px solid "+t.wrongBorder : missed?"2px solid "+t.missedBorder : sel?"2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
                background: ok?t.correctBg : bad?t.wrongBg : t.card }}>
              <div style={{ fontSize:15, color:ok?t.correctText:bad?t.wrongText:t.text, minHeight:20 }}>
                {val || (missed ? <span style={{ fontSize:11, color:t.missedBorder }}>{zone.ans}</span> : "")}
              </div>
              <div style={{ fontSize:9, color:t.textFaint }}>{zone.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
        <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
      </div>
      {checked && (
        <div style={{ marginTop:10, ...(numOk===12 ? s.feedbackOk : numOk>6 ? s.feedbackMid : s.feedbackBad) }}>
          {numOk}/12 correct {numOk===12 ? "🏆" : "— missed zones in orange"}
        </div>
      )}
    </div>
  );
}

// ── Reference Charts ──────────────────────────────────────────────────────────
function ReferenceScreen({ s, t, onBack }) {
  const [tab, setTab] = useState("article");
  const tabs = [["article","Article"],["nouns","Nouns"],["pronouns","Pronouns"],["preps","Prepositions"],["verbs","Verbs (PAI)"]];
  return (
    <div style={s.page}>
      <div style={s.quizHdr}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <span style={{ color:t.textMuted, fontSize:14, fontWeight:600 }}>Reference Charts</span>
        <span />
      </div>
      <div style={s.refTabs}>
        {tabs.map(([k,l]) => (
          <button key={k} style={tab===k ? { ...s.refTab, ...s.refTabActive } : s.refTab} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==="article" && (
        <div style={s.card}>
          <div style={s.secTitle}>Definite Article — ὁ, ἡ, τό</div>
          <p style={s.refNote}>Agrees with its noun in case, number, and gender. Use it as a parsing aid!</p>
          <div style={{ overflowX:"auto", marginTop:12 }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr><th style={s.th}>Case</th><th style={{ ...s.th, textAlign:"center" }}>Masc.</th><th style={{ ...s.th, textAlign:"center" }}>Fem.</th><th style={{ ...s.th, textAlign:"center" }}>Neut.</th></tr></thead>
              <tbody>
                {[["Nom. Sg.","ὁ","ἡ","τό"],["Gen. Sg.","τοῦ","τῆς","τοῦ"],["Dat. Sg.","τῷ","τῇ","τῷ"],["Acc. Sg.","τόν","τήν","τό"],
                  ["Nom. Pl.","οἱ","αἱ","τά"],["Gen. Pl.","τῶν","τῶν","τῶν"],["Dat. Pl.","τοῖς","ταῖς","τοῖς"],["Acc. Pl.","τούς","τάς","τά"]].map(([c,m,f,n]) => (
                  <tr key={c}><td style={s.tdLabel}>{c}</td><td style={{ ...s.tdGreek, textAlign:"center" }}>{m}</td><td style={{ ...s.tdGreek, textAlign:"center" }}>{f}</td><td style={{ ...s.tdGreek, textAlign:"center" }}>{n}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={s.refNote}>💡 Rough breathing only on ὁ, ἡ, οἱ, αἱ — all τ- forms have smooth breathing.</p>
        </div>
      )}

      {tab==="nouns" && (
        <div>
          {[
            { title:"2nd Declension Masculine (e.g. λόγος)", heads:["Case","Sg.","Pl."], rows:[["Nom.","-ος","-οι"],["Gen.","-ου","-ων"],["Dat.","-ῳ","-οις"],["Acc.","-ον","-ους"],["Voc.","-ε","-οι"]] },
            { title:"2nd Declension Neuter (e.g. ἔργον)", heads:["Case","Sg.","Pl."], rows:[["Nom./Acc.","-ον","-α"],["Gen.","-ου","-ων"],["Dat.","-ῳ","-οις"]] },
            { title:"1st Declension Feminine (e.g. ἀγάπη / καρδία)", heads:["Case","-η Sg.","-α Sg.","Pl."], rows:[["Nom.","-η","-α","-αι"],["Gen.","-ης","-ας","-ων"],["Dat.","-ῃ","-ᾳ","-αις"],["Acc.","-ην","-αν","-ας"]] },
            { title:"3rd Declension (e.g. σάρξ / πίστις / σῶμα)", heads:["Case","Cons. Sg.","Cons. Pl.","-ις Sg.","-ις Pl.","-μα Sg.","-μα Pl."], rows:[["Nom.","—","-ες","-ις","-εις","-μα","-ματα"],["Gen.","-ος","-ων","-εως","-εων","-ματος","-μάτων"],["Dat.","-ι","-σι","-ει","-εσι","-ματι","-μασι"],["Acc.","-α","-ας","-ιν","-εις","-μα","-ματα"]] },
          ].map(({ title, heads, rows }) => (
            <div key={title} style={s.card}>
              <div style={s.secTitle}>{title}</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{heads.map(h => <th key={h} style={{ ...s.th, textAlign:h==="Case"?"left":"center" }}>{h}</th>)}</tr></thead>
                  <tbody>{rows.map(([c,...cells]) => (
                    <tr key={c}><td style={s.tdLabel}>{c}</td>{cells.map((v,i) => <td key={i} style={{ ...s.tdGreek, textAlign:"center" }}>{v}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
          <div style={s.card}>
            <p style={{ ...s.refNote, margin:0 }}>💡 Neuter nom. &amp; acc. are always identical. 3rd declension: always learn the genitive to find the stem!</p>
          </div>
        </div>
      )}

      {tab==="pronouns" && (
        <div>
          {[
            { title:"Personal Pronouns", heads:["Case","1st Sg.","1st Pl.","2nd Sg.","2nd Pl."],
              rows:[["Nom.","ἐγώ","ἡμεῖς","σύ","ὑμεῖς"],["Gen.","μου/ἐμοῦ","ἡμῶν","σου/σοῦ","ὑμῶν"],["Dat.","μοι/ἐμοί","ἡμῖν","σοι/σοί","ὑμῖν"],["Acc.","με/ἐμέ","ἡμᾶς","σε/σέ","ὑμᾶς"]] },
            { title:"αὐτός — he/she/it, same, self", heads:["Case","Masc.","Fem.","Neut."],
              rows:[["Nom. Sg.","αὐτός","αὐτή","αὐτό"],["Gen. Sg.","αὐτοῦ","αὐτῆς","αὐτοῦ"],["Dat. Sg.","αὐτῷ","αὐτῇ","αὐτῷ"],["Acc. Sg.","αὐτόν","αὐτήν","αὐτό"],["Nom. Pl.","αὐτοί","αὐταί","αὐτά"],["Gen. Pl.","αὐτῶν","αὐτῶν","αὐτῶν"],["Dat. Pl.","αὐτοῖς","αὐταῖς","αὐτοῖς"],["Acc. Pl.","αὐτούς","αὐτάς","αὐτά"]] },
            { title:"οὗτος (this) — Singular", heads:["Case","Masc.","Fem.","Neut."],
              rows:[["Nom.","οὗτος","αὕτη","τοῦτο"],["Gen.","τούτου","ταύτης","τούτου"],["Dat.","τούτῳ","ταύτῃ","τούτῳ"],["Acc.","τοῦτον","ταύτην","τοῦτο"]] },
            { title:"ἐκεῖνος (that) — Singular", heads:["Case","Masc.","Fem.","Neut."],
              rows:[["Nom.","ἐκεῖνος","ἐκείνη","ἐκεῖνο"],["Gen.","ἐκείνου","ἐκείνης","ἐκείνου"],["Dat.","ἐκείνῳ","ἐκείνῃ","ἐκείνῳ"],["Acc.","ἐκεῖνον","ἐκείνην","ἐκεῖνο"]] },
          ].map(({ title, heads, rows }) => (
            <div key={title} style={s.card}>
              <div style={s.secTitle}>{title}</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{heads.map(h => <th key={h} style={{ ...s.th, textAlign:h==="Case"?"left":"center" }}>{h}</th>)}</tr></thead>
                  <tbody>{rows.map(([c,...cells]) => (
                    <tr key={c}><td style={s.tdLabel}>{c}</td>{cells.map((v,i) => <td key={i} style={{ ...s.tdGreek, textAlign:"center" }}>{v}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="verbs" && (
        <div>
          <div style={s.card}>
            <div style={s.secTitle}>Present Active Indicative — Personal Endings</div>
            <p style={s.refNote}>These six endings attach to a verb's present stem and appear on virtually every present-tense verb in the NT.</p>
            <div style={{ overflowX:"auto", marginTop:12 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr><th style={s.th}>Person</th><th style={{...s.th,textAlign:"center"}}>Singular</th><th style={{...s.th,textAlign:"center"}}>Plural</th></tr></thead>
                <tbody>
                  <tr><td style={s.tdLabel}>1st</td><td style={{...s.tdGreek,textAlign:"center"}}>-ω</td><td style={{...s.tdGreek,textAlign:"center"}}>-ομεν</td></tr>
                  <tr><td style={s.tdLabel}>2nd</td><td style={{...s.tdGreek,textAlign:"center"}}>-εις</td><td style={{...s.tdGreek,textAlign:"center"}}>-ετε</td></tr>
                  <tr><td style={s.tdLabel}>3rd</td><td style={{...s.tdGreek,textAlign:"center"}}>-ει</td><td style={{...s.tdGreek,textAlign:"center"}}>-ουσι(ν)</td></tr>
                </tbody>
              </table>
            </div>
            <p style={s.refNote}>💡 Translation pattern: 1st sg. "I ___", 2nd sg. "you ___", 3rd sg. "he/she/it ___s", 1st pl. "we ___", 2nd pl. "you all ___", 3rd pl. "they ___".</p>
          </div>
          {[
            { verb:"λύω", meaning:"I loose, destroy" },
            { verb:"πιστεύω", meaning:"I believe" },
            { verb:"γινώσκω", meaning:"I know" },
            { verb:"λέγω", meaning:"I say, speak" },
            { verb:"ἔχω", meaning:"I have, hold" },
          ].map(({ verb, meaning }) => {
            const stem = verb.slice(0, -1);
            return (
              <div key={verb} style={s.card}>
                <div style={s.secTitle}>{verb} — {meaning}</div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><th style={s.th}>Person</th><th style={{...s.th,textAlign:"center"}}>Singular</th><th style={{...s.th,textAlign:"center"}}>Plural</th></tr></thead>
                    <tbody>
                      <tr><td style={s.tdLabel}>1st</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}ω</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}ομεν</td></tr>
                      <tr><td style={s.tdLabel}>2nd</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}εις</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}ετε</td></tr>
                      <tr><td style={s.tdLabel}>3rd</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}ει</td><td style={{...s.tdGreek,textAlign:"center"}}>{stem}ουσι(ν)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="preps" && (
        <div style={s.card}>
          <div style={s.secTitle}>Prepositions by Case</div>
          {[
            { label:"Genitive only", items:[["ἀπό","away from"],["ἐκ / ἐξ","out of, from"],["πρό","before"],["ἐνώπιον","before, in the presence of"]] },
            { label:"Dative only",   items:[["ἐν","in, on, among"],["σύν","with"]] },
            { label:"Accusative only", items:[["εἰς","into"]] },
            { label:"Genitive / Accusative", items:[["διά","through (gen.) / because of (acc.)"],["κατά","down from, against (gen.) / according to, during (acc.)"],["μετά","with (gen.) / after (acc.)"],["ὑπέρ","in behalf of (gen.) / above (acc.)"],["ὑπό","by (gen.) / under (acc.)"],["περί","about (gen.) / around (acc.)"]] },
            { label:"Gen. / Dat. / Acc.", items:[["ἐπί","on, over (gen.) / at (dat.) / to, against (acc.)"],["παρά","from beside (gen.) / beside, with (dat.) / alongside (acc.)"]] },
          ].map(group => (
            <div key={group.label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{group.label}</div>
              {group.items.map(([greek, meaning]) => (
                <div key={greek} style={{ display:"flex", gap:12, padding:"8px 12px", marginBottom:4, background:t.inputBg, borderLeft:"3px solid "+t.goldBorder, borderRadius:"0 6px 6px 0" }}>
                  <span style={{ fontSize:17, color:t.text, minWidth:80, fontFamily:"serif" }}>{greek}</span>
                  <span style={{ fontSize:13, color:t.textMuted, lineHeight:1.4 }}>{meaning}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── Word Lookup ───────────────────────────────────────────────────────────────
function LookupScreen({ s, t, vocab, scores, onBack }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const results = query.trim().length < 2 ? [] : vocab.filter(w => {
    const q = query.toLowerCase().trim();
    const eng = w.english.toLowerCase();
    const grk = w.greek.toLowerCase();
    return eng.includes(q) || grk.includes(q);
  });

  const sc = selected ? scores[scoreKey(selected.greek)] : null;
  const pct = sc && sc.total > 0 ? Math.round(sc.correct / sc.total * 100) : null;

  return (
    <div style={s.page}>
      <div style={s.quizHdr}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
        <span style={{ color:t.textMuted, fontSize:14, fontWeight:600 }}>Word Lookup</span>
        <span />
      </div>

      <div style={s.card}>
        <div style={s.secTitle}>Search</div>
        <input
          style={s.input}
          placeholder="Type English or Greek…"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          autoFocus
        />
        <p style={s.refNote}>Search by English meaning or Greek word. Partial matches work!</p>
      </div>

      {query.trim().length >= 2 && results.length === 0 && (
        <div style={{ ...s.card, textAlign:"center", color:t.textMuted }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🤔</div>
          No matches found for "{query}"
          <div style={{ fontSize:12, color:t.textFaint, marginTop:6 }}>Try a different spelling or check if the word appears in chapters 4–14.</div>
        </div>
      )}

      {results.length > 0 && !selected && (
        <div style={s.card}>
          <div style={s.secTitle}>{results.length} result{results.length!==1?"s":""}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {results.map((w, i) => {
              const wsc = scores[scoreKey(w.greek)];
              const wp = wsc && wsc.total > 0 ? Math.round(wsc.correct/wsc.total*100) : null;
              return (
                <div key={i} onClick={() => setSelected(w)}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"12px 14px", background:t.inputBg, borderRadius:8,
                    border:"1px solid "+t.cardBorder, cursor:"pointer" }}>
                  <div>
                    <div style={{ fontSize:20, color:t.text, fontWeight:600 }}>{w.greek.split(",")[0]}</div>
                    <div style={{ fontSize:13, color:t.textMuted, marginTop:2 }}>{w.english}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {wp !== null && (
                      <span style={wp>=70?s.pctGood:s.pctBad}>{wp}%</span>
                    )}
                    <span style={{ fontSize:11, color:t.textFaint }}>Ch {w.chapter}</span>
                    <span style={{ color:t.textFaint }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <div>
          <button style={{ ...s.ghostBtn, marginBottom:8 }} onClick={() => setSelected(null)}>
            ← Back to results
          </button>

          {/* Main word card */}
          <div style={{ ...s.card, textAlign:"center", borderColor:t.goldBorder }}>
            <div style={{ fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>Chapter {selected.chapter}</div>
            <div style={{ fontSize:48, color:t.text, marginBottom:6 }}>{selected.greek.split(",")[0]}</div>
            <div style={{ fontSize:15, color:t.gold, fontWeight:600, marginBottom:8 }}>{selected.english}</div>

            {/* Full lexical form */}
            <div style={{ fontSize:13, color:t.textMuted, padding:"8px 12px", background:t.inputBg, borderRadius:6, display:"inline-block", marginBottom:8 }}>
              {selected.greek}
            </div>

            {/* Score badge */}
            {sc && sc.total > 0 && (
              <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:8 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22, color:pct>=70?t.correctText:t.wrongText, fontWeight:300 }}>{pct}%</div>
                  <div style={{ fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1 }}>accuracy</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22, color:t.text, fontWeight:300 }}>{sc.correct}/{sc.total}</div>
                  <div style={{ fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1 }}>correct/seen</div>
                </div>
              </div>
            )}
            {(!sc || sc.total === 0) && (
              <div style={{ fontSize:12, color:t.textFaint, marginTop:4 }}>Not yet quizzed</div>
            )}
          </div>

          {/* Hint */}
          {selected.hint && (
            <div style={{ ...s.card, borderColor:t.goldBorder }}>
              <div style={s.secTitle}>Memory Hint</div>
              <div style={{ fontSize:14, color:t.gold, lineHeight:1.6 }}>💡 {selected.hint}</div>
            </div>
          )}

          {/* Related words — same chapter */}
          {(() => {
            const related = vocab.filter(w =>
              w.chapter === selected.chapter &&
              w.greek !== selected.greek
            ).slice(0, 6);
            if (related.length === 0) return null;
            return (
              <div style={s.card}>
                <div style={s.secTitle}>Other Ch {selected.chapter} Words</div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {related.map((w, i) => (
                    <div key={i} onClick={() => setSelected(w)}
                      style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"8px 10px", background:t.inputBg, borderRadius:6, cursor:"pointer",
                        border:"1px solid "+t.cardBorder }}>
                      <span style={{ fontSize:17, color:t.text }}>{w.greek.split(",")[0]}</span>
                      <span style={{ fontSize:13, color:t.textMuted }}>{w.english.split(",")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}


// ── Pronoun Drill ─────────────────────────────────────────────────────────────
const PRONOUN_TABLES = [
  {
    title: "ἐγώ — I / We",
    cols: ["1st Sg.", "1st Pl."],
    rows: ["Nom.", "Gen.", "Dat.", "Acc."],
    answers: {
      "Nom.-1st Sg.": "ἐγώ",     "Nom.-1st Pl.": "ἡμεῖς",
      "Gen.-1st Sg.": "μου/ἐμοῦ","Gen.-1st Pl.": "ἡμῶν",
      "Dat.-1st Sg.": "μοι/ἐμοί","Dat.-1st Pl.": "ἡμῖν",
      "Acc.-1st Sg.": "με/ἐμέ",  "Acc.-1st Pl.": "ἡμᾶς",
    },
  },
  {
    title: "σύ — You (sg.) / You (pl.)",
    cols: ["2nd Sg.", "2nd Pl."],
    rows: ["Nom.", "Gen.", "Dat.", "Acc."],
    answers: {
      "Nom.-2nd Sg.": "σύ",      "Nom.-2nd Pl.": "ὑμεῖς",
      "Gen.-2nd Sg.": "σου/σοῦ", "Gen.-2nd Pl.": "ὑμῶν",
      "Dat.-2nd Sg.": "σοι/σοί", "Dat.-2nd Pl.": "ὑμῖν",
      "Acc.-2nd Sg.": "σε/σέ",   "Acc.-2nd Pl.": "ὑμᾶς",
    },
  },
  {
    title: "αὐτός — He / She / It",
    cols: ["Masc.", "Fem.", "Neut."],
    rows: ["Nom. Sg.", "Gen. Sg.", "Dat. Sg.", "Acc. Sg.", "Nom. Pl.", "Gen. Pl.", "Dat. Pl.", "Acc. Pl."],
    answers: {
      "Nom. Sg.-Masc.": "αὐτός", "Nom. Sg.-Fem.": "αὐτή",  "Nom. Sg.-Neut.": "αὐτό",
      "Gen. Sg.-Masc.": "αὐτοῦ", "Gen. Sg.-Fem.": "αὐτῆς", "Gen. Sg.-Neut.": "αὐτοῦ",
      "Dat. Sg.-Masc.": "αὐτῷ",  "Dat. Sg.-Fem.": "αὐτῇ",  "Dat. Sg.-Neut.": "αὐτῷ",
      "Acc. Sg.-Masc.": "αὐτόν", "Acc. Sg.-Fem.": "αὐτήν", "Acc. Sg.-Neut.": "αὐτό",
      "Nom. Pl.-Masc.": "αὐτοί", "Nom. Pl.-Fem.": "αὐταί", "Nom. Pl.-Neut.": "αὐτά",
      "Gen. Pl.-Masc.": "αὐτῶν", "Gen. Pl.-Fem.": "αὐτῶν", "Gen. Pl.-Neut.": "αὐτῶν",
      "Dat. Pl.-Masc.": "αὐτοῖς","Dat. Pl.-Fem.": "αὐταῖς","Dat. Pl.-Neut.": "αὐτοῖς",
      "Acc. Pl.-Masc.": "αὐτούς","Acc. Pl.-Fem.": "αὐτάς", "Acc. Pl.-Neut.": "αὐτά",
    },
  },
  {
    title: "οὗτος — This / These",
    cols: ["Masc.", "Fem.", "Neut."],
    rows: ["Nom. Sg.", "Gen. Sg.", "Dat. Sg.", "Acc. Sg.", "Nom. Pl.", "Gen. Pl.", "Dat. Pl.", "Acc. Pl."],
    answers: {
      "Nom. Sg.-Masc.": "οὗτος",  "Nom. Sg.-Fem.": "αὕτη",   "Nom. Sg.-Neut.": "τοῦτο",
      "Gen. Sg.-Masc.": "τούτου", "Gen. Sg.-Fem.": "ταύτης",  "Gen. Sg.-Neut.": "τούτου",
      "Dat. Sg.-Masc.": "τούτῳ",  "Dat. Sg.-Fem.": "ταύτῃ",   "Dat. Sg.-Neut.": "τούτῳ",
      "Acc. Sg.-Masc.": "τοῦτον", "Acc. Sg.-Fem.": "ταύτην",  "Acc. Sg.-Neut.": "τοῦτο",
      "Nom. Pl.-Masc.": "οὗτοι",  "Nom. Pl.-Fem.": "αὗται",   "Nom. Pl.-Neut.": "ταῦτα",
      "Gen. Pl.-Masc.": "τούτων", "Gen. Pl.-Fem.": "τούτων",  "Gen. Pl.-Neut.": "τούτων",
      "Dat. Pl.-Masc.": "τούτοις","Dat. Pl.-Fem.": "ταύταις", "Dat. Pl.-Neut.": "τούτοις",
      "Acc. Pl.-Masc.": "τούτους","Acc. Pl.-Fem.": "ταύτας",  "Acc. Pl.-Neut.": "ταῦτα",
    },
  },
  {
    title: "ἐκεῖνος — That / Those",
    cols: ["Masc.", "Fem.", "Neut."],
    rows: ["Nom. Sg.", "Gen. Sg.", "Dat. Sg.", "Acc. Sg.", "Nom. Pl.", "Gen. Pl.", "Dat. Pl.", "Acc. Pl."],
    answers: {
      "Nom. Sg.-Masc.": "ἐκεῖνος", "Nom. Sg.-Fem.": "ἐκείνη",  "Nom. Sg.-Neut.": "ἐκεῖνο",
      "Gen. Sg.-Masc.": "ἐκείνου", "Gen. Sg.-Fem.": "ἐκείνης", "Gen. Sg.-Neut.": "ἐκείνου",
      "Dat. Sg.-Masc.": "ἐκείνῳ",  "Dat. Sg.-Fem.": "ἐκείνῃ",  "Dat. Sg.-Neut.": "ἐκείνῳ",
      "Acc. Sg.-Masc.": "ἐκεῖνον", "Acc. Sg.-Fem.": "ἐκείνην", "Acc. Sg.-Neut.": "ἐκεῖνο",
      "Nom. Pl.-Masc.": "ἐκεῖνοι", "Nom. Pl.-Fem.": "ἐκεῖναι", "Nom. Pl.-Neut.": "ἐκεῖνα",
      "Gen. Pl.-Masc.": "ἐκείνων", "Gen. Pl.-Fem.": "ἐκείνων", "Gen. Pl.-Neut.": "ἐκείνων",
      "Dat. Pl.-Masc.": "ἐκείνοις","Dat. Pl.-Fem.": "ἐκείναις","Dat. Pl.-Neut.": "ἐκείνοις",
      "Acc. Pl.-Masc.": "ἐκείνους","Acc. Pl.-Fem.": "ἐκείνας", "Acc. Pl.-Neut.": "ἐκεῖνα",
    },
  },
];

function PronounDrill({ s, t }) {
  const [tableIdx, setTableIdx] = useState(0);
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState(false);
  const [sel, setSel] = useState(null);

  const tbl = PRONOUN_TABLES[tableIdx];
  const pool = useMemo(() => shuffle([...new Set(Object.values(tbl.answers))]), [tableIdx]);

  const switchTable = (idx) => { setTableIdx(idx); setPlaced({}); setChecked(false); setSel(null); };

  const place = (key) => {
    if (!sel) return;
    setPlaced(p => ({ ...p, [key]: sel }));
    setChecked(false); setSel(null);
  };

  const remove = (key) => {
    setPlaced(p => { const n = { ...p }; delete n[key]; return n; });
    setChecked(false);
  };

  const reset = () => { setPlaced({}); setChecked(false); setSel(null); };

  const numOk = checked ? Object.entries(tbl.answers).filter(([k,v]) => placed[k]===v).length : 0;
  const total = Object.keys(tbl.answers).length;

  // Split rows into sg/pl groups for αὐτός, οὗτος, ἐκεῖνος
  const sgRows = tbl.rows.filter(r => r.includes("Sg.") || (!r.includes("Sg.") && !r.includes("Pl.")));
  const plRows = tbl.rows.filter(r => r.includes("Pl."));
  const hasSplit = plRows.length > 0;

  const renderRow = (row) => (
    <tr key={row}>
      <td style={s.tdLabel}>{row}</td>
      {tbl.cols.map(col => {
        const key = row + "-" + col;
        const val = placed[key];
        const ok   = checked && val === tbl.answers[key];
        const bad  = checked && val && val !== tbl.answers[key];
        const missed = checked && !val;
        return (
          <td key={col}
            onClick={() => sel ? place(key) : val ? remove(key) : null}
            style={{ padding:"7px 4px", textAlign:"center", minWidth:80, borderRadius:6, cursor:"pointer",
              border: ok ? "2px solid "+t.correctBorder : bad ? "2px solid "+t.wrongBorder : missed ? "2px solid "+t.missedBorder : sel ? "2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
              background: ok ? t.correctBg : bad ? t.wrongBg : "transparent" }}>
            {val
              ? <span style={{ fontSize:14, color:ok?t.correctText:bad?t.wrongText:t.text }}>{val}</span>
              : missed ? <span style={{ fontSize:12, color:t.missedBorder }}>{tbl.answers[key]}</span> : null}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Pronoun Paradigms</div>

      {/* Table selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {PRONOUN_TABLES.map((tb, i) => (
          <button key={i}
            style={i===tableIdx ? { ...s.refTab, ...s.refTabActive } : s.refTab}
            onClick={() => switchTable(i)}>
            {tb.title.split(" — ")[0]}
          </button>
        ))}
      </div>

      <p style={{ ...s.refNote, marginBottom:12 }}><strong style={{ color:t.text }}>{tbl.title}</strong> — tap a form to select it, then tap the correct cell.</p>

      {/* Pool */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
        <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Forms Pool</div>
        {pool.map((f, i) => {
          const used = Object.values(placed).filter(v => v===f).length;
          const need = Object.values(tbl.answers).filter(v => v===f).length;
          const isSel = sel===f;
          return (
            <div key={i} onClick={() => setSel(isSel ? null : f)}
              style={{ padding:"5px 11px", background:isSel?t.goldBg:t.card, border:"1px solid "+(isSel?t.gold:t.cardBorder), borderRadius:6, color:isSel?t.gold:t.text, fontSize:15, cursor:"pointer", userSelect:"none", opacity:used>=need?0.25:1 }}>
              {f}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:300 }}>
          <thead>
            <tr>
              <th style={s.th}></th>
              {tbl.cols.map(c => <th key={c} style={{ ...s.th, textAlign:"center" }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {hasSplit ? (
              <React.Fragment>
                <tr>
                  <td colSpan={tbl.cols.length+1} style={{ padding:"3px 0 2px" }}>
                    <span style={{ fontSize:10, color:t.gold, textTransform:"uppercase", letterSpacing:1, opacity:0.7 }}>── singular ──</span>
                  </td>
                </tr>
                {sgRows.map(renderRow)}
                <tr>
                  <td colSpan={tbl.cols.length+1} style={{ padding:"6px 0 2px", borderTop:"2px solid "+t.goldBorder }}>
                    <span style={{ fontSize:10, color:t.gold, textTransform:"uppercase", letterSpacing:1, opacity:0.7 }}>── plural ──</span>
                  </td>
                </tr>
                {plRows.map(renderRow)}
              </React.Fragment>
            ) : (
              tbl.rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
        <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
      </div>

      {checked && (
        <div style={{ marginTop:10, ...(numOk===total ? s.feedbackOk : numOk > total*0.7 ? s.feedbackMid : s.feedbackBad) }}>
          {numOk}/{total} correct {numOk===total ? "🏆" : "— missed cells shown in orange"}
        </div>
      )}

      {tableIdx === 0 && (
        <p style={{ ...s.refNote, marginTop:10 }}>💡 The shorter forms (μου, μοι, με) are unemphatic. The longer forms (ἐμοῦ, ἐμοί, ἐμέ) add emphasis.</p>
      )}
      {tableIdx === 2 && (
        <p style={{ ...s.refNote, marginTop:10 }}>💡 αὐτός follows the same pattern as 2nd/1st declension adjectives (-ος, -η, -ον).</p>
      )}
      {tableIdx === 3 && (
        <p style={{ ...s.refNote, marginTop:10 }}>💡 οὗτος always begins with either a rough breathing (οὗ-, αὕ-) or τ- — never a smooth breathing.</p>
      )}
    </div>
  );
}


// ── Verb Endings Drill ─────────────────────────────────────────────────────────
const VERB_ENDINGS_ANS = {
  "1st-Singular": "-ω",
  "2nd-Singular": "-εις",
  "3rd-Singular": "-ει",
  "1st-Plural":   "-ομεν",
  "2nd-Plural":   "-ετε",
  "3rd-Plural":   "-ουσι(ν)",
};
const VE_ROWS = ["1st","2nd","3rd"];
const VE_COLS = ["Singular","Plural"];

const VERB_FORMS = [
  { verb:"λύω",       meaning:"I loose, destroy", stem:"λύ" },
  { verb:"πιστεύω",   meaning:"I believe",         stem:"πιστεύ" },
  { verb:"γινώσκω",   meaning:"I know",            stem:"γινώσκ" },
  { verb:"λέγω",      meaning:"I say, speak",      stem:"λέγ" },
  { verb:"ἔχω",       meaning:"I have, hold",      stem:"ἔχ" },
];

function VerbEndingsDrill({ s, t }) {
  const [mode, setMode] = useState("endings"); // "endings" | "conjugate"
  const [placed, setPlaced] = useState({});
  const [checked, setChecked] = useState(false);
  const [sel, setSel] = useState(null);
  const [verbIdx, setVerbIdx] = useState(0);

  const pool = useMemo(() => shuffle(Object.values(VERB_ENDINGS_ANS)), [mode]);

  const place = (key) => {
    if (!sel) return;
    setPlaced(p => ({ ...p, [key]: sel }));
    setChecked(false); setSel(null);
  };
  const remove = (key) => { setPlaced(p => { const n={...p}; delete n[key]; return n; }); setChecked(false); };
  const reset = () => { setPlaced({}); setChecked(false); setSel(null); };
  const switchMode = (m) => { setMode(m); reset(); };
  const switchVerb = (i) => { setVerbIdx(i); reset(); };

  // ── Endings-only drill ──────────────────────────────────────────────────────
  if (mode === "endings") {
    const numOk = checked ? Object.entries(VERB_ENDINGS_ANS).filter(([k,v]) => placed[k]===v).length : 0;
    const total = Object.keys(VERB_ENDINGS_ANS).length;
    return (
      <div style={s.card}>
        <div style={s.secTitle}>Present Active Indicative — Endings</div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <button style={{ ...s.toggleBtn, ...s.toggleActive }} onClick={()=>switchMode("endings")}>Endings Only</button>
          <button style={s.toggleBtn} onClick={()=>switchMode("conjugate")}>Full Conjugation</button>
        </div>
        <p style={s.refNote}>Tap an ending to select it, then tap the correct cell.</p>

        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
          <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Endings Pool</div>
          {pool.map((e, i) => {
            const isSel = sel === e;
            const used = Object.values(placed).filter(v => v===e).length;
            return (
              <div key={i} onClick={() => setSel(isSel ? null : e)}
                style={{ padding:"6px 13px", background:isSel?t.goldBg:t.card, border:"1px solid "+(isSel?t.gold:t.cardBorder), borderRadius:6, color:isSel?t.gold:t.text, fontSize:16, cursor:"pointer", userSelect:"none", opacity:used>0?0.25:1 }}>
                {e}
              </div>
            );
          })}
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr><th style={s.th}>Person</th>{VE_COLS.map(c=><th key={c} style={{...s.th,textAlign:"center"}}>{c}</th>)}</tr></thead>
            <tbody>
              {VE_ROWS.map(row => (
                <tr key={row}>
                  <td style={s.tdLabel}>{row}</td>
                  {VE_COLS.map(col => {
                    const key = row+"-"+col;
                    const val = placed[key];
                    const ok = checked && val===VERB_ENDINGS_ANS[key];
                    const bad = checked && val && val!==VERB_ENDINGS_ANS[key];
                    const missed = checked && !val;
                    return (
                      <td key={col} onClick={() => sel ? place(key) : val ? remove(key) : null}
                        style={{ padding:"10px 6px", textAlign:"center", minWidth:80, borderRadius:6, cursor:"pointer",
                          border: ok?"2px solid "+t.correctBorder : bad?"2px solid "+t.wrongBorder : missed?"2px solid "+t.missedBorder : sel?"2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
                          background: ok?t.correctBg : bad?t.wrongBg : "transparent" }}>
                        {val
                          ? <span style={{ fontSize:16, color:ok?t.correctText:bad?t.wrongText:t.text }}>{val}</span>
                          : missed ? <span style={{ fontSize:14, color:t.missedBorder }}>{VERB_ENDINGS_ANS[key]}</span> : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
          <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
        </div>
        {checked && (
          <div style={{ marginTop:10, ...(numOk===total ? s.feedbackOk : numOk>3 ? s.feedbackMid : s.feedbackBad) }}>
            {numOk}/{total} correct {numOk===total ? "🏆" : "— missed cells in orange"}
          </div>
        )}
      </div>
    );
  }

  // ── Full conjugation drill (with real verb stems) ──────────────────────────
  const verb = VERB_FORMS[verbIdx];
  const conjAnswers = {
    "1st-Singular": verb.stem+"ω", "1st-Plural": verb.stem+"ομεν",
    "2nd-Singular": verb.stem+"εις", "2nd-Plural": verb.stem+"ετε",
    "3rd-Singular": verb.stem+"ει",  "3rd-Plural": verb.stem+"ουσι(ν)",
  };
  const conjPool = shuffle(Object.values(conjAnswers));
  const numOk = checked ? Object.entries(conjAnswers).filter(([k,v]) => placed[k]===v).length : 0;
  const total = Object.keys(conjAnswers).length;

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Present Active Indicative — Full Conjugation</div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <button style={s.toggleBtn} onClick={()=>switchMode("endings")}>Endings Only</button>
        <button style={{ ...s.toggleBtn, ...s.toggleActive }} onClick={()=>switchMode("conjugate")}>Full Conjugation</button>
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {VERB_FORMS.map((v, i) => (
          <button key={i} style={i===verbIdx ? { ...s.refTab, ...s.refTabActive } : s.refTab} onClick={() => switchVerb(i)}>{v.verb}</button>
        ))}
      </div>

      <p style={{ ...s.refNote, marginBottom:10 }}><strong style={{ color:t.text }}>{verb.verb}</strong> — {verb.meaning}. Drag the correct conjugated form into each cell.</p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14, padding:12, background:t.inputBg, borderRadius:8, border:"1px solid "+t.cardBorder }}>
        <div style={{ width:"100%", fontSize:11, color:t.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Conjugated Forms</div>
        {conjPool.map((f, i) => {
          const isSel = sel === f;
          const used = Object.values(placed).filter(v => v===f).length;
          return (
            <div key={i} onClick={() => setSel(isSel ? null : f)}
              style={{ padding:"6px 12px", background:isSel?t.goldBg:t.card, border:"1px solid "+(isSel?t.gold:t.cardBorder), borderRadius:6, color:isSel?t.gold:t.text, fontSize:15, cursor:"pointer", userSelect:"none", opacity:used>0?0.25:1 }}>
              {f}
            </div>
          );
        })}
      </div>

      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr><th style={s.th}>Person</th>{VE_COLS.map(c=><th key={c} style={{...s.th,textAlign:"center"}}>{c}</th>)}</tr></thead>
          <tbody>
            {VE_ROWS.map(row => (
              <tr key={row}>
                <td style={s.tdLabel}>{row}</td>
                {VE_COLS.map(col => {
                  const key = row+"-"+col;
                  const val = placed[key];
                  const ok = checked && val===conjAnswers[key];
                  const bad = checked && val && val!==conjAnswers[key];
                  const missed = checked && !val;
                  return (
                    <td key={col} onClick={() => sel ? place(key) : val ? remove(key) : null}
                      style={{ padding:"10px 6px", textAlign:"center", minWidth:90, borderRadius:6, cursor:"pointer",
                        border: ok?"2px solid "+t.correctBorder : bad?"2px solid "+t.wrongBorder : missed?"2px solid "+t.missedBorder : sel?"2px dashed "+t.goldBorder : "2px dashed "+t.cardBorder,
                        background: ok?t.correctBg : bad?t.wrongBg : "transparent" }}>
                      {val
                        ? <span style={{ fontSize:15, color:ok?t.correctText:bad?t.wrongText:t.text }}>{val}</span>
                        : missed ? <span style={{ fontSize:13, color:t.missedBorder }}>{conjAnswers[key]}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button style={{ ...s.primaryBtn, margin:0, flex:1 }} onClick={() => setChecked(true)}>Check</button>
        <button style={{ ...s.ghostBtn, margin:0, flex:1 }} onClick={reset}>Reset</button>
      </div>
      {checked && (
        <div style={{ marginTop:10, ...(numOk===total ? s.feedbackOk : numOk>3 ? s.feedbackMid : s.feedbackBad) }}>
          {numOk}/{total} correct {numOk===total ? "🏆" : "— missed cells in orange"}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode,      setDarkMode]      = useState(true);
  const [screen,        setScreen]        = useState("home");
  const [vocab,         setVocab]         = useState([]);
  const [scores,        setScores]        = useState({});
  const [savedQuiz,     setSavedQuiz]     = useState(null);
  const [quizSettings,  setQuizSettings]  = useState({ direction:"gr-en", chapters:[], count:20, weakOnly:false });
  const [quizCards,     setQuizCards]     = useState([]);
  const [quizIndex,     setQuizIndex]     = useState(0);
  const [flipped,       setFlipped]       = useState(false);
  const [isFlipping,    setIsFlipping]    = useState(false);
  const [feedback,      setFeedback]      = useState(null);
  const [userAnswer,    setUserAnswer]    = useState("");
  const [showHint,      setShowHint]      = useState(false);
  const [sessionResults,setSessionResults]= useState([]);
  const [practiceTab,   setPracticeTab]   = useState("endings");
  const [newWord,       setNewWord]       = useState({ greek:"", english:"", chapter:"" });
  const [filterCh,      setFilterCh]      = useState("all");

  const scoresRef = useRef({});
  const t = darkMode ? DARK : LIGHT;
  const s = useMemo(() => mkS(t), [darkMode]);

  // ── Load from storage ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const v = await store.get(STORAGE_KEY);
        setVocab(v ? JSON.parse(v) : DEFAULT_VOCAB);
        if (!v) await store.set(STORAGE_KEY, JSON.stringify(DEFAULT_VOCAB));
      } catch { setVocab(DEFAULT_VOCAB); }

      try {
        const sc = await store.get(SCORES_KEY);
        if (sc) { const parsed = JSON.parse(sc); setScores(parsed); scoresRef.current = parsed; }
      } catch { setScores({}); }

      try {
        const qz = await store.get(QUIZ_KEY);
        if (qz) {
          const saved = JSON.parse(qz);
          if (saved?.cards?.length && saved.index < saved.cards.length) setSavedQuiz(saved);
        }
      } catch {}
    })();
  }, []);

  // ── Sync scoresRef ─────────────────────────────────────────────────────────
  useEffect(() => { scoresRef.current = scores; }, [scores]);

  // ── Save helpers ───────────────────────────────────────────────────────────
  const saveVocab = async (v) => {
    setVocab(v);
    await store.set(STORAGE_KEY, JSON.stringify(v));
  };

  const saveScores = async (sc) => {
    setScores(sc);
    scoresRef.current = sc;
    await store.set(SCORES_KEY, JSON.stringify(sc));
  };

  const saveQuizState = async (cards, index, results) => {
    await store.set(QUIZ_KEY, JSON.stringify({ cards, index, results, settings:quizSettings, savedAt:new Date().toISOString() }));
  };

  const clearSavedQuiz = async () => {
    setSavedQuiz(null);
    await store.del(QUIZ_KEY);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const chapters  = useMemo(() => [...new Set(vocab.map(w => w.chapter))].sort((a,b)=>a-b), [vocab]);
  const weakWords = useMemo(() => vocab.filter(w => {
    const sc = scoresRef.current[scoreKey(w.greek)];
    return sc && sc.total >= 2 && sc.correct / sc.total < 0.6;
  }), [vocab, scores]);

  const totalAnswered = Object.keys(scores).length;
  const avgPct = totalAnswered > 0
    ? Math.round(Object.values(scores).reduce((a,s)=>a+s.correct,0) / Object.values(scores).reduce((a,s)=>a+s.total,0) * 100)
    : null;

  // ── Quiz ───────────────────────────────────────────────────────────────────
  const startQuiz = async () => {
    let pool = vocab.filter(w => quizSettings.chapters.length===0 || quizSettings.chapters.includes(w.chapter));
    if (quizSettings.weakOnly) {
      const weak = pool.filter(w => { const sc = scoresRef.current[scoreKey(w.greek)]; return !sc || (sc.total>0 && sc.correct/sc.total<0.7); });
      if (weak.length > 0) pool = weak;
    }
    const cards = shuffle(pool).slice(0, Math.min(quizSettings.count, pool.length));
    setQuizCards(cards); setQuizIndex(0); setFlipped(false); setFeedback(null);
    setUserAnswer(""); setShowHint(false); setSessionResults([]);
    await clearSavedQuiz();
    await saveQuizState(cards, 0, []);
    setScreen("quiz");
  };

  const resumeQuiz = () => {
    if (!savedQuiz) return;
    setQuizCards(savedQuiz.cards); setQuizIndex(savedQuiz.index);
    setSessionResults(savedQuiz.results || []);
    if (savedQuiz.settings) setQuizSettings(savedQuiz.settings);
    setFlipped(false); setFeedback(null); setUserAnswer(""); setShowHint(false);
    setSavedQuiz(null); setScreen("quiz");
  };

  const currentCard = quizCards[quizIndex];
  const question = currentCard ? (quizSettings.direction==="gr-en" ? currentCard.greek : currentCard.english) : "";
  const answer   = currentCard ? (quizSettings.direction==="gr-en" ? currentCard.english : currentCard.greek) : "";

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => { setFlipped(f=>!f); setIsFlipping(false); }, 150);
  };

  const handleCheck = async () => {
    if (!userAnswer.trim()) return;
    const correct = isCorrect(userAnswer, answer);
    setFeedback(correct ? "correct" : "wrong");
    const sk = scoreKey(currentCard.greek);
    const newSc = { ...scoresRef.current };
    if (!newSc[sk]) newSc[sk] = { correct:0, total:0 };
    newSc[sk].total += 1;
    if (correct) newSc[sk].correct += 1;
    await saveScores(newSc);
    setSessionResults(r => [...r, { card:currentCard, correct, userAnswer }]);
  };

  const handleNext = async () => {
    if (quizIndex + 1 >= quizCards.length) {
      await clearSavedQuiz();
      setScreen("results");
    } else {
      const next = quizIndex + 1;
      setQuizIndex(next); setFlipped(false); setFeedback(null); setUserAnswer(""); setShowHint(false);
      await saveQuizState(quizCards, next, sessionResults);
    }
  };

  const handleSelfGrade = async (correct) => {
    const sk = scoreKey(currentCard.greek);
    const newSc = { ...scoresRef.current };
    if (!newSc[sk]) newSc[sk] = { correct:0, total:0 };
    newSc[sk].total += 1;
    if (correct) newSc[sk].correct += 1;
    await saveScores(newSc);
    setSessionResults(r => [...r, { card:currentCard, correct, userAnswer:"" }]);
    if (quizIndex + 1 >= quizCards.length) { await clearSavedQuiz(); setScreen("results"); }
    else {
      const next = quizIndex + 1;
      setQuizIndex(next); setFlipped(false);
      await saveQuizState(quizCards, next, sessionResults);
    }
  };

  // ── Manage ─────────────────────────────────────────────────────────────────
  const addWord = () => {
    if (!newWord.greek || !newWord.english) return;
    saveVocab([...vocab, { ...newWord, chapter:parseInt(newWord.chapter)||0 }]);
    setNewWord({ greek:"", english:"", chapter:"" });
  };

  const resetVocab = () => {
    if (window.confirm("Reset to Ch 4–14 word list? Your scores are kept.")) saveVocab(DEFAULT_VOCAB);
  };

  const clearScores = () => {
    if (window.confirm("Clear all score history?")) { saveScores({}); }
  };

  const correctCount = sessionResults.filter(r=>r.correct).length;
  const pct = sessionResults.length > 0 ? Math.round(correctCount/sessionResults.length*100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.root}>
      <div style={s.bgLayer} />

      {/* HOME */}
      {screen==="home" && (
        <div style={s.page}>
          <div style={{ textAlign:"center", marginBottom:28, paddingTop:16, position:"relative" }}>
            <div style={{ position:"absolute", top:0, right:0 }}>
              <button style={s.themeTgl} onClick={()=>setDarkMode(d=>!d)}>{darkMode?"☀️ Light":"🌙 Dark"}</button>
            </div>
            <div style={{ fontSize:48, fontWeight:700, color:t.gold, letterSpacing:4, marginBottom:6 }}>ΑΩ</div>
            <h1 style={{ margin:0, fontSize:26, fontWeight:400, letterSpacing:3, color:t.text }}>Koine Flashcards</h1>
            <p style={{ margin:"4px 0 0", fontSize:12, color:t.textMuted, letterSpacing:2, textTransform:"uppercase" }}>Mounce Biblical Greek</p>
          </div>

          {savedQuiz && (
            <div style={{ ...s.card, borderColor:t.correctBorder, background:t.correctBg, marginBottom:14 }}>
              <div style={{ fontSize:13, color:t.correctText, fontWeight:700, marginBottom:4 }}>
                📌 Quiz in progress — card {savedQuiz.index} of {savedQuiz.cards.length}
              </div>
              <div style={{ fontSize:12, color:t.textMuted, marginBottom:10 }}>
                Saved at {new Date(savedQuiz.savedAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...s.primaryBtn, margin:0, flex:2 }} onClick={resumeQuiz}>▶ Resume Quiz</button>
                <button style={{ ...s.ghostBtn, margin:0, flex:1, fontSize:12 }} onClick={clearSavedQuiz}>Discard</button>
              </div>
            </div>
          )}

          <div style={s.card}>
            <div style={s.secTitle}>Quiz Settings</div>
            <label style={s.label}>Direction</label>
            <div style={s.toggle}>
              {[["gr-en","Greek → English"],["en-gr","English → Greek"],["flip","Flashcard Flip"]].map(([v,l]) => (
                <button key={v} style={quizSettings.direction===v?{...s.toggleBtn,...s.toggleActive}:s.toggleBtn}
                  onClick={()=>setQuizSettings(q=>({...q,direction:v}))}>{l}</button>
              ))}
            </div>
            <label style={s.label}>Chapters (none = all)</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
              {chapters.map(ch => (
                <button key={ch}
                  style={quizSettings.chapters.includes(ch)?{...s.chapterBtn,...s.chapterActive}:s.chapterBtn}
                  onClick={()=>setQuizSettings(q=>({...q,chapters:q.chapters.includes(ch)?q.chapters.filter(c=>c!==ch):[...q.chapters,ch]}))}>
                  Ch {ch}
                </button>
              ))}
            </div>
            <label style={s.label}>Cards per session</label>
            <div style={s.toggle}>
              {[10,15,20,30].map(n => (
                <button key={n} style={quizSettings.count===n?{...s.toggleBtn,...s.toggleActive}:s.toggleBtn}
                  onClick={()=>setQuizSettings(q=>({...q,count:n}))}>{n}</button>
              ))}
            </div>
            <label style={{ ...s.label, display:"flex", alignItems:"center", gap:8 }}>
              <input type="checkbox" checked={quizSettings.weakOnly} onChange={e=>setQuizSettings(q=>({...q,weakOnly:e.target.checked}))} />
              Weak words only {weakWords.length>0 && `(${weakWords.length} flagged)`}
            </label>
            <button style={s.primaryBtn} onClick={startQuiz}>Start New Quiz →</button>
          </div>

          <div style={s.statStrip}>
            {[["Words",vocab.length],["Tracked",totalAnswered],["Weak",weakWords.length],["Avg",avgPct!=null?avgPct+"%":"—"]].map(([l,v])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <span style={s.statNum}>{v}</span>
                <span style={s.statLabel}>{l}</span>
              </div>
            ))}
          </div>

          <div>
            <button style={s.ghostBtn} onClick={()=>setScreen("lookup")}>🔍 Word Lookup</button>
            <button style={s.ghostBtn} onClick={()=>setScreen("reference")}>📖 Reference Charts</button>
            <button style={s.ghostBtn} onClick={()=>setScreen("practice")}>✏️ Practice Exercises</button>
            <button style={s.ghostBtn} onClick={()=>setScreen("manage")}>⚙️ Manage Words</button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {screen==="quiz" && currentCard && (
        <div style={s.page}>
          <div style={s.quizHdr}>
            <button style={s.backBtn} onClick={()=>setScreen("home")}>← Back</button>
            <span style={{ color:t.textMuted, fontSize:14, fontWeight:600 }}>{quizIndex+1} / {quizCards.length}</span>
            <span style={{ fontSize:12, color:t.textMuted, background:t.inputBg, padding:"3px 10px", borderRadius:4, border:"1px solid "+t.cardBorder }}>Ch {currentCard.chapter}</span>
          </div>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width:`${(quizIndex/quizCards.length)*100}%` }} />
          </div>

          {quizSettings.direction==="flip" ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
              <div style={{ ...s.flashcard, opacity:isFlipping?0:1, transform:isFlipping?"scaleY(0.8)":"scaleY(1)", transition:"opacity 0.15s, transform 0.15s" }} onClick={handleFlip}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>{flipped?"English":"Greek"}</div>
                  <div style={{ fontSize:40, color:t.text, lineHeight:1.2 }}>{flipped?currentCard.english:currentCard.greek}</div>
                  {!flipped && <p style={{ margin:"12px 0 0", fontSize:12, color:t.textFaint }}>tap to reveal</p>}
                </div>
              </div>
              {flipped && (
                <div style={{ display:"flex", gap:12, width:"100%" }}>
                  <button style={s.gradeBad} onClick={()=>{setFlipped(false);handleSelfGrade(false);}}>✗ Missed it</button>
                  <button style={s.gradeOk}  onClick={()=>{setFlipped(false);handleSelfGrade(true);}}>✓ Got it</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={s.questionCard}>
                <div style={{ fontSize:11, color:t.textMuted, textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>{quizSettings.direction==="gr-en"?"Greek":"English"}</div>
                <div style={{ fontSize:44, color:t.text, lineHeight:1.2 }}>{question}</div>
              </div>
              {feedback===null ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input style={s.input} value={userAnswer} onChange={e=>setUserAnswer(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleCheck()}
                    placeholder={quizSettings.direction==="gr-en"?"Type English meaning…":"Type Greek word…"} autoFocus />
                  {currentCard.hint && !showHint && (
                    <button style={s.hintBtn} onClick={()=>setShowHint(true)}>💡 Show Hint</button>
                  )}
                  {currentCard.hint && showHint && <div style={s.hintBox}>💡 {currentCard.hint}</div>}
                  <button style={s.primaryBtn} onClick={handleCheck}>Check</button>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={feedback==="correct"?s.feedbackOk:s.feedbackBad}>{feedback==="correct"?"✓ Correct!":"✗ Not quite"}</div>
                  <div style={{ textAlign:"center", fontSize:20, padding:"14px", background:t.card, borderRadius:8, border:"1px solid "+t.cardBorder }}>
                    <span style={{ color:t.textMuted, fontSize:13 }}>Answer: </span>
                    <span style={{ color:t.text, fontWeight:600 }}>{answer}</span>
                  </div>
                  {feedback==="wrong" && userAnswer && <div style={{ textAlign:"center", fontSize:13, color:t.textMuted }}>Your answer: {userAnswer}</div>}
                  {currentCard.hint && !showHint && <button style={s.hintBtn} onClick={()=>setShowHint(true)}>💡 Show Hint</button>}
                  {currentCard.hint && showHint && <div style={s.hintBox}>💡 {currentCard.hint}</div>}
                  <button style={s.primaryBtn} onClick={handleNext}>{quizIndex+1>=quizCards.length?"See Results →":"Next →"}</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {screen==="results" && (
        <div style={s.page}>
          <div style={{ textAlign:"center", padding:"24px 0 20px" }}>
            <div style={{ fontSize:72, color:t.gold, fontWeight:300, lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:18, color:t.textMuted, margin:"8px 0 4px" }}>{correctCount} / {sessionResults.length} correct</div>
            <div style={{ fontSize:16, color:t.text }}>{pct>=90?"Excellent! 🏆":pct>=70?"Good work! 📖":pct>=50?"Keep studying! 💪":"Review these words! 🔄"}</div>
          </div>
          <div style={s.card}>
            <div style={s.secTitle}>Results</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5, maxHeight:340, overflowY:"auto" }}>
              {sessionResults.map((r,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:6, background:r.correct?t.correctBg:t.wrongBg, border:"1px solid "+(r.correct?t.correctBorder:t.wrongBorder) }}>
                  <span style={{ fontSize:16, minWidth:90, color:t.text }}>{r.card.greek.split(",")[0]}</span>
                  <span style={{ color:t.textFaint }}>→</span>
                  <span style={{ flex:1, color:t.textMuted, fontSize:13 }}>{r.card.english}</span>
                  <span style={{ fontSize:16 }}>{r.correct?"✓":"✗"}</span>
                </div>
              ))}
            </div>
          </div>
          <button style={s.primaryBtn} onClick={startQuiz}>Quiz Again</button>
          <button style={s.ghostBtn} onClick={()=>setScreen("home")}>← Home</button>
        </div>
      )}

      {/* REFERENCE */}
      {screen==="reference" && <ReferenceScreen s={s} t={t} onBack={()=>setScreen("home")} />}

      {/* PRACTICE */}
      {screen==="practice" && (
        <div style={s.page}>
          <div style={s.quizHdr}>
            <button style={s.backBtn} onClick={()=>setScreen("home")}>← Back</button>
            <span style={{ color:t.textMuted, fontSize:14, fontWeight:600 }}>Practice Exercises</span>
            <span />
          </div>
          <div style={s.refTabs}>
            {[["endings","Case Endings"],["pronouns","Pronouns"],["verbs","Verb Endings"],["stops","Square of Stops"],["preps","Prep Diagram"],["postpos","Postpositives"]].map(([k,l])=>(
              <button key={k} style={practiceTab===k?{...s.refTab,...s.refTabActive}:s.refTab} onClick={()=>setPracticeTab(k)}>{l}</button>
            ))}
          </div>
          {practiceTab==="endings"  && <CaseEndings s={s} t={t} />}
          {practiceTab==="pronouns" && <PronounDrill s={s} t={t} />}
          {practiceTab==="verbs"    && <VerbEndingsDrill s={s} t={t} />}
          {practiceTab==="stops"   && <SquareOfStops s={s} t={t} />}
          {practiceTab==="preps"   && <PrepDiagram s={s} t={t} />}
          {practiceTab==="postpos" && <Postpositives s={s} t={t} />}
        </div>
      )}


      {/* LOOKUP */}
      {screen==="lookup" && (
        <LookupScreen s={s} t={t} vocab={vocab} scores={scores} onBack={()=>setScreen("home")} />
      )}

      {/* MANAGE */}
      {screen==="manage" && (
        <div style={s.page}>
          <div style={s.quizHdr}>
            <button style={s.backBtn} onClick={()=>setScreen("home")}>← Back</button>
            <span style={{ color:t.textMuted, fontSize:14, fontWeight:600 }}>Manage Words</span>
            <span />
          </div>
          <div style={s.card}>
            <div style={s.secTitle}>Add New Word</div>
            <input style={s.input} placeholder="Greek word (e.g. λόγος, -ου, ὁ)" value={newWord.greek} onChange={e=>setNewWord(w=>({...w,greek:e.target.value}))} />
            <input style={{ ...s.input, marginTop:8 }} placeholder="English meaning" value={newWord.english} onChange={e=>setNewWord(w=>({...w,english:e.target.value}))} />
            <input style={{ ...s.input, marginTop:8 }} placeholder="Chapter number" value={newWord.chapter} onChange={e=>setNewWord(w=>({...w,chapter:e.target.value}))} />
            <button style={s.primaryBtn} onClick={addWord}>Add Word</button>
          </div>
          <div style={s.card}>
            <div style={s.secTitle}>Word List ({vocab.length})</div>
            <select style={{ ...s.select, marginBottom:12 }} value={filterCh} onChange={e=>setFilterCh(e.target.value)}>
              <option value="all">All chapters</option>
              {chapters.map(ch=><option key={ch} value={ch}>Chapter {ch}</option>)}
            </select>
            <div style={{ display:"flex", flexDirection:"column", gap:3, maxHeight:400, overflowY:"auto" }}>
              {vocab.filter(w=>filterCh==="all"||w.chapter===parseInt(filterCh)).map((w,i) => {
                const sc = scores[scoreKey(w.greek)];
                const p = sc && sc.total>0 ? Math.round(sc.correct/sc.total*100) : null;
                return (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 4px", borderBottom:"1px solid "+t.tableBorder }}>
                    <div>
                      <div style={s.wordGreek}>{w.greek.split(",")[0]}</div>
                      <div style={s.wordEn}>{w.english}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {p!==null && <span style={p>=70?s.pctGood:s.pctBad}>{p}%</span>}
                      <span style={{ fontSize:11, color:t.textFaint }}>Ch {w.chapter}</span>
                      <button style={s.deleteBtn} onClick={()=>saveVocab(vocab.filter((_,j)=>j!==i))}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ ...s.ghostBtn, margin:0, flex:1, color:"#e08040" }} onClick={resetVocab}>↺ Reset word list</button>
            <button style={{ ...s.ghostBtn, margin:0, flex:1, color:"#e06060" }} onClick={clearScores}>🗑 Clear scores</button>
          </div>
        </div>
      )}
    </div>
  );
}

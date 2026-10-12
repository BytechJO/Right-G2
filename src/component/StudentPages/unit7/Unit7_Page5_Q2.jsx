/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-4.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import wordAudio1 from "../../../assets/audio/ClassBook/U 7/Page 62 - A2/Item_001_b_t.mp3";
import wordAudio2 from "../../../assets/audio/ClassBook/U 7/Page 62 - A2/Item_002_d_m.mp3";
import wordAudio3 from "../../../assets/audio/ClassBook/U 7/Page 62 - A2/Item_003_f_m.mp3";
import wordAudio4 from "../../../assets/audio/ClassBook/U 7/Page 62 - A2/Item_004_wind.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const sentenceAudios = [wordAudio1, wordAudio2, wordAudio3, wordAudio4];

const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

const Unit7_Page5_Q2 = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [matches, setMatches] = useState({});
  // نتائج Check: true = صح (مقفل)، false = غلط (انرجع وبينعاد)
  const [matchResults, setMatchResults] = useState({});
  const [wordResults, setWordResults] = useState({});
  const [filledLetters, setFilledLetters] = useState({});
  const [picked, setPicked] = useState(null); // الحرف المختار: { sentId, letter, key }
  const [locked, setLocked] = useState(false); // Show Answer
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [hoverSentence, setHoverSentence] = useState(null); // الكلمة اللي المؤشر/الماوس عليها (للخط المقطّع)

  const imageRefs = useRef([]);
  const sentenceRefs = useRef([]);
  const blankRefs = useRef({});
  const letterRefs = useRef({});
  const containerRef = useRef(null);

  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);
  const suppressFocusAudioRef = useRef(false);

  const images = [
    { id: 0, img: img1, alt: "A window" },
    { id: 1, img: img2, alt: "Foam" },
    { id: 2, img: img3, alt: "A boat" },
    { id: 3, img: img4, alt: "A dome" },
  ];

  // ✨ sentences مع حروف
  const sentences = [
    {
      id: 0,
      word: ["b", "", "", "t"],
      letters: ["o", "a", "i"],
      answer: ["b", "o", "a", "t"],
    },
    {
      id: 1,
      word: ["d", "", "m", ""],
      letters: ["o", "u", "e"],
      answer: ["d", "o", "m", "e"],
    },
    {
      id: 2,
      word: ["f", "", "", "m"],
      letters: ["a", "r", "o"],
      answer: ["f", "o", "a", "m"],
    },
    {
      id: 3,
      word: ["w", "i", "n", "d", "", ""],
      letters: ["o", "w", "a"],
      answer: ["w", "i", "n", "d", "o", "w"],
    },
  ];

  const correct = {
    0: 3,
    1: 2,
    2: 0,
    3: 1,
  };

  /* ---------------- audio ---------------- */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playSentence = (sid) => {
    stopAudio();
    const audio = new Audio(sentenceAudios[sid]);
    audioRef.current = audio;
    setPlayingId(sid);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  /* ---------------- helpers ---------------- */
  const getWord = (sid) => filledLetters[sid] || sentences[sid].word;

  const isWordCorrectNow = (sid) =>
    JSON.stringify(getWord(sid)) === JSON.stringify(sentences[sid].answer);

  const isWordComplete = (sid) => getWord(sid).every((c) => c !== "");

  const isWordLocked = (sid) => locked || wordResults[sid] === true;
  const isImageLocked = (id) => locked || matchResults[id] === true;

  const isLetterUsed = (sid, letter) => {
    const word = getWord(sid);
    return sentences[sid].word.some(
      (c, idx) => c === "" && word[idx] === letter,
    );
  };

  const focusEl = (el, suppressAudio = true) => {
    if (!el) return;
    suppressFocusAudioRef.current = suppressAudio;
    el.focus();
    suppressFocusAudioRef.current = false;
  };

  /* ---------------- letters: drag & drop (بدون تغيير) ---------------- */
  const placeLetter = (sentId, index, letter) => {
    setFilledLetters((prev) => {
      const current = prev[sentId] || sentences[sentId].word;
      if (current[index]) return prev; // ❌ لا تسمح بالاستبدال
      const next = [...current];
      next[index] = letter;
      return { ...prev, [sentId]: next };
    });

    // الكلمة اللي انعدّلت: بتنشال علامة ✕
    setWordResults((prev) => {
      if (prev[sentId] === undefined) return prev;
      const next = { ...prev };
      delete next[sentId];
      return next;
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const letter = result.draggableId.split("-")[1];
    const fromSentId = Number(result.draggableId.split("-")[0]);

    const parts = result.destination.droppableId.split("-");
    if (parts[0] !== "blank") return;

    const sentId = Number(parts[1]);
    const index = Number(parts[2]);

    // الحرف بينحط بس بكلمته، وبس بخانة فاضية وغير مقفلة
    if (fromSentId !== sentId) return;
    if (isWordLocked(sentId)) return;
    if (sentences[sentId].word[index] !== "") return;

    placeLetter(sentId, index, letter);
    setPicked(null);
  };

  const removeLetter = (sentId, idx) => {
    if (isWordLocked(sentId)) return;

    // إذا كان هذا المكان حرف ثابت من الكلمة الأصلية، لا تعملي شيء
    if (sentences[sentId].word[idx] !== "") return;

    const current = getWord(sentId);
    if (!current[idx]) return;

    setAnnouncement(`${current[idx]} returned to the letters.`);

    setFilledLetters((prev) => {
      const base = prev[sentId] || sentences[sentId].word;
      const next = [...base];
      next[idx] = "";
      return { ...prev, [sentId]: next };
    });

    setWordResults((prev) => {
      if (prev[sentId] === undefined) return prev;
      const next = { ...prev };
      delete next[sentId];
      return next;
    });
  };

  /* ---------------- letters: select then target (كليك/كيبورد) ---------------- */
  const pickLetter = (sentId, letter, i, viaKeyboard) => {
    if (isWordLocked(sentId)) {
      setAnnouncement("This word is correct and locked.");
      return;
    }

    if (isLetterUsed(sentId, letter)) {
      setAnnouncement(
        `${letter} is already placed. Press its blank to return it.`,
      );
      return;
    }

    const key = `${sentId}-${letter}-${i}`;

    if (!viaKeyboard && picked?.key === key) {
      setPicked(null);
      setAnnouncement("Choice cancelled.");
      return;
    }

    setPicked({ sentId, letter, key });
    setAnnouncement(
      `${letter} chosen. Choose a blank and press Enter or Space to place it.`,
    );

    // Enter/Space على الحرف: المؤشر بينتقل للانبوت
    if (viaKeyboard) {
      const word = getWord(sentId);
      const idx = sentences[sentId].word.findIndex(
        (c, k) => c === "" && !word[k],
      );

      if (idx !== -1) focusEl(blankRefs.current[`${sentId}-${idx}`]);
      else
        setAnnouncement(
          "There is no empty blank in this word. Return a letter first.",
        );
    }
  };

  const activateBlank = (sentId, idx, viaKeyboard) => {
    if (isWordLocked(sentId)) {
      setAnnouncement("This word is correct and locked.");
      return;
    }

    const current = getWord(sentId)[idx];

    // الخانة فيها حرف: بيرجع للحروف
    if (current) {
      removeLetter(sentId, idx);
      return;
    }

    if (!picked) {
      setAnnouncement("Choose a letter first.");
      return;
    }

    if (picked.sentId !== sentId) {
      setAnnouncement("This letter belongs to another word.");
      return;
    }

    const letter = picked.letter;
    const usedKey = picked.key;

    placeLetter(sentId, idx, letter);
    setPicked(null);
    setAnnouncement(`${letter} placed in ${sentId + 1}.`);

    // بعد الوضع: المؤشر بيرجع للحروف (أول حرف لسا ما انستخدم)
    if (viaKeyboard) {
      const word = [...getWord(sentId)];
      word[idx] = letter;

      const stillFree = (sid, l) =>
        !sentences[sid].word.some((c, k) => c === "" && word[k] === l);

      const nextIndex = sentences[sentId].letters.findIndex(
        (l, k) => `${sentId}-${l}-${k}` !== usedKey && stillFree(sentId, l),
      );

      setTimeout(() => {
        if (nextIndex !== -1) {
          focusEl(letterRefs.current[`${sentId}-${nextIndex}`]);
        } else {
          focusEl(blankRefs.current[`${sentId}-${idx}`]);
        }
      }, 0);
    }
  };

  /* ---------------- image → word card matching ---------------- */
  const selectImage = (id, viaKeyboard = false) => {
    if (locked) return;

    if (isImageLocked(id)) {
      setAnnouncement("This match is correct and locked.");
      return;
    }

    setSelectedImg(id);
    setAnnouncement(`${images[id].alt} chosen. Choose a word.`);

    // Enter/Space على الصورة: المؤشر بينتقل للكلمات
    if (viaKeyboard) {
      const lockedOwner = (sid) =>
        Object.keys(matches).some(
          (k) => matches[k] === sid && matchResults[k] === true,
        );

      const free = sentences.find(
        (s) =>
          !lockedOwner(s.id) &&
          !Object.keys(matches).some((k) => matches[k] === s.id),
      );
      const any = sentences.find((s) => !lockedOwner(s.id));
      const target = free || any;

      if (target) focusEl(sentenceRefs.current[target.id]);
    }
  };

  const selectSentence = (id, viaKeyboard = false) => {
    if (locked) return;

    if (selectedImg === null) {
      if (viaKeyboard) setAnnouncement("Choose a picture first.");
      return;
    }

    const lockedOwner = Object.keys(matches).find(
      (k) => matches[k] === id && matchResults[k] === true,
    );

    if (lockedOwner !== undefined) {
      setAnnouncement("This word is already matched correctly and locked.");
      return;
    }

    const imgId = selectedImg;

    const oldOwners = Object.keys(matches).filter((k) => matches[k] === id);

    const updated = { ...matches };
    Object.keys(updated).forEach((k) => {
      if (updated[k] === id) delete updated[k];
    });
    updated[imgId] = id;

    setMatches(updated);

    // الخط اللي انعدّل بيفقد نتيجته (✕) لحد ما يعمل Check من جديد
    setMatchResults((prev) => {
      const next = { ...prev };
      delete next[imgId];
      oldOwners.forEach((k) => delete next[k]);
      return next;
    });

    setSelectedImg(null);
    setAnnouncement(`${images[imgId].alt} connected to word ${id + 1}.`);

    // بعد التوصيل: المؤشر بيرجع للصور (الصورة التالية اللي لسا ما انوصلت)
    if (viaKeyboard) {
      let next = imgId;

      for (let n = 1; n <= images.length; n++) {
        const k = (imgId + n) % images.length;
        if (updated[k] === undefined) {
          next = k;
          break;
        }
      }

      setTimeout(() => focusEl(imageRefs.current[next]), 0);
    }
  };

  /* ---------------- check / show / reset ---------------- */
  const allDone =
    images.every((img) => matchResults[img.id] === true) &&
    sentences.every((s) => wordResults[s.id] === true);

  const checkAnswers = () => {
    if (locked || allDone) return;

    setPicked(null);
    setSelectedImg(null);

    if (images.some((img) => matches[img.id] === undefined)) {
      ValidationAlert.info("Please match all.");
      setAnnouncement("Please match all.");
      return;
    }

    if (sentences.some((s) => !isWordComplete(s.id))) {
      ValidationAlert.info("Please complete all words.");
      setAnnouncement("Please complete all words.");
      return;
    }

    const newMatchResults = {};
    const newWordResults = {};
    const newMatches = { ...matches };
    const newFilled = { ...filledLetters };

    images.forEach((img) => {
      const ok = matches[img.id] === correct[img.id];
      newMatchResults[img.id] = ok;
      if (!ok) delete newMatches[img.id]; // الخط الغلط بينرجع
    });

    sentences.forEach((s) => {
      const ok = isWordCorrectNow(s.id);
      newWordResults[s.id] = ok;
      if (!ok) newFilled[s.id] = [...s.word]; // الحروف الغلط بترجع للحروف
    });

    // السكور: صورة صح + كلمتها صح (متل الأصل)
    let correctCount = 0;

    images.forEach((img) => {
      const sentId = matches[img.id];
      if (newMatchResults[img.id] && newWordResults[sentId]) correctCount++;
    });

    const total = images.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    setMatches(newMatches);
    setFilledLetters(newFilled);
    setMatchResults(newMatchResults);
    setWordResults(newWordResults);

    setAnnouncement(
      [
        `Score ${correctCount} out of ${total}.`,
        ...images.map(
          (img) =>
            `Picture ${img.id + 1} is ${newMatchResults[img.id] ? "matched correctly" : "not matched correctly"}.`,
        ),
        ...sentences.map(
          (s) =>
            `Word ${s.id + 1} is ${newWordResults[s.id] ? "correct" : "not correct"}.`,
        ),
        correctCount < total
          ? "The wrong items were returned. Try them again and check."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    stopAudio();
    setPicked(null);
    setSelectedImg(null);
    setMatches(correct);

    const filled = {};
    const allTrueWords = {};
    const allTrueMatches = {};

    sentences.forEach((s) => {
      filled[s.id] = [...s.answer];
      allTrueWords[s.id] = true;
    });
    images.forEach((img) => {
      allTrueMatches[img.id] = true;
    });

    setFilledLetters(filled);
    setWordResults(allTrueWords);
    setMatchResults(allTrueMatches);
    setLocked(true);
    setAnnouncement("All answers shown.");
  };

  const reset = () => {
    stopAudio();
    setSelectedImg(null);
    setMatches({});
    setFilledLetters({});
    setMatchResults({});
    setWordResults({});
    setPicked(null);
    setLocked(false);
    setAnnouncement(
      "Activity reset. All letters, matches, and results are cleared.",
    );
  };

  const isWordWrong = (sentId) => wordResults[sentId] === false;
  const isImageWrong = (imgId) => matchResults[imgId] === false;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* كل الكود تبعك */}
      <div className="main-container-component relative" ref={containerRef}>
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="div-forall">
          <ExerciseHeader
            // sectionLetter="A"
            questionNumber={2}
            title="Match and write."
            subTitle="Match each clue first, then drag the item to its correct target and check the snap position."
          />

          <p id="u7p5q2-help" className="sr-only">
            Press Tab to move between the pictures, the words, the blanks, and
            the letters. On a picture, press Enter or Space to choose it, then
            the focus moves to the words: press Enter or Space on a word to
            connect it. On a letter, press Enter or Space to choose it, then the
            focus moves to the blanks: press Enter or Space on a blank to place
            the letter, and the focus goes back to the letters. Press Enter or
            Space on a filled blank to return its letter. You can also drag the
            letters, or click a letter and then click a blank. Correct items are
            locked after you check, and wrong items are returned.
          </p>

          <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center gap-25">
            {/* الصور */}
            <div className="grid grid-cols-4 w-full text-center">
              {images.map((img, index) => {
                const imgLocked = isImageLocked(img.id);

                return (
                  <div
                    key={img.id}
                    ref={(el) => (imageRefs.current[index] = el)}
                    role="button"
                    tabIndex={imgLocked ? -1 : 0}
                    aria-pressed={selectedImg === img.id}
                    aria-disabled={imgLocked}
                    aria-label={`${img.alt}.${
                      imgLocked
                        ? " Correct and locked."
                        : " Press Enter or Space to choose it, then choose a word."
                    }`}
                    onClick={() => selectImage(img.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") return;

                      if (isActivateKey(e)) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!e.repeat) selectImage(img.id, true);
                        return;
                      }

                      if (e.key === "Escape" && selectedImg !== null) {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedImg(null);
                        setAnnouncement("Choice cancelled.");
                      }
                    }}
                    onKeyUp={(e) => {
                      if (isActivateKey(e)) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className={`flex flex-col items-center gap-3 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                      imgLocked ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div className="relative">
                      {isImageWrong(img.id) && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                        >
                          ✕
                        </span>
                      )}

                      <div
                        className={`border-2 rounded-lg w-[140px] h-[110px] flex items-center justify-center transition-all duration-200 ${
                          selectedImg === img.id
                            ? "bg-red-100 border-red-600 scale-105 shadow-lg"
                            : "border-red-300"
                        }`}
                      >
                        <img
                          src={img.img}
                          alt={img.alt}
                          className="max-h-[120px]"
                        />
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                );
              })}
            </div>

            {/* الكلمات */}
            <div className="grid grid-cols-4 w-full text-center">
              {sentences.map((sent, index) => {
                const wordLocked = isWordLocked(sent.id);
                const wordCorrectLocked = wordResults[sent.id] === true;
                const word = getWord(sent.id);
                const isMatchTarget = selectedImg !== null;

                return (
                  <div
                    key={sent.id}
                    ref={(el) => (sentenceRefs.current[index] = el)}
                    role="group"
                    tabIndex={0}
                    aria-label={`Word ${sent.id + 1}: ${word
                      .map((c) => c || "blank")
                      .join(" ")}.${
                      wordCorrectLocked ? " Correct." : ""
                    } Press Enter or Space to connect the chosen picture.`}
                    onPointerDown={() => {
                      pointerDownRef.current = true;
                    }}
                    onPointerUp={() => {
                      pointerDownRef.current = false;
                    }}
                    onFocus={(e) => {
                      // الصوت بيشتغل بالتاب على الكرت نفسه (مش على الحروف أو الخانات)
                      if (e.target !== e.currentTarget) return;
                      setHoverSentence(sent.id);
                      if (suppressFocusAudioRef.current) return;
                      if (!pointerDownRef.current) playSentence(sent.id);
                    }}
                    onBlur={(e) => {
                      if (e.target !== e.currentTarget) return;
                      setHoverSentence((prev) =>
                        prev === sent.id ? null : prev,
                      );
                    }}
                    onMouseEnter={() => setHoverSentence(sent.id)}
                    onMouseLeave={() =>
                      setHoverSentence((prev) =>
                        prev === sent.id ? null : prev,
                      )
                    }
                    onClick={() => {
                      playSentence(sent.id);
                      selectSentence(sent.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) return;
                      if (e.key === "Tab") return;

                      if (isActivateKey(e)) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!e.repeat) {
                          playSentence(sent.id);
                          selectSentence(sent.id, true);
                        }
                        return;
                      }

                      if (e.key === "Escape" && selectedImg !== null) {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedImg(null);
                        setAnnouncement("Choice cancelled.");
                      }
                    }}
                    className="flex flex-col items-center cursor-pointer rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                  >
                    <div className="relative">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full z-10"></div>
                      <div className="relative">
                        {isWordWrong(sent.id) && (
                          <span
                            aria-hidden="true"
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                          >
                            ✕
                          </span>
                        )}
                        {playingId === sent.id && <SpeakerBadge />}

                        <div
                          className={`bg-[#f9e5dd] px-4 py-2 rounded-xl text-lg ${
                            isMatchTarget && !wordLocked
                              ? "ring-2 ring-blue-400"
                              : ""
                          }`}
                        >
                          {/* الكلمة */}
                          <div className="flex gap-1 justify-center">
                            {sent.word.map((char, idx) => {
                              const filledChar = word[idx];
                              const isBlank = char === "";
                              const blankNumber = sent.word
                                .slice(0, idx + 1)
                                .filter((c) => c === "").length;
                              const validTarget =
                                isBlank &&
                                !filledChar &&
                                !wordLocked &&
                                picked?.sentId === sent.id;

                              return (
                                <Droppable
                                  key={idx}
                                  droppableId={`blank-${sent.id}-${idx}`}
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`w-6 h-8 border-b-2 text-center ${
                                        wordCorrectLocked
                                          ? "border-green-500"
                                          : validTarget
                                            ? "border-blue-500 bg-blue-50"
                                            : ""
                                      }`}
                                    >
                                      {isBlank ? (
                                        <input
                                          type="text"
                                          readOnly
                                          autoComplete="off"
                                          inputMode="none"
                                          ref={(el) => {
                                            blankRefs.current[
                                              `${sent.id}-${idx}`
                                            ] = el;
                                          }}
                                          value={filledChar || ""}
                                          placeholder="_"
                                          // أثناء التوصيل (صورة مختارة) التاب ما بدخل جوا الكلمة
                                          tabIndex={
                                            wordLocked || isMatchTarget ? -1 : 0
                                          }
                                          aria-label={`Word ${sent.id + 1}, blank ${blankNumber}. ${
                                            filledChar
                                              ? `Contains ${filledChar}.${wordLocked ? "" : " Press Enter to return it."}`
                                              : validTarget
                                                ? "Empty. Press Enter to place the chosen letter here."
                                                : "Empty."
                                          }`}
                                          onClick={(e) => {
                                            // خانة فيها حرف أو في حرف مختار: بنتعامل معها، غير هيك بتوصل للكرت
                                            if (filledChar || picked) {
                                              e.stopPropagation();
                                              activateBlank(
                                                sent.id,
                                                idx,
                                                false,
                                              );
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Tab") return;

                                            if (isActivateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              if (!e.repeat) {
                                                activateBlank(
                                                  sent.id,
                                                  idx,
                                                  true,
                                                );
                                              }
                                              return;
                                            }

                                            if (
                                              e.key === "Delete" ||
                                              e.key === "Backspace"
                                            ) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              removeLetter(sent.id, idx);
                                              return;
                                            }

                                            if (e.key === "Escape" && picked) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setPicked(null);
                                              setAnnouncement(
                                                "Choice cancelled.",
                                              );
                                            }
                                          }}
                                          onKeyUp={(e) => {
                                            if (isActivateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                            }
                                          }}
                                          className={`w-full h-full bg-transparent text-center text-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ${
                                            wordLocked
                                              ? "cursor-default"
                                              : "cursor-pointer hover:text-red-500"
                                          }`}
                                        />
                                      ) : (
                                        char
                                      )}
                                      {provided.placeholder}
                                    </span>
                                  )}
                                </Droppable>
                              );
                            })}
                          </div>

                          {/* الحروف */}
                          <Droppable
                            droppableId={`letters-${sent.id}`}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-2 mt-2 justify-center"
                              >
                                {sent.letters.map((l, i) => {
                                  const used = isLetterUsed(sent.id, l);
                                  const key = `${sent.id}-${l}-${i}`;
                                  const isPicked = picked?.key === key;

                                  return (
                                    <Draggable
                                      key={key}
                                      draggableId={key}
                                      index={i}
                                      isDragDisabled={wordLocked || used}
                                    >
                                      {(provided) => (
                                        <span
                                          ref={(el) => {
                                            provided.innerRef(el);
                                            letterRefs.current[
                                              `${sent.id}-${i}`
                                            ] = el;
                                          }}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          role="button"
                                          // أثناء التوصيل (صورة مختارة) التاب ما بدخل جوا الكلمة
                                          tabIndex={
                                            wordLocked || used || isMatchTarget
                                              ? -1
                                              : 0
                                          }
                                          aria-pressed={isPicked}
                                          aria-disabled={wordLocked || used}
                                          aria-label={`Letter ${l}, word ${sent.id + 1}.${
                                            used
                                              ? " Already placed."
                                              : " Press Enter or Space to choose it, then place it in a blank."
                                          }`}
                                          className={`px-2 py-1 border rounded bg-yellow-200 outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                                            isPicked
                                              ? "ring-2 ring-[#2563eb]"
                                              : ""
                                          } ${
                                            used
                                              ? "opacity-40 cursor-not-allowed"
                                              : "cursor-grab"
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            pickLetter(sent.id, l, i, false);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Tab") return;

                                            if (isActivateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              if (!e.repeat) {
                                                pickLetter(sent.id, l, i, true);
                                              }
                                              return;
                                            }

                                            if (e.key === "Escape" && picked) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setPicked(null);
                                              setAnnouncement(
                                                "Choice cancelled.",
                                              );
                                            }
                                          }}
                                          onKeyUp={(e) => {
                                            if (isActivateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                            }
                                          }}
                                        >
                                          {l}
                                        </span>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* الخطوط */}
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {Object.entries(matches).map(([imgId, sentId], i) => {
            const imgEl = imageRefs.current[imgId];
            const sentEl = sentenceRefs.current[sentId];

            if (!imgEl || !sentEl || !containerRef.current) return null;

            const imgRect = imgEl.getBoundingClientRect();
            const sentRect = sentEl.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
            const y1 = imgRect.bottom - containerRect.top;

            const x2 = sentRect.left + sentRect.width / 2 - containerRect.left;
            const y2 = sentRect.top - containerRect.top;

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke={matchResults[imgId] === true ? "#16a34a" : "#e53935"}
                strokeWidth="3"
                fill="none"
              />
            );
          })}

          {/* الخط المقطّع قبل التوصيل: بيبيّن أي صورة رح تتوصل مع الكلمة */}
          {(() => {
            if (selectedImg === null || hoverSentence === null) return null;
            if (!containerRef.current) return null;

            // ما في معاينة لكلمة موصولة بخط صح ومقفل
            const lockedOwner = Object.keys(matches).some(
              (k) => matches[k] === hoverSentence && matchResults[k] === true,
            );
            if (lockedOwner) return null;

            const imgEl = imageRefs.current[selectedImg];
            const sentEl = sentenceRefs.current[hoverSentence];
            if (!imgEl || !sentEl) return null;

            const imgRect = imgEl.getBoundingClientRect();
            const sentRect = sentEl.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
            const y1 = imgRect.bottom - containerRect.top;
            const x2 = sentRect.left + sentRect.width / 2 - containerRect.left;
            const y2 = sentRect.top - containerRect.top;

            return (
              <path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#e53935"
                strokeWidth="3"
                strokeDasharray="8 6"
                strokeLinecap="round"
                fill="none"
              />
            );
          })()}
        </svg>

        {/* الأزرار */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit7_Page5_Q2;

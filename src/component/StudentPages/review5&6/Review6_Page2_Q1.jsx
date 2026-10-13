/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/Ex D 1.svg";
import "./Review6_Page2_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 6/cd38pg55-instruction1-adult-lady_rmKHQrku.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import wordAudio1 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_001_light.mp3";
import wordAudio2 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_002_bike.mp3";
import wordAudio3 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_003_five.mp3";
import wordAudio4 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_004_night.mp3";
import segAudio1 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_005_Andrew_rides_his.mp3";
import segAudio2 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_006_at.mp3";
import segAudio3 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_007_o'clock_every.mp3";
import segAudio4 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_008_evening._He_has_a.mp3";
import segAudio5 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_009_on_his.mp3";
import segAudio6 from "../../../assets/audio/ClassBook/U 6/Page 55 - D/Item_010_when_he_rides.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const words = [
  { id: 1, word: "light", audio: wordAudio1 },
  { id: 2, word: "bike", audio: wordAudio2 },
  { id: 3, word: "five", audio: wordAudio3 },
  { id: 4, word: "night", audio: wordAudio4 },
  { id: 5, word: "bike", audio: wordAudio2 },
];

const correctAnswers = ["bike", "five", "light", "bike", "night"];

// يتجاهل الحروف الكبيرة والمسافات وعلامات الترقيم عند المقارنة
const normalize = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

const EMPTY = [null, null, null, null, null];

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

const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

export default function Review6_Page2_Q1() {
  const [answers, setAnswers] = useState(EMPTY);
  // results[i]: null = لم يُفحص / تغيّر, true = صح, false = غلط
  const [results, setResults] = useState(EMPTY);
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState(null); // الكلمة المختارة بالكيبورد/الكليك
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);
  const suppressFocusAudioRef = useRef(false);
  const wordRefs = useRef({});
  const slotRefs = useRef({});

  const stopAtSecond = 7.059;

  const captions = [
    {
      start: 0.56,
      end: 7.059,
      text: "Page 55, review 6, exercise D. Listen, read, and complete the story.",
    },
    {
      start: 8.179,
      end: 15.02,
      text: "Andrew rides his bike at 5 o'clock every evening. He has a light on his bike when he rides at night",
    },
  ];

  /* ---------------- audio ---------------- */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playAudio = (src, id) => {
    stopAudio();
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingId(id);
    audio.onended = () => setPlayingId(null);

    // وقّف أي صوت ثاني شغال بالصفحة (مثل الصوت الأساسي QuestionAudioPlayer)
    document.querySelectorAll("audio").forEach((a) => {
      if (a !== audio) a.pause();
    });

    audio.play().catch(() => setPlayingId(null));
  };

  useEffect(() => {
    // إذا اشتغل أي صوت ثاني بالصفحة (الصوت الأساسي) بنوقّف أصوات الكلمات والجمل
    const onAnyPlay = (e) => {
      if (e.target !== audioRef.current) stopAudio();
    };

    document.addEventListener("play", onAnyPlay, true);

    return () => {
      document.removeEventListener("play", onAnyPlay, true);
      if (audioRef.current) audioRef.current.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- helpers ---------------- */
  const isSlotLocked = (i) => locked || results[i] === true;
  const isWordUsed = (id) => answers.some((a) => a?.id === id);

  const clearResult = (i) =>
    setResults((prev) => {
      if (prev[i] === null) return prev;
      const updated = [...prev];
      updated[i] = null;
      return updated;
    });

  // أول خانة فاضية وغير مقفلة، وإذا ما في فاضية: أول خانة غير مقفلة (الغلط)
  const findTargetSlot = () => {
    for (let i = 0; i < answers.length; i++) {
      if (!isSlotLocked(i) && !answers[i]) return i;
    }
    for (let i = 0; i < answers.length; i++) {
      if (!isSlotLocked(i)) return i;
    }
    return -1;
  };

  const placeWord = (index, wordObj) => {
    const updated = [...answers];
    updated[index] = wordObj;
    setAnswers(updated);
    clearResult(index);
    setPicked(null);
    return updated;
  };

  /* ---------------- drag & drop (بدون تغيير) ---------------- */
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;
    if (!destination.droppableId.startsWith("slot-")) return;

    const id = Number(draggableId.replace("word-", ""));
    const index = Number(destination.droppableId.split("-")[1]);

    if (isSlotLocked(index)) return;

    const selectedWord = words.find((w) => w.id === id);
    if (!selectedWord) return;

    placeWord(index, selectedWord);
  };

  /* ---------------- keyboard / click flow ---------------- */
  const pickWord = (word, viaKeyboard) => {
    if (locked) return;

    if (isWordUsed(word.id)) {
      setAnnouncement(`${word.word} is already placed.`);
      return;
    }

    playAudio(word.audio, `w-${word.id}`);

    // كليك على نفس الكلمة مرتين = إلغاء الاختيار
    if (!viaKeyboard && picked?.id === word.id) {
      setPicked(null);
      setAnnouncement("Choice cancelled.");
      return;
    }

    setPicked(word);
    setAnnouncement(
      `${word.word} chosen. Press Enter or Space on a blank to place it.`,
    );

    // Enter/Space على الكلمة: المؤشر بينتقل للانبوت
    if (viaKeyboard) {
      const target = findTargetSlot();
      if (target !== -1) {
        suppressFocusAudioRef.current = true;
        slotRefs.current[target]?.focus();
        suppressFocusAudioRef.current = false;
      }
    }
  };

  const activateSlot = (i, viaKeyboard) => {
    if (isSlotLocked(i)) {
      setAnnouncement("This blank is correct and locked.");
      return;
    }

    // في كلمة مختارة: بتنحط (وبتستبدل الكلمة اللي بالخانة إذا كانت غلط)
    if (picked) {
      const word = picked;
      const updated = placeWord(i, word);
      setAnnouncement(`${word.word} placed in blank ${i + 1}.`);

      // بعد الوضع: المؤشر بيرجع للكلمات
      if (viaKeyboard) {
        const next = words.find((w) => !updated.some((a) => a?.id === w.id));
        if (next) {
          setTimeout(() => {
            suppressFocusAudioRef.current = true;
            wordRefs.current[next.id]?.focus();
            suppressFocusAudioRef.current = false;
          }, 0);
        }
      }
      return;
    }

    // ما في كلمة مختارة والخانة فيها كلمة: بترجع للكلمات
    if (answers[i]) {
      setAnnouncement(`${answers[i].word} returned to the word bank.`);
      const updated = [...answers];
      updated[i] = null;
      setAnswers(updated);
      clearResult(i);
      return;
    }

    setAnnouncement("Choose a word first.");
  };

  /* ---------------- check / show / reset ---------------- */
  const resetAnswers = () => {
    stopAudio();
    setAnswers(EMPTY);
    setResults(EMPTY);
    setLocked(false);
    setPicked(null);
    setAnnouncement("Activity reset. All blanks are cleared.");
  };

  const showAnswers = () => {
    stopAudio();
    setPicked(null);

    const available = [...words];

    const filled = correctAnswers.map((word) => {
      const index = available.findIndex((w) => w.word === word);
      const selected = available[index];
      available.splice(index, 1);
      return selected;
    });

    setAnswers(filled);
    setResults([true, true, true, true, true]);
    setLocked(true);
    setAnnouncement("All answers shown.");
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((a) => a === null)) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    setPicked(null);

    const newResults = answers.map(
      (a, i) => normalize(a.word) === normalize(correctAnswers[i]),
    );
    const score = newResults.filter(Boolean).length;
    const total = correctAnswers.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    setResults(newResults);

    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...newResults.map(
          (ok, i) => `Blank ${i + 1} is ${ok ? "correct" : "not correct"}.`,
        ),
        score < total ? "You can change the wrong answers and check again." : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (score === total) {
      ValidationAlert.success(message);
      setLocked(true);
    } else if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  const isWrong = (index) => results[index] === false;

  /* ---------------- sentence segment with audio ---------------- */
  const renderSegment = (id, text, src) => (
    <span
      role="button"
      tabIndex={0}
      aria-label={`Play audio: ${text}`}
      onPointerDown={() => {
        pointerDownRef.current = true;
      }}
      onClick={() => {
        pointerDownRef.current = false;
        playAudio(src, id);
      }}
      onFocus={() => {
        if (suppressFocusAudioRef.current) return;
        if (!pointerDownRef.current) playAudio(src, id);
      }}
      onBlur={() => {
        pointerDownRef.current = false;
      }}
      onKeyDown={(e) => {
        if (isActivateKey(e)) {
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) playAudio(src, id);
        }
      }}
      className={`relative inline-block cursor-pointer rounded-lg px-2 mx-2 my-3 outline-none transition-colors hover:bg-blue-50  ${
        playingId === id ? "border-2 border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-300 bg-blue-50" : ""
      }`}
    >
      {text}
      {playingId === id && <SpeakerBadge />}
    </span>
  );

  /* ---------------- blank (drop zone + real input) ---------------- */
  const renderSlot = (i) => {
    const slotLocked = isSlotLocked(i);
    const correct = results[i] === true;
    const isValidTarget = !!picked && !slotLocked;

    return (
      <Droppable droppableId={`slot-${i}`} isDropDisabled={slotLocked}>
        {(provided, snapshot) => (
          <span className="relative inline-block w-[110px] mx-1.5 text-center align-middle">
            {isWrong(i) && (
              <span
                aria-hidden="true"
                className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg z-[2]"
              >
                ✕
              </span>
            )}
            <span
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`h-10 block border-b-2 transition-all duration-200 py-1 focus-within:ring-2 focus-within:ring-blue-400 
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(i)
        ? "border-red-500"
        : correct
          ? "border-green-500"
          : isValidTarget
            ? "border-blue-500 bg-blue-50"
            : "border-black"
  }
`}
            >
              <input
                type="text"
                readOnly
                autoComplete="off"
                inputMode="none"
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                value={answers[i]?.word || ""}
                aria-label={`Blank ${i + 1}${
                  correct ? ". Correct." : isWrong(i) ? ". Not correct." : ""
                }`}
                aria-invalid={isWrong(i)}
                onClick={() => activateSlot(i, false)}
                onKeyDown={(e) => {
                  if (e.key === "Tab") return;

                  if (isActivateKey(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!e.repeat) activateSlot(i, true);
                    return;
                  }

                  if (e.key === "Delete" || e.key === "Backspace") {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!slotLocked && answers[i]) {
                      setAnnouncement(`${answers[i].word} returned to the word bank.`);
                      const updated = [...answers];
                      updated[i] = null;
                      setAnswers(updated);
                      clearResult(i);
                    }
                    return;
                  }

                  if (e.key === "Escape" && picked) {
                    e.preventDefault();
                    e.stopPropagation();
                    setPicked(null);
                    setAnnouncement("Choice cancelled.");
                  }
                }}
                onKeyUp={(e) => {
                  if (isActivateKey(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="h-full w-full bg-transparent text-center text-[20px] outline-none cursor-pointer"
              />
              {provided.placeholder}
            </span>
          </span>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="div-forall" style={{ gap: "40px" }}>
          <ExerciseHeader
          sectionLetter="D"
          title="Listen, read, and complete the story."
          subTitle="Listen once for meaning, then replay and fill each blank with the word you hear."
          isReview={true}
        />


          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId={"sb-review6-page2-q1"}
          />

          <div className="flex flex-col gap-5">
            {/* STORY */}
            <div className="flex items-center gap-[3%]">
              <div
                className="flex flex-col justify-between rounded-lg w-full"
                style={{ height: "220px" }}
              >
                {/* WORD BANK */}
                <Droppable
                  droppableId="bank"
                  direction="horizontal"
                  isDropDisabled
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex justify-between rounded-lg w-[100%]"
                    >
                      {words.map((word, i) => {
                        const used = isWordUsed(word.id);
                        const isPicked = picked?.id === word.id;
                        const wordPlayId = `w-${word.id}`;

                        return (
                          <Draggable
                            key={word.id}
                            draggableId={`word-${word.id}`}
                            index={i}
                            isDragDisabled={locked || used}
                          >
                            {(provided) => (
                              <span
                                ref={(el) => {
                                  provided.innerRef(el);
                                  wordRefs.current[word.id] = el;
                                }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                role="button"
                                tabIndex={locked || used ? -1 : 0}
                                aria-pressed={isPicked}
                                aria-disabled={locked || used}
                                aria-label={`${word.word}.${
                                  used
                                    ? " Already placed."
                                    : " Press Enter or Space to choose it, then place it in a blank."
                                }`}
                                onPointerDown={() => {
                                  pointerDownRef.current = true;
                                }}
                                onClick={() => {
                                  pointerDownRef.current = false;
                                  pickWord(word, false);
                                }}
                                onFocus={() => {
                                  if (suppressFocusAudioRef.current) return;
                                  if (!pointerDownRef.current && !used) {
                                    playAudio(word.audio, wordPlayId);
                                  }
                                }}
                                onBlur={() => {
                                  pointerDownRef.current = false;
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Tab") return;

                                  if (isActivateKey(e)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!e.repeat) pickWord(word, true);
                                    return;
                                  }

                                  if (e.key === "Escape" && picked) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPicked(null);
                                    setAnnouncement("Choice cancelled.");
                                  }
                                }}
                                onKeyUp={(e) => {
                                  if (isActivateKey(e)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }
                                }}
                                className={`relative px-3.5 py-1.5 border-2 rounded-lg font-bold transition-all outline-none focus-visible:ring-4 focus-visible:ring-blue-300
            ${isPicked ? "ring-2 ring-[#2563eb]" : ""}
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-blue-100 border-[#2c5287]"
            }
          `}
                              >
                                {word.word}
                                {playingId === wordPlayId && <SpeakerBadge />}
                              </span>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="text-[20px] leading-loose flex-1 mt-5">
                  {renderSegment("s0", "Andrew rides his", segAudio1)}
                  {renderSlot(0)}
                  {renderSegment("s1", "at", segAudio2)}
                  {renderSlot(1)}
                  {renderSegment("s2", "o’clock every", segAudio3)}
                  {renderSegment("s3", "evening. He has a", segAudio4)}
                  {renderSlot(2)}
                  {renderSegment("s4", "on his", segAudio5)}
                  {renderSlot(3)}
                  {renderSegment("s5", "when he rides", segAudio6)}
                  {renderSegment("s6", "at", segAudio2)}
                  {renderSlot(4)}.
                </div>
              </div>

              <img
                src={img1}
                alt="Andrew riding his bike in the evening with a light on his bike"
                style={{
                  width: "auto",
                  height: "220px",
                  borderRadius: "15px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
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
}
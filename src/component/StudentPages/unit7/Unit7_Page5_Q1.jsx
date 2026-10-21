/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit7_Page5_Q1.css";

import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A 6.svg";
import sound1 from "../../../assets/audio/ClassBook/U 7/pg62-11-adult-lady_zAZvUsum.mp3";

import optAudio1 from "../../../assets/audio/ClassBook/U 7/Page 62 - A/Item_001_o_e.mp3";
import optAudio2 from "../../../assets/audio/ClassBook/U 7/Page 62 - A/Item_002_ow.mp3";
import optAudio3 from "../../../assets/audio/ClassBook/U 7/Page 62 - A/Item_003_oa.mp3";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const optionAudio = { o_e: optAudio1, ow: optAudio2, oa: optAudio3 };

const optionLabel = { o_e: "o dash e", ow: "o w", oa: "o a" };

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

const Unit7_Page5_Q1 = () => {
  const items = [
    {
      img: img1,
      alt: "A window",
      options: ["o_e", "ow", "oa"],
      correct: "ow",
      start: "wind",
      end: "",
    },
    {
      img: img2,
      alt: "A coat",
      options: ["o_e", "ow", "oa"],
      correct: "oa",
      start: "c",
      end: "t",
    },
    {
      img: img3,
      alt: "A note",
      options: ["o_e", "ow", "oa"],
      correct: "o_e",
      start: "n",
      end: "te",
    },
    {
      img: img4,
      alt: "Snow",
      options: ["o_e", "ow", "oa"],
      correct: "ow",
      start: "sn",
      end: "",
    },
    {
      img: img5,
      alt: "A boat",
      options: ["o_e", "ow", "oa"],
      correct: "oa",
      start: "b",
      end: "t",
    },
    {
      img: img6,
      alt: "A home",
      options: ["o_e", "ow", "oa"],
      correct: "o_e",
      start: "h",
      end: "me",
    },
  ];
  const captions = [
    {
      start: 0.5,
      end: 8.34,
      text: "Page 62, Right Activities. Exercise A, number 1. Listen, circle, and write.",
    },
    { start: 9.639, end: 10.859, text: "1, window." },
    { start: 12.139, end: 13.279, text: "2, coat." },
    { start: 14.559, end: 15.799, text: "3, note." },
    { start: 17.219, end: 18.379, text: "5, boat" },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  // results[i]: null = لم يُفحص / تغيّر, true = صح (مقفل), false = غلط (قابل للتعديل)
  const [results, setResults] = useState(Array(items.length).fill(null));
  const [locked, setLocked] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);

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
    // إذا اشتغل أي صوت ثاني بالصفحة (الصوت الأساسي) بنوقّف أصوات الخيارات
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
  const buildAnswer = (i, value) => {
    if (!value) return "";
    const middle = value === "o_e" ? "o" : value;
    return items[i].start + middle + items[i].end;
  };

  const isItemLocked = (i) => locked || results[i] === true;

  /* ---------------- choose ---------------- */
  const chooseOption = (i, value) => {
    // الصوت بيشتغل دايماً (حتى لو السؤال مقفل)
    playAudio(optionAudio[value], `o-${i}-${value}`);

    if (isItemLocked(i)) {
      setAnnouncement(`Item ${i + 1} is correct and locked.`);
      return;
    }

    setSelected((prev) => {
      const updated = [...prev];
      updated[i] = value;
      return updated;
    });

    // لما الطالب يغيّر إجابة غلط: بتنشال نتيجتها القديمة
    setResults((prev) => {
      if (prev[i] === null) return prev;
      const updated = [...prev];
      updated[i] = null;
      return updated;
    });

    setAnnouncement(`Item ${i + 1}: ${optionLabel[value]} selected.`);
  };

  /* ---------------- reset / show / check ---------------- */
  const resetAll = () => {
    stopAudio();
    setSelected(Array(items.length).fill(""));
    setResults(Array(items.length).fill(null));
    setLocked(false);
    setAnnouncement("Activity reset. All choices and results are cleared.");
  };

  const showAnswers = () => {
    stopAudio();
    setSelected(items.map((i) => i.correct));
    setResults(Array(items.length).fill(true));
    setLocked(true);
    setAnnouncement("All answers shown.");
  };

  const checkAnswers = () => {
    if (locked) return;

    if (selected.includes("")) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }

    const newResults = items.map((item, i) => selected[i] === item.correct);
    const score = newResults.filter(Boolean).length;
    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    setResults(newResults);

    // الفيدباك المحكي: كل سؤال صح أو غلط
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...newResults.map(
          (ok, i) => `Item ${i + 1} is ${ok ? "correct" : "not correct"}.`,
        ),
        score < total ? "You can change the wrong answers and check again." : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    if (score === total) {
      ValidationAlert.success(msg);
      setLocked(true);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const isWrong = (index) => results[index] === false;
  const isCorrect = (index) => results[index] === true;

  return (
    <div className="main-container-component mb-20">
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
          sectionLetter="A"
          questionNumber={1}
          title="Listen, circle, and write."
          subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."
        /> 
        <div className="flex flex-col gap-8">
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={8.43}
            pageId={"sb-unit7-page5-q1"}
          />
          <div className="flex w-full">
            <div className="grid grid-cols-3 gap-y-25 w-full gap-x-[60px] justify-center">
              {items.map((item, i) => {
                const itemLocked = isItemLocked(i);

                return (
                  <div
                    key={i}
                    className="flex flex-col scale-[1.2] origin-top-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[20px] font-bold text-[#2a4e7c]">
                        {i + 1}
                      </span>

                      <img
                        src={item.img}
                        alt={item.alt}
                        style={{
                          width: "80px",
                          height: "auto",
                        }}
                      />

                      {/* OPTIONS */}
                      <div
                        role="radiogroup"
                        aria-label={`Item ${i + 1}: choose the vowel sound`}
                        className="flex flex-col gap-1.5 text-[18px]"
                      >
                        {item.options.map((opt, idx) => {
                          const isSelected = selected[i] === opt;
                          const optId = `o-${i}-${opt}`;

                          return (
                            <button
                              key={idx}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              aria-disabled={itemLocked}
                              aria-label={`Item ${i + 1}, ${optionLabel[opt]}.${
                                itemLocked && isSelected ? " Correct and locked." : ""
                              }`}
                              onPointerDown={() => {
                                pointerDownRef.current = true;
                              }}
                              onClick={() => {
                                pointerDownRef.current = false;
                                chooseOption(i, opt);
                              }}
                              onFocus={() => {
                                // التاب بيشغّل الصوت؛ الماوس بيتعامل معاه onClick
                                if (!pointerDownRef.current) {
                                  playAudio(optionAudio[opt], optId);
                                }
                              }}
                              onBlur={() => {
                                pointerDownRef.current = false;
                              }}
                              onKeyDown={(e) => {
                                if (isActivateKey(e)) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!e.repeat) chooseOption(i, opt);
                                }
                              }}
                              onKeyUp={(e) => {
                                if (isActivateKey(e)) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              className={`relative min-h-[40px] min-w-[72px] px-4 py-1 text-[18px] outline-none focus-visible:ring-4 focus-visible:ring-blue-300 rounded-full ${
                                itemLocked ? "cursor-default" : "cursor-pointer"
                              } ${
                                isSelected
                                  ? `border-2 ${
                                      isCorrect(i)
                                        ? "border-green-600"
                                        : "border-red-600"
                                    }`
                                  : `border-2 border-transparent ${
                                      itemLocked ? "" : "hover:bg-gray-100"
                                    }`
                              }`}
                            >
                              {opt}
                              {playingId === optId && <SpeakerBadge />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="relative w-40">
                      {/* feedback icon */}
                      {isWrong(i) && (
                        <span
                          aria-hidden="true"
                          className="absolute top-1 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                        >
                          ✕
                        </span>
                      )}
                   

                      <div
                        role="text"
                        aria-label={`Item ${i + 1} answer: ${
                          buildAnswer(i, selected[i]) || "empty"
                        }`}
                        className={`border-b-2 text-[18px] h-10 ${
                          isWrong(i)
                            ? "border-red-500"
                            : isCorrect(i)
                              ? "border-green-600"
                              : "border-[#444]"
                        }`}
                      >
                        {buildAnswer(i, selected[i])}
                      </div>

                    
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
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
  );
};

export default Unit7_Page5_Q1;
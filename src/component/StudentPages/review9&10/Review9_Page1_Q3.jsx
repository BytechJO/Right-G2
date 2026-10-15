import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 88/Ex C 2.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 88 - C/Item_001_He's_doing_his_homework.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 88 - C/Item_002_He's_washing_the_dishes.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 88 - C/Item_003_They're_ironing_the_clothes.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 88 - C/Item_004_They're_playing_soccer.mp3";
const clips = {
  "He's doing his homework": clip0,
  "He's washing the dishes": clip1,
  "They're ironing the clothes": clip2,
  "They're playing soccer": clip3,
};
const Review9_Page1_Q3 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = () => {
    const a = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    scopeRef.current?.querySelectorAll("audio").forEach((a) => {
      a.pause();
      try {
        a.currentTime = 0;
      } catch {
        /* media unavailable */
      }
    });
  };
  const listen = (key, text) => {
    const src = clips[normalizeAudioText(text)];
    if (!src) return;
    stopAudio();
    const a = new Audio(src);
    audioRef.current = a;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== a) return;
      a.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    a.onended = finish;
    a.onerror = fail;
    try {
      a.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (e) => {
      const a = audioRef.current;
      if (!a || e.target === a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      a.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const a = audioRef.current;
      audioRef.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
    };
  }, []);
  const badge = (key) =>
    playingKey === key && (
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
          background: "white",
          color: "black",
          pointerEvents: "none",
          zIndex: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const activation = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) action();
    }
  };
  const activationUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const feedbackStyle = (selected, result) => ({
    ...(selected && result
      ? {
          borderColor: result === "correct" ? "#16a34a" : "#ef4444",
          boxShadow: result === "correct" ? "0 3px 0 #16a34a" : undefined,
        }
      : {}),
    ...(selected ? { backgroundColor: "#dbeafe" } : {}),
  });

  const questions = [
    {
      id: 0,
      img: img1,
      options: [
        { key: "a", text: "He’s doing his homework." },
        { key: "b", text: "He’s washing the dishes." },
      ],
      correct: "a",
    },
    {
      id: 1,
      img: img2,
      options: [
        { key: "a", text: "They’re ironing the clothes." },
        { key: "b", text: "They’re playing soccer." },
      ],
      correct: "b",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);

  const selectAnswer = (qId, key) => {
    listen(
      `option-${qId}-${key}`,
      questions.find((q) => q.id === qId)?.options.find((o) => o.key === key)
        ?.text || "",
    );
    if (locked || results[qId] === "correct") return;
    setResults((prev) => ({ ...prev, [qId]: null }));
    setAnnouncement(`Question ${qId + 1}: option ${key} selected.`);

    setAnswers((prev) => ({
      ...prev,
      [qId]: key,
    }));
  };

  const reset = () => {
    stopAudio();
    setResults({});
    setAnnouncement("Activity reset.");
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    stopAudio();
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setAnnouncement("All answers shown and locked.");
    const correctAnswers = {};
    questions.forEach((q) => {
      correctAnswers[q.id] = q.correct;
    });
    setAnswers(correctAnswers);
    setLocked(true);
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    stopAudio();
    if (locked) return;

    // تحقق إذا كل الأسئلة متجاوبة
    const empty = questions.some((q) => !answers[q.id]);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }

    let correctCount = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      (completeCheck(checkEvent), ValidationAlert.success(msg));
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    setResults(
      Object.fromEntries(
        questions.map((q) => [
          q.id,
          answers[q.id] === q.correct ? "correct" : "wrong",
        ]),
      ),
    );
    setLocked(correctCount === total);
    setAnnouncement(`Score ${correctCount} out of ${total}.`);
  };
  const isWrongOption = (q, optKey) => {
    if (results[q.id] !== "wrong") return false;

    const selected = answers[q.id];
    if (!selected) return false;

    return selected === optKey && optKey !== q.correct;
  };
  //....
  return (
    <div ref={scopeRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "16px" }}>
        {/* HEADER */}
        <div className="header-title-page8 mb-10">
          <ExerciseHeader
            isReview={true}
            sectionLetter="C"
            title={<>Look and circle.</>}
            subTitle={"Read or listen carefully, then tap the option you would circle on the printed page."}
          />
        </div>
        <div className="flex flex-col gap-5">
          {questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              {/* TEXT */}
              <div style={{ flex: 1, fontSize: "20px" }}>
                {q.options.map((opt, i) => {
                  const isSelected = answers[q.id] === opt.key;

                  return (
                    <div
                      key={opt.key}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-disabled={locked || results[q.id] === "correct"}
                      aria-label={`Question ${q.id + 1}: ${opt.text}`}
                      className="rounded-lg focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                      onKeyDown={(e) =>
                        activation(e, () => selectAnswer(q.id, opt.key))
                      }
                      onKeyUp={activationUp}
                      onClick={() => selectAnswer(q.id, opt.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                        cursor: "pointer",
                        position: "relative", // 🔥 مهم
                        width: "50%",
                      }}
                    >
                      {i === 0 && (
                        <span
                          style={{ marginRight: "10px", fontWeight: "bold" }}
                        >
                          {index + 1}
                        </span>
                      )}

                      {i !== 0 && <span style={{ width: "20px" }}></span>}
                      <span style={{ marginRight: "8px", fontWeight: "bold" }}>
                        {opt.key}
                      </span>

                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "10px",
                          textWrap: "nowrap",
                          position: "relative",
                          border: isSelected
                            ? "2px solid red"
                            : "2px solid transparent",
                          ...feedbackStyle(isSelected, results[q.id]),
                        }}
                      >
                        {opt.text}
                        {badge(`option-${q.id}-${opt.key}`)}
                      </span>

                      {isWrongOption(q, opt.key) && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "13px",
                            width: "25px",
                            height: "25px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "bold",
                            border: "2px solid white",
                            zIndex: 10,
                          }}
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* IMAGE */}
              <img
                src={q.img}
                alt={
                  [
                    "A boy writing at a desk.",
                    "Two children playing soccer outdoors.",
                  ][q.id]
                }
                style={{
                  height: "150px",
                  width: "auto",
                  // objectFit: "cover",
                  borderRadius: "10px",
                  // border: "2px solid red",
                }}
              />
            </div>
          ))}
        </div>
        {/* BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
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
    </div>
  );
};

export default Review9_Page1_Q3;

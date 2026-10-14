import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_001_back.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_002_fat.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_003_May.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_004_pan.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_005_bat.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_006_lake.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_007_Dan.mp3";
import clip7 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_008_game.mp3";
import clip8 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_009_sack.mp3";
import clip9 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_010_mad.mp3";
import clip10 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_011_fan.mp3";
import clip11 from "../../../assets/audio/ClassBook/U 10/Page 89 - G/Item_012_way.mp3";
const clips = {
  back: clip0,
  fat: clip1,
  May: clip2,
  pan: clip3,
  bat: clip4,
  lake: clip5,
  Dan: clip6,
  game: clip7,
  sack: clip8,
  mad: clip9,
  fan: clip10,
  way: clip11,
};
const Review9_Page2_Q3 = () => {
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
    { id: 0, words: ["pan", "bat", "way"], correct: ["pan", "bat"] },
    { id: 1, words: ["back", "game", "sack"], correct: ["back", "sack"] },
    { id: 2, words: ["May", "Dan", "mad"], correct: ["Dan", "mad"] },
    { id: 3, words: ["fat", "lake", "fan"], correct: ["fat", "fan"] },
  ];

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [, setShowWrongMarks] = useState(false);
  const toggleWord = (qId, word) => {
    listen(`word-${qId}-${word}`, word);
    if (locked || results[qId]?.[word] === "correct") return;
    setResults((prev) => ({ ...prev, [qId]: { ...prev[qId], [word]: null } }));
    setAnnouncement(`${word} selected or removed.`);

    setAnswers((prev) => {
      const current = prev[qId] || [];

      const exists = current.includes(word);

      // إذا الكلمة موجودة → شيلها (toggle off)
      if (exists) {
        return {
          ...prev,
          [qId]: current.filter((w) => w !== word),
        };
      }

      // إذا وصل الحد (كلمتين) → لا تضيف
      if (current.length >= 2) {
        return prev;
      }

      // غير ذلك → أضف الكلمة
      return {
        ...prev,
        [qId]: [...current, word],
      };
    });
  };

  const reset = () => {
    stopAudio();
    setResults({});
    setAnnouncement("Activity reset.");
    setAnswers({});
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    stopAudio();
    setResults(
      Object.fromEntries(
        questions.map((q) => [
          q.id,
          Object.fromEntries(q.correct.map((w) => [w, "correct"])),
        ]),
      ),
    );
    setAnnouncement("All correct words shown and locked.");
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setAnswers(correct);
    setLocked(true);
    setShowWrongMarks(false);
  };
  const checkAnswers = () => {
    stopAudio();
    if (locked) return;

    // تحقق الكل متجاوب
    const empty = questions.some((q) => !answers[q.id]?.length);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      const user = answers[q.id] || [];

      const isCorrect =
        user.length === q.correct.length &&
        q.correct.every((w) => user.includes(w));

      if (isCorrect) score++;
    });

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowWrongMarks(true);
    setResults(
      Object.fromEntries(
        questions.map((q) => [
          q.id,
          Object.fromEntries(
            (answers[q.id] || []).map((w) => [
              w,
              q.correct.includes(w) ? "correct" : "wrong",
            ]),
          ),
        ]),
      ),
    );
    setLocked(score === total);
    setAnnouncement(`Score ${score} out of ${total}.`);
  };
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
      <div className="div-forall gap-2">
        <div className="header-title-page8 mb-10">
          <ExerciseHeader
            isReview={true}
            sectionLetter="G"
            title={"Read and circle the short a words."}
            subTitle={
              "Read or listen carefully, then tap the option you would circle on the printed page."
            }
          />
        </div>
        <div className="grid grid-cols-4 gap-10 w-full">
          {questions.map((q, index) => (
            <div key={q.id} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {index + 1}
              </div>

              <div
                style={{
                  border: "2px solid #1100d0ff",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {q.words.map((word) => {
                  const selected = answers[q.id]?.includes(word);

                  const isWrong = results[q.id]?.[word] === "wrong" && selected;

                  return (
                    <span
                      key={word}
                      role="button"
                      tabIndex={0}
                      aria-pressed={!!selected}
                      aria-disabled={
                        locked || results[q.id]?.[word] === "correct"
                      }
                      aria-label={`${word}${results[q.id]?.[word] === "correct" ? ". Correct and locked." : ""}`}
                      className=" focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                      onKeyDown={(e) =>
                        activation(e, () => toggleWord(q.id, word))
                      }
                      onKeyUp={activationUp}
                      onClick={() => toggleWord(q.id, word)}
                      style={{
                        cursor: "pointer",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        border: selected
                          ? "2px solid #0a007dff"
                          : "2px solid transparent",
                        fontSize: "20px",
                        fontWeight: "700",
                        position: "relative", // مهم
                        ...feedbackStyle(selected, results[q.id]?.[word]),
                      }}
                    >
                      {word}
                      {badge(`word-${q.id}-${word}`)}

                      {isWrong && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            width: "25px",
                            height: "25px",
                            background: "red",
                            color: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "2px solid white",
                          }}
                        >
                          ✕
                        </div>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="action-buttons-container mt-10">
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
  );
};

export default Review9_Page2_Q3;

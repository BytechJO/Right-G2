import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import sound1 from "../../../assets/audio/ClassBook/U 10/cd63pg89-instruction2-adult-lady_Gemt2j2G.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_001_main.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_002_mad.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_003_made.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_004_man.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_005_mat.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_006_mate.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_007_cap.mp3";
import clip7 from "../../../assets/audio/ClassBook/U 10/Page 89 - F/Item_008_cape.mp3";
const clips = {
  main: clip0,
  mad: clip1,
  made: clip2,
  man: clip3,
  mat: clip4,
  mate: clip5,
  cap: clip6,
  cape: clip7,
};
const Review9_Page2_Q2 = () => {
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
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = () => {
    setForceStopAudio(true);
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

  const stopAtSecond = 7.5;

  const captions = [
    {
      start: 0.519,
      end: 16.159,
      text: "Page 89, review 9, exercise F. Listen, read, and circle. 1, main. 2, mad. 3, cape. 4, mat.",
    },
  ];

  const questions = [
    { answer: "main" },
    { answer: "mad" },
    { answer: "cape" },
    { answer: "mat" },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [results, setResults] = useState([]);
  const [locked, setLocked] = useState(false);
  const [, setShowWrongMarks] = useState(false);

  const choose = (index, value) => {
    if (locked || results[index] === "correct") return;
    listen(`choice-${index}-${value}`, value);
    setResults((prev) => prev.map((r, i) => (i === index ? null : r)));
    setAnnouncement(`Question ${index + 1}: ${value} selected.`);

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const resetAll = () => {
    stopAudio();
    setResults([]);
    setAnnouncement("Activity reset. All answers cleared.");
    setAnswers(Array(questions.length).fill(""));
    setLocked(false);
    setShowWrongMarks(false);
  };

  const showAnswers = () => {
    stopAudio();
    setResults(questions.map(() => "correct"));
    setAnnouncement("All correct answers shown and locked.");
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
    setShowWrongMarks(false);
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();

    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      setAnnouncement("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a === questions[i].answer) score++;
    });

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(message));
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowWrongMarks(true);
    setResults(
      questions.map((q, i) => (answers[i] === q.answer ? "correct" : "wrong")),
    );
    setLocked(score === total);
    setAnnouncement(
      `Score ${score} out of ${total}. Incorrect answers can be changed.`,
    );
  };

  const choiceProps = (index, value) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": answers[index] === value,
    "aria-disabled": locked || results[index] === "correct",
    "aria-label":
      "Question " +
      (index + 1) +
      ": " +
      value +
      (locked || results[index] === "correct" ? ". Answer locked." : ""),
    className:
      "rounded-full focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!",
    onKeyDown: (e) => activation(e, () => choose(index, value)),
    onKeyUp: activationUp,
  });
  return (
    <div ref={scopeRef} className="main-container-component" onPlayCapture={() => setForceStopAudio(false)}>
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
            sectionLetter="F"
            title={<>Listen, read, and circle</>}
            subTitle={"Read or listen carefully, then tap the option you would circle on the printed page."}
          />
        </div>

        <QuestionAudioPlayer
          pageId="sb_review9_page2_q2"
          forceStop={forceStopAudio}
          onInteract={() => setForceStopAudio(false)}
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {[
            { id: 0, w1: "man", w2: "main" },
            { id: 1, w1: "mad", w2: "made" },
            { id: 2, w1: "cap", w2: "cape" },
            { id: 3, w1: "mat", w2: "mate" },
          ].map((item, index) => {
            const isWrong =
              results[index] === "wrong" &&
              answers[index] !== "" &&
              answers[index] !== questions[index].answer;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  marginBottom: "20px",
                  fontSize: "22px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "bold" }}>{index + 1}</span>

                {/* word 1 */}
                <span
                  {...choiceProps(index, item.w1)}
                  onClick={() => choose(index, item.w1)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      answers[index] === item.w1
                        ? "2px solid red"
                        : "2px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                    ...feedbackStyle(
                      answers[index] === item.w1,
                      results[index],
                    ),
                  }}
                >
                  {item.w1}
                  {badge(`choice-${index}-${item.w1}`)}

                  {answers[index] === item.w1 && isWrong && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "22px",
                        height: "22px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      ✕
                    </div>
                  )}
                </span>

                {/* word 2 */}
                <span
                  {...choiceProps(index, item.w2)}
                  onClick={() => choose(index, item.w2)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border:
                      answers[index] === item.w2
                        ? "2px solid red"
                        : "2px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                    ...feedbackStyle(
                      answers[index] === item.w2,
                      results[index],
                    ),
                  }}
                >
                  {item.w2}
                  {badge(`choice-${index}-${item.w2}`)}

                  {answers[index] === item.w2 && isWrong && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "22px",
                        height: "22px",
                        background: "red",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "2px solid white",
                      }}
                    >
                      ✕
                    </div>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container mt-10">
        <button onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }} className="try-again-button">
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

export default Review9_Page2_Q2;

import React, { useState, useRef } from "react";
import "./Unit10_Page5_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 47.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 46.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 86/Asset 52.svg";
import sound1 from "../../../assets/audio/ClassBook/U 10/cd61pg86-instruction1-adult-lady_cLv0ekXg.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import ExerciseHeader from "../../ExerciseHeader";
const Unit10_Page5_Q1 = () => {
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

  const stopAtSecond = 11.019;
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const audioScope = useRef(null);
  const stopAudio = () =>
    audioScope.current?.querySelectorAll("audio").forEach((audio) => {
      audio.pause();
      
    }); // ⭐ NEW — قفل التعديل بعد Show Answer

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.5,
      end: 11.019,
      text: "Page 86, Right Activities. Exercise A, number 1. Do they both have the same vowel sound? Listen and write ✓ or X.",
    },
    { start: 12.159, end: 13.619, text: "1, nest." },
    { start: 14.719, end: 20.739, text: "2, green desk. 3, seal, eat." },
  ];
  const questions = [
    {
      id: 1,
      image: img1,
      correct: "✓",
    },
    { id: 2, image: img2, correct: "✗" },
    {
      id: 3,
      image: img3,
      correct: "✓",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState([]);

  const selectAnswer = (id, value) => {
    if (
      locked ||
      showResult[questions.findIndex((q) => q.id === id)] === "correct"
    )
      return;
    setAnswers({ ...answers, [id]: value });
    setShowResult((prev) =>
      prev.map((result, index) => (questions[index].id === id ? null : result)),
    );
    setAnnouncement(
      `Question ${id}: ${value === "✓" ? "same vowel sound" : "different vowel sounds"} selected.`,
    );
  };
  const showAnswers = () => {
    stopAudio();
    const corrects = {};
    questions.forEach((q) => {
      corrects[q.id] = q.correct; // ✓ أو ✗
    });

    setAnswers(corrects);
    setShowResult(questions.map(() => "correct"));
    setAnnouncement("All correct answers shown and locked.");
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();
    // 1) فحص الخانات الفارغة
    const isEmpty = questions.some((q) => !answers[q.id]);
    if (isEmpty) {
      ValidationAlert.info("Please choose ✓ or ✗ for all questions!");
      setAnnouncement("Please choose an answer for all questions.");
      return;
    }

    // 2) مقارنة الإجابات
    const results = questions.map((q) =>
      answers[q.id] === q.correct ? "correct" : "wrong",
    );

    setShowResult(results);
    setLocked(results.every((result) => result === "correct"));
    setAnnouncement(
      `Score ${results.filter((result) => result === "correct").length} out of ${questions.length}. Wrong answers can be changed.`,
    );
    // 3) حساب السكور
    const correctCount = results.filter((r) => r === "correct").length;
    const total = questions.length;
    const scoreMsg = `${correctCount} / ${total}`;

    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const resultHTML = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${scoreMsg}
        </span>
      </div>
    `;

    if (correctCount === total) (completeCheck(checkEvent), ValidationAlert.success(resultHTML));
    else if (correctCount === 0) ValidationAlert.error(resultHTML);
    else ValidationAlert.warning(resultHTML);
  };
  //...
  const resetAnswers = () => {
    stopAudio();
    setAnnouncement("Activity reset. All answers cleared.");
    setAnswers({});
    setShowResult([]);
    setLocked(false); // ← مهم جداً
  };

  const activate = (e, id, value) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.repeat) selectAnswer(id, value);
  };
  const keyUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const optionStyle = (q, index, value) => {
    const selected = answers[q.id] === value;
    const result = selected ? showResult[index] : null;
    return {
      width: 45,
      height: 45,
      boxSizing: "border-box",
      border: result
        ? `2px solid ${result === "correct" ? "#16a34a" : "#ef4444"}`
        : selected
          ? "3px solid #777cfd"
          : "2px solid #ff6b57",
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      cursor: "pointer",
      fontSize: 22,
      fontWeight: "bold",
      backgroundColor: selected ? "#dbeafe" : "#fff",
      transition: "background-color 0.15s ease, border-color 0.15s ease",
      boxShadow: result === "correct" ? "0 3px 0 #16a34a" : undefined,
    };
  };
  const wrongBadgeStyle = {
    position: "absolute",
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: "50%",
    backgroundColor: "red",
    color: "#fff",
    border: "2px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "bold",
    pointerEvents: "none",
    zIndex: 5,
  };
  return (
    <div ref={audioScope} className="main-container-component">
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
          questionNumber="1"
          title={
          "Do they both have the same vowel sound? Listen and write ✓ or ✗."
          }
          subTitle={"Listen to both sounds carefully, then choose Yes/No only after comparing them."}
        />
        <div className="flex flex-col gap-5">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              width: "100%",
            }}
          >
            <QuestionAudioPlayer
              pageId="sb_unit10_page5_q1"
              src={sound1}
              captions={captions}
              stopAtSecond={stopAtSecond}
            />
          </div>
          <div className="CB-review10-p5-q1-container">
            {questions.map((q, index) => (
              <div key={q.id} className="CB-unit10-p5-q1-question-box">
                <div className="CB-review1-p2-q1-flex">
                  <div className="flex gap-5">
                    <span style={{ fontSize: "20px", fontWeight: "700" }}>
                      {q.id}
                    </span>
                    <img
                      src={q.image}
                      alt={
                        [
                          "A nest and a pen.",
                          "A school desk and a tube of green paint.",
                          "A girl eating and a seal.",
                        ][index]
                      }
                      style={{ height: "150px", width: "auto" }}
                    />
                  </div>

                  <div
                    className="CB-review1-p2-q1-options-box"
                    style={{
                      display: "flex",
                      gap: 20,
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    {/* خيار الصح */}
                    <div
                      className="CB-review1-p2-q1-option-wrapper"
                      style={{ position: "relative" }}
                    >
                      <div
                        className={`CB-review1-p2-q1-option-btn focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! ${
                          answers[q.id] === "✓" ? "is-selected" : ""
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Question ${q.id}: same vowel sound${locked || showResult[index] === "correct" ? ". Answer locked." : ""}`}
                        aria-pressed={answers[q.id] === "✓"}
                        aria-disabled={
                          locked || showResult[index] === "correct"
                        }
                        style={optionStyle(q, index, "✓")}
                        onKeyDown={(e) => activate(e, q.id, "✓")}
                        onKeyUp={keyUp}
                        onClick={() => selectAnswer(q.id, "✓")}
                      >
                        <img
                          src={trueIcon}
                          alt=""
                          aria-hidden="true"
                          style={{ height: "25px", width: "auto" }}
                        />
                      </div>

                      {showResult[index] === "wrong" &&
                        answers[q.id] === "✓" && (
                          <div
                            className="CB-review1-p2-q1-wrong-icon"
                            aria-hidden="true"
                            style={wrongBadgeStyle}
                          >
                            ✕
                          </div>
                        )}
                    </div>

                    {/* خيار الخطأ */}
                    <div
                      className="CB-review1-p2-q1-option-wrapper"
                      style={{ position: "relative" }}
                    >
                      <div
                        className={`CB-review1-p2-q1-option-btn focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! ${
                          answers[q.id] === "✗" ? "is-selected" : ""
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Question ${q.id}: different vowel sounds${locked || showResult[index] === "correct" ? ". Answer locked." : ""}`}
                        aria-pressed={answers[q.id] === "✗"}
                        aria-disabled={
                          locked || showResult[index] === "correct"
                        }
                        style={optionStyle(q, index, "✗")}
                        onKeyDown={(e) => activate(e, q.id, "✗")}
                        onKeyUp={keyUp}
                        onClick={() => selectAnswer(q.id, "✗")}
                      >
                        <img
                          src={falseIcon}
                          alt=""
                          aria-hidden="true"
                          style={{ height: "25px", width: "auto" }}
                        />
                      </div>

                      {showResult[index] === "wrong" &&
                        answers[q.id] === "✗" && (
                          <div
                            className="CB-review1-p2-q1-wrong-icon"
                            aria-hidden="true"
                            style={wrongBadgeStyle}
                          >
                            ✕
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (resetAnswers)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
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

export default Unit10_Page5_Q1;

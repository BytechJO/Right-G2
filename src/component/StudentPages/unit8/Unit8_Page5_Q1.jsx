import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A 4.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/audio/ClassBook/U 8/cd48pg68-instruction1-adult-lady_IL6QUJR1.mp3";
const keyboardFocusClass = "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const Unit8_Page5_Q1 = () => {
  const items = [
    { img: img1, correct: "yes", alt: "A grey animal with long ears, a mane, four hooves, and a tail." },
    { img: img2, correct: "no", alt: "A yellow circle surrounded by orange rays." },
    { img: img3, correct: "yes", alt: "A wax drawing stick with a pointed tip." },
    { img: img4, correct: "no", alt: "A frozen cube with water dripping down its sides." },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(Array(items.length).fill(null));
  const [message, setMessage] = useState("");
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const exerciseRef = useRef(null);
  const isLocked = (i) => locked || results[i] === "correct";
  const stopInstructionAudio = (rewind = false) => {
    const audio = exerciseRef.current?.querySelector("audio");
    if (audio) {
      audio.pause();
      if (rewind) audio.currentTime = 0;
    }
    setForceStopAudio(true);
  };
  const choiceProps = (i, value) => ({
    type: "button",
    "aria-pressed": selected[i] === value,
    "aria-disabled": isLocked(i),
    "aria-label": `Question ${i + 1}: ${value === "yes" ? "Tick, has long u" : "Cross, does not have long u"}${
      selected[i] === value && results[i] === "correct" ? ", correct and locked" :
      selected[i] === value && results[i] === "wrong" ? ", incorrect, you can change it" : ""
    }`,
    style: selected[i] === value && results[i]
      ? {
          borderColor: results[i] === "correct" ? "#16a34a" : "#ef4444",
       
        } : undefined,
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) e.currentTarget.click();
    },
    onKeyUp: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
    },
  });
  const captions = [
    {
      start: 0.539,
      end: 10.739,
      text: "Page 68, Right Activities. Exercise A, number 1. Does it have a long U? Listen and write ✓ or X.",
    },
    { start: 11.88, end: 15.739, text: "1, mule. 2, sun." },
    { start: 16.819, end: 20.979, text: "3, blue. 4, ice" },
  ];

  const choose = (i, value) => {
    if (isLocked(i)) {
      setMessage(`Question ${i + 1} is locked. Press Start Again to try again.`);
      return;
    }

    const updated = [...selected];
    updated[i] = value;
    setSelected(updated);
    setResults((previous) => previous.map((result, index) => index === i ? null : result));
    setMessage(`Question ${i + 1}: ${value === "yes" ? "tick" : "cross"} selected.`);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (selected.includes("")) {
      ValidationAlert.info("Please answer all questions.");
      setMessage("Please answer all questions.");
      return;
    }

    const checked = items.map((item, i) =>
      results[i] === "correct" || selected[i] === item.correct ? "correct" : "wrong",
    );
    const score = checked.filter((result) => result === "correct").length;

    const total = items.length;

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

    setLocked(score === total);
    setResults(checked);
    setMessage(`Score ${score} out of ${total}. ${checked.map((result, i) =>
      `Question ${i + 1}: ${result === "correct" ? "correct and locked" : "incorrect, you can change it"}.`,
    ).join(" ")}`);
  };

  const showAnswers = () => {
    setSelected(items.map((i) => i.correct));
    setLocked(true);
    setResults(Array(items.length).fill("correct"));
    setMessage("Correct answers are shown and locked. Press Start Again to try again.");
  };
  const reset = () => {
    stopInstructionAudio(true);
    setSelected(Array(items.length).fill(""));
    setLocked(false);
    setResults(Array(items.length).fill(null));
    setMessage("Exercise reset. All answers and feedback are cleared.");
  };
  const isWrong = (i) => {
    return results[i] === "wrong";
  };
  return (
    <div ref={exerciseRef} className="main-container-component"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.stopPropagation(); }}
      onKeyUp={(e) => { if (e.key === "Enter" || e.key === " ") e.stopPropagation(); }}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</div>
      <p id="u8p5q1-help" className="sr-only">Use Tab and Shift+Tab to move between controls. Press Enter or Space to choose tick or cross. After checking, correct answers are locked and incorrect answers can be changed.</p>
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="A"
          questionNumber="1"
          title={"Does it have a long u? Listen and write ✓ or ✗."}
          subTitle={"Read the clue completely, then tap the option that best matches it."}
        />
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={10.73}
          forceStop={forceStopAudio}
          pageId={"unit8-page5-q1"}
          onInteract={() => setForceStopAudio(false)}
        />
        {/* GRID */}
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="Questions" aria-describedby="u8p5q1-help">
          {items.map((item, i) => (
            <div
              key={i}
              role="group"
              aria-label={`Question ${i + 1}`}
              className="flex flex-col items-center justify-center gap-3 relative mt-4"
            >
              {/* number in corner */}
              <span className="absolute -top-1 -left-1 text-lg font-bold">
                {i + 1}
              </span>

              {/* image + audio */}
              <div className="flex flex-col items-center">
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-[150px]! h-[150px]! object-contain"
                />
              </div>

              {/* answers on right */}
              <div className="flex gap-2 justify-center h-[150px] relative">
                <button
                  {...choiceProps(i, "yes")}
                  onClick={() => choose(i, "yes")}
                  className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${keyboardFocusClass} ${
                    selected[i] === "yes"
                      ? "border-2 border-blue-800 bg-blue-100 text-black"
                      : ""
                  }`}
                >
                  <img src={trueIcon} alt="" aria-hidden="true" style={{ height: "25px" }} />

                  {isWrong(i) &&
                    selected[i] === "yes" &&
                    item.correct !== "yes" && (
                      <span aria-hidden="true" className="absolute -top-2 right-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                        ✕
                      </span>
                    )}
                </button>

                <button
                  {...choiceProps(i, "no")}
                  onClick={() => choose(i, "no")}
                  className={`w-10 h-10 flex items-center justify-center border rounded text-lg ${keyboardFocusClass} ${
                    selected[i] === "no"
                      ? "border-2 border-blue-800 bg-blue-100 text-black"
                      : ""
                  }`}
                >
                  <img src={falseIcon} alt="" aria-hidden="true" style={{ height: "25px" }} />

                  {isWrong(i) &&
                    selected[i] === "no" &&
                    item.correct !== "no" && (
                      <span aria-hidden="true" className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
                        ✕
                      </span>
                    )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* buttons */}
        <div className="action-buttons-container">
          <button type="button" onClick={reset} className={`try-again-button`}>
            Start Again ↻
          </button>

          <button type="button" onClick={showAnswers} className={`show-answer-btn`}>
            Show Answer
          </button>

          <button type="button" onClick={checkAnswers} className={`check-button2`} aria-disabled={locked}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit8_Page5_Q1;

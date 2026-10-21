import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Ex A 1.svg";

import sound1 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_001_pilot.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_002_suitcase.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_003_flight_attendant.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_004_reception.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_005_souvenir_shop.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_006_carry.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_007_arrival.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_008_roll.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_009_hold.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/Page 70 - A/Item_010_airplane.mp3";

const wordAudio = {
  pilot: sound1,
  suitcase: sound2,
  "flight attendant": sound3,
  reception: sound4,
  "souvenir shop": sound5,
  carry: sound6,
  arrival: sound7,
  roll: sound8,
  hold: sound9,
  airplane: sound10,
};
const focusClass =
  " focus-visible:outline-4! focus-visible:outline-[#2563eb]! rounded focus-visible:outline-offset-4!";

const Review7_Page1_Q1 = () => {
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

  const questions = [
    {
      options: ["pilot", "suitcase", "flight attendant"],
      answer: "flight attendant",
    },
    {
      options: ["reception", "pilot", "souvenir shop"],
      answer: "pilot",
    },
    {
      options: ["carry", "arrival", "suitcase"],
      answer: "suitcase",
    },
    {
      options: ["reception", "suitcase", "roll"],
      answer: "reception",
    },
    {
      options: ["suitcase", "souvenir shop", "roll"],
      answer: "roll",
    },
    {
      options: ["reception", "hold", "airplane"],
      answer: "airplane",
    },
  ];

  const [answers, setAnswers] = useState(Array(6).fill(""));
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(Array(questions.length).fill(null));
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const isLocked = (index) => locked || results[index] === "correct";
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playAudio = (src, key) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    audio.play().catch(fail);
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const onActivateKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.repeat) e.currentTarget.click();
  };
  const onActivateKeyUp = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
  };

  const choose = (qIndex, value) => {
    playAudio(wordAudio[value], `option-${qIndex}-${value}`);
    if (isLocked(qIndex)) {
      setAnnouncement(
        `Question ${qIndex + 1} is locked. Press Start Again to try again.`,
      );
      return;
    }

    const updated = [...answers];
    updated[qIndex] = value;

    setAnswers(updated);
    setResults((previous) =>
      previous.map((result, index) => (index === qIndex ? null : result)),
    );
    setAnnouncement(`Question ${qIndex + 1}: ${value} selected.`);
  };

  const resetAll = () => {
    stopAudio();
    setAnswers(Array(6).fill(""));
    setLocked(false);
    setResults(Array(questions.length).fill(null));
    setAnnouncement(
      "Exercise reset. All answers, locks, and feedback are cleared.",
    );
  };

  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((q) => q.answer));
    setLocked(true);
    setResults(Array(questions.length).fill("correct"));
    setAnnouncement("Correct answers are shown and locked.");
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();
    if (answers.includes("")) {
      ValidationAlert.info("Please complete all answers");
      setAnnouncement("Please complete all answers.");
      return;
    }

    const checked = questions.map((q, i) =>
      results[i] === "correct" || answers[i] === q.answer ? "correct" : "wrong",
    );
    const score = checked.filter((result) => result === "correct").length;
    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
<div style="font-size:20px;text-align:center;">
<b style="color:${color};">Score: ${score} / ${total}</b>
</div>
`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(message));
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
    setResults(checked);
    setLocked(score === total);
    setAnnouncement(
      `Score ${score} out of ${total}. ${checked.map((result, i) => `Question ${i + 1}: ${result === "correct" ? "correct and locked" : "incorrect, you can change it"}.`).join(" ")}`,
    );
  };

  const speakerBadge = (key) =>
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

  return (
    <div
      className="main-container-component"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="r7p1q1-help" className="sr-only">
        Use Tab and Shift+Tab to move between choices. Enter or Space listens to
        and selects a word. Correct answers are locked after checking. Incorrect
        answers can be changed and checked again.
      </p>
      <div className="div-forall" style={{ gap: "45px" }}>
        <ExerciseHeader
          sectionLetter="A"
          title="Look and circle."
          subTitle={
            "Read or listen carefully, then tap the option you would circle on the printed page."
          }
          isReview={true}
        />

        {/* IMAGE */}

        <div className="flex justify-center">
          <img
            src={img1}
            alt="An airport scene with uniformed staff, travelers carrying and pulling luggage, shops, a counter with a computer, and an airplane outside."
            className="object-contain rounded-xl"
            style={{ height: "190px", width: "auto" }}
          />
        </div>

        {/* OPTIONS */}

        <div className="grid grid-cols-6 gap-4">
          {questions.map((q, qIndex) => {
            return (
              <div
                key={qIndex}
                role="group"
                aria-label={`Question ${qIndex + 1}`}
                aria-describedby="r7p1q1-help"
                className="bg-[#f9e5dd] rounded-xl p-3 text-center flex flex-col gap-1"
              >
                <div className="font-bold">{qIndex + 1}</div>

                {q.options.map((word) => {
                  const isSelected = answers[qIndex] === word;
                  const isWrong = isSelected && results[qIndex] === "wrong";
                  const key = `option-${qIndex}-${word}`;

                  return (
                    <div
                      key={word}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-disabled={isLocked(qIndex)}
                      aria-label={`Question ${qIndex + 1}: ${word}${isSelected && results[qIndex] ? (results[qIndex] === "correct" ? ", correct and locked" : ", incorrect, you can change it") : ""}`}
                      onClick={() => choose(qIndex, word)}
                      onFocus={(e) => {
                        if (e.currentTarget.matches(":focus-visible"))
                          playAudio(wordAudio[word], key);
                      }}
                      onKeyDown={onActivateKeyDown}
                      onKeyUp={onActivateKeyUp}
                      style={{
                        borderColor:
                          isSelected && results[qIndex]
                            ? results[qIndex] === "correct"
                              ? "#16a34a"
                              : "#ef4444"
                            : undefined,

                        backgroundColor:
                          playingKey === key ? "#dbeafe" : undefined,
                        outline:
                          playingKey === key ? "3px solid #2563eb" : undefined,
                        outlineOffset: playingKey === key ? "2px" : undefined,
                      }}
                      className={`cursor-pointer px-2 py-1 relative ${focusClass}
${isSelected ? "border-2 border-blue-500 rounded-full px-3 py-1" : ""}
`}
                    >
                      {word}
                      {speakerBadge(key)}

                      {isWrong && (
                        <div
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
                        >
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}

      <div className="action-buttons-container mt-10">
        <button type="button" onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }} className={`try-again-button`}>
          Start Again ↻
        </button>

        <button
          type="button"
          onClick={showAnswers}
          className={`show-answer-btn`}
        >
          Show Answer
        </button>

        <button
          type="button"
          onClick={checkAnswers}
          aria-disabled={locked}
          className={`check-button2`}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review7_Page1_Q1;

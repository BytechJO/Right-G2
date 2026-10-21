import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import friendSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_001_is_my_best_friend.mp3";
import sueSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_002_Sue.mp3";
import glueSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_003_glue.mp3";
import colorSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_004_My_favorite_color_is.mp3";
import tuneSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_005_tune.mp3";
import blueSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_006_blue.mp3";
import vacationSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_007_The_summer_vacation_starts_in.mp3";
import juneSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_008_June.mp3";
import decemberSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_009_December.mp3";

const questions = [
  {
    sentence: "_____ is my best friend.",
    options: ["Sue", "glue"],
    correct: "Sue",
    fragmentSound: friendSound,
    soundPart: 1,
  },
  {
    sentence: "My favorite color is _____.",
    options: ["tune", "blue"],
    correct: "blue",
    fragmentSound: colorSound,
    soundPart: 0,
  },
  {
    sentence: "The summer vacation starts in _____.",
    options: ["June", "December"],
    correct: "June",
    fragmentSound: vacationSound,
    soundPart: 0,
  },
];
const wordSounds = {
  Sue: sueSound,
  glue: glueSound,
  tune: tuneSound,
  blue: blueSound,
  June: juneSound,
  December: decemberSound,
};
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

const Review8_Page2_Q3 = () => {
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

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(Array(questions.length).fill(null));
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null);
  const isLocked = (i) => locked || results[i] === "correct";
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
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const selectAnswer = (i, value) => {
    playAudio(wordSounds[value], `option-${i}-${value}`);
    if (isLocked(i)) {
      setAnnouncement(
        `Question ${i + 1} is locked. Press Start Again to try again.`,
      );
      return;
    }
    setAnswers((prev) =>
      prev.map((answer, index) => (index === i ? value : answer)),
    );
    setResults((prev) =>
      prev.map((result, index) => (index === i ? null : result)),
    );
    setAnnouncement(`Question ${i + 1}: ${value} selected.`);
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();
    if (answers.includes(null)) {
      ValidationAlert.info("Please answer all questions.");
      setAnnouncement("Please answer all questions.");
      return;
    }
    const next = questions.map((q, i) =>
      results[i] === "correct" || answers[i] === q.correct
        ? "correct"
        : "wrong",
    );
    setResults(next);
    const score = next.filter((result) => result === "correct").length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;margin-top:8px;"><span style="color:${color};font-weight:bold;">Score: ${score}/${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setLocked(score === total);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...next.map(
          (result, i) =>
            `Question ${i + 1} is ${result === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((q) => q.correct));
    setResults(Array(questions.length).fill("correct"));
    setLocked(true);
    setAnnouncement("All correct answers shown and locked.");
  };
  const reset = () => {
    stopAudio();
    setAnswers(Array(questions.length).fill(null));
    setResults(Array(questions.length).fill(null));
    setLocked(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const activationProps = (action) => ({
    onKeyDown: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) action();
      }
    },
    onKeyUp: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });
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
          pointerEvents: "none",
          zIndex: 3,
          background: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const fragment = (text, q, i, part) => {
    if (part !== q.soundPart) return text;
    const key = `fragment-${i}`;
    const listen = () => playAudio(q.fragmentSound, key);
    return (
      <>
      {text.startsWith(" ") ? " " : null}
      <span
        role="button"
        tabIndex={0}
        aria-label={`${text.trim()} Press Enter or Space to listen.`}
        className={`relative inline-block cursor-pointer${focusClass}`}
        style={playingKey === key ? activeStyle : undefined}
        onClick={listen}
        {...activationProps(listen)}
      >
        {text.trim()}
        {badge(key)}
      </span>
      {text.endsWith(" ") ? " " : null}
      </>
    );
  };
  return (
    <div className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "120px" }}>
        <ExerciseHeader
          sectionLetter="G"
          title="Circle and write."
          subTitle={"Read or listen carefully, then tap the option you would circle on the printed page."}
          isReview={true}
        />
        <div className="space-y-18">
          {questions.map((q, i) => {
            const parts = q.sentence.split("_____"),
              wrong = results[i] === "wrong",
              blankKey = `answer-${i}`;
            return (
              <div
                key={i}
                role="group"
                aria-label={`Question ${i + 1}`}
                className="flex items-center gap-4 "
              >
                <span className="font-bold text-xl">{i + 1}</span>
                <span className="flex-1 text-xl">
                  {fragment(parts[0], q, i, 0)}
                  <span className="relative inline-block">
                    {answers[i] ? (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Hear selected answer ${answers[i]} for question ${i + 1}${results[i] ? (results[i] === "correct" ? ", correct and locked" : ", incorrect") : ""}`}
                        className={`relative inline-block border-b-2 px-2 cursor-pointer ${results[i] === "correct" ? "border-green-600" : wrong ? "border-red-500" : "border-black"}${focusClass}`}
                        style={
                          playingKey === blankKey ? activeStyle : undefined
                        }
                        onClick={() =>
                          playAudio(wordSounds[answers[i]], blankKey)
                        }
                        {...activationProps(() =>
                          playAudio(wordSounds[answers[i]], blankKey),
                        )}
                      >
                        {answers[i]}
                        {badge(blankKey)}
                      </span>
                    ) : (
                      <span className="border-b-2 border-black px-10 inline-block" />
                    )}
                    {wrong && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                      >
                        ✕
                      </span>
                    )}
                  </span>
                  {fragment(parts[1], q, i, 1)}
                </span>
                <div
                  className="flex gap-20 text-xl w-[30%]"
                  style={{ justifyContent: "flex-start" }}
                >
                  {q.options.map((opt, index) => {
                    const selected = answers[i] === opt,
                      key = `option-${i}-${opt}`;
                    return (
                      <span
                        key={opt}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selected}
                        aria-disabled={isLocked(i)}
                        aria-label={`Question ${i + 1}, ${index === 0 ? "a" : "b"}: ${opt}${selected && results[i] ? (results[i] === "correct" ? ", correct and locked" : ", incorrect, you can change it") : ""}`}
                        onClick={() => selectAnswer(i, opt)}
                        {...activationProps(() => selectAnswer(i, opt))}
                        className={`relative cursor-pointer${focusClass} ${selected ? "border-2 border-blue-700 rounded-full px-2 font-bold" : ""}`}
                        style={{
                          ...(playingKey === key ? activeStyle : {}),
                          borderColor:
                            selected && results[i]
                              ? results[i] === "correct"
                                ? "#16a34a"
                                : "#ef4444"
                              : undefined,
                        }}
                      >
                        <span className="font-bold mr-1">
                          {index === 0 ? "a" : "b"}
                        </span>
                        {opt}
                        {badge(key)}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
export default Review8_Page2_Q3;

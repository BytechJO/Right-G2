import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import trueIcon from "../../../assets/imgs/true.svg";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 3.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 4.svg";
import tvSound from "../../../assets/audio/ClassBook/U 9/Page 81 - E/Item_001_They're_watching_TV.mp3";
import englishSound from "../../../assets/audio/ClassBook/U 9/Page 81 - E/Item_002_They're_studying_English.mp3";
import chessSound from "../../../assets/audio/ClassBook/U 9/Page 81 - E/Item_003_We're_playing_chess.mp3";
import cookingSound from "../../../assets/audio/ClassBook/U 9/Page 81 - E/Item_004_We're_cooking_lunch.mp3";
import radioSound from "../../../assets/audio/ClassBook/U 9/Page 81 - E/Item_005_They're_listening_to_the_radio.mp3";
const questions = [
  {
    id: 1,
    img: img1,
    options: ["They're watching TV.", "They're studying English."],
    correct: "They're studying English.",
    alt: "Two children reading books at a table, including a book labeled ENGLISH.",
  },
  {
    id: 2,
    img: img2,
    options: ["We're playing chess.", "We're cooking lunch."],
    correct: "We're playing chess.",
    alt: "Two children playing chess on a mat.",
  },
  {
    id: 3,
    img: img3,
    options: ["They're watching TV.", "They're listening to the radio."],
    correct: "They're watching TV.",
    alt: "Two children watching a television.",
  },
];

const sentenceSounds = {
  "They're watching TV.": tvSound,
  "They're studying English.": englishSound,
  "We're playing chess.": chessSound,
  "We're cooking lunch.": cookingSound,
  "They're listening to the radio.": radioSound,
};
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};
const exerciseTitle = "Look, read, and write ✓.";

const Unit9_Page6_Q2 = () => {
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

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null);
  const isLocked = (id) => revealed || results[id] === "correct";
  const allDone = questions.every((q) => isLocked(q.id));
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
  const playSentence = (sentence, key) => {
    stopAudio();
    const audio = new Audio(sentenceSounds[sentence]);
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
  const handleSelect = (qId, option, key) => {
    playSentence(option, key);
    if (isLocked(qId)) {
      setAnnouncement(
        `Question ${qId} is correct and locked. Press Start Again to try again.`,
      );
      return;
    }
    setAnswers((prev) => ({ ...prev, [qId]: option }));
    setResults((prev) => ({ ...prev, [qId]: null }));
    setAnnouncement(`Question ${qId}: ${option} selected.`);
  };
  const reset = () => {
    stopAudio();
    setAnswers({});
    setResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const showAnswers = () => {
    stopAudio();
    setAnswers(Object.fromEntries(questions.map((q) => [q.id, q.correct])));
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setRevealed(true);
    setAnnouncement("All correct answers shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || allDone) return;
    stopAudio();
    if (questions.some((q) => !answers[q.id])) {
      ValidationAlert.info("Please answer all questions.");
      setAnnouncement("Please answer all questions.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        q.id,
        results[q.id] === "correct" || answers[q.id] === q.correct
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id}: ${next[q.id] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  return (
    <div className="main-container-component mb-10">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "50px" }}>
        <ExerciseHeader
          sectionLetter="E"
          title={exerciseTitle}
          subTitle={
            "Read the clue completely, then tap the option that best matches it."
          }
        />
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div
              key={q.id}
              role="group"
              aria-label={`Question ${q.id}`}
              className="flex items-center gap-6 "
            >
              <div className="flex items-start gap-3">
                <span className="font-bold w-5">{q.id}</span>
                <img
                  src={q.img}
                  alt={q.alt}
                  style={{ height: "auto", width: "250px", objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-3">
                {q.options.map((option, i) => {
                  const selected = answers[q.id] === option,
                    key = `option-${q.id}-${i}`;
                  const wrong = selected && results[q.id] === "wrong",
                    correct = selected && results[q.id] === "correct";
                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      aria-disabled={isLocked(q.id)}
                      data-option={key}
                      aria-label={`Question ${q.id}: ${option}${selected && results[q.id] ? (correct ? " Correct and locked." : " Incorrect, you can change it.") : ""}`}
                      onClick={() => handleSelect(q.id, option, key)}
                      className={`flex items-center gap-3 cursor-pointer${focusClass}`}
                      onKeyDown={(e) => {
                        if (activateKey(e)) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!e.repeat) handleSelect(q.id, option, key);
                        }
                      }}
                      onKeyUp={(e) => {
                        if (activateKey(e)) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div
                        aria-hidden="true"
                        data-checkbox={key}
                        className={`relative w-[45px] h-[45px] rounded-lg border-2 flex items-center justify-center transition ${selected ? (correct ? "border-green-600 bg-blue-50" : wrong ? "border-red-600 bg-blue-50" : "border-blue-800 bg-blue-50") : "border-gray-400 bg-white"}`}
                        style={
                          correct ? { boxShadow: "0 2px 0 #16a34a" } : undefined
                        }
                      >
                        {selected && (
                          <span className="text-xl font-bold leading-none text-blue-800">
                            <img
                              src={trueIcon}
                              alt=""
                              style={{ height: "25px", width: "auto" }}
                            />
                            {wrong && (
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white z-10">
                                ✕
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                      <span
                        className="relative text-[20px] rounded-md"
                        data-sentence={key}
                        style={playingKey === key ? activeStyle : undefined}
                      >
                        {option}
                        {playingKey === key && (
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
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
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
  );
};
export default Unit9_Page6_Q2;

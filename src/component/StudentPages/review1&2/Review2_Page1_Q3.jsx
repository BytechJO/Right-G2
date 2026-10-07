import React, { useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex C 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page18/Ex C 4.svg";

import thisAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - C/this.mp3";
import thatAudio from "../../../assets/audio/ClassBook/U 2/Page 18 - C/that.mp3";
import { FaVolumeUp } from "react-icons/fa";
import "./Review2_Page1_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";

const Review2_Page1_Q3 = () => {
  const [answers, setAnswers] = useState(Array(4).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const audioRefs = useRef({});

  const items = [
    {
      img: img1,
      alt: "A picture showing something near the speaker",
      options: ["this", "that"],
      correctIndex: 0,
    },
    {
      img: img2,
      alt: "A picture showing something far from the speaker",
      options: ["this", "that"],
      correctIndex: 1,
    },
    {
      img: img3,
      alt: "A picture showing something near the speaker",
      options: ["this", "that"],
      correctIndex: 0,
    },
    {
      img: img4,
      alt: "A picture showing something far from the speaker",
      options: ["this", "that"],
      correctIndex: 1,
    },
  ];

  // --------------------------------------------------
  // Play word audio
  // --------------------------------------------------
  const playWordAudio = (word, qIndex, optIndex) => {
    const key = `${qIndex}-${optIndex}`;

    setActiveWord(key);

    // Stop all currently playing audios
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[key];

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  // --------------------------------------------------
  // Select answer
  // --------------------------------------------------
const handleSelect = (qIndex, optionIndex) => {
  if (locked) return;

  // إذا تم فحص الإجابة وكانت صحيحة، لا تسمح بتغييرها
  if (
    showResult &&
    answers[qIndex] === items[qIndex].correctIndex
  ) {
    return;
  }

  const copy = [...answers];
  copy[qIndex] = optionIndex;

  setAnswers(copy);
  setShowResult(false);
};

  // --------------------------------------------------
  // Click / Keyboard interaction
  // --------------------------------------------------
const handleWordInteraction = (qIndex, optIndex, word) => {
  if (locked) return;

  // إذا كانت الإجابة الحالية صحيحة بعد Check Answer
  // لا تسمح بتغييرها
  if (
    showResult &&
    answers[qIndex] === items[qIndex].correctIndex
  ) {
    return;
  }

  handleSelect(qIndex, optIndex);
  playWordAudio(word, qIndex, optIndex);
};
  // --------------------------------------------------
  // Keyboard support
  // --------------------------------------------------
const handleWordKeyDown = (event, qIndex, optIndex, word) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();

    if (locked) return;

    if (
      showResult &&
      answers[qIndex] === items[qIndex].correctIndex
    ) {
      return;
    }

    handleWordInteraction(qIndex, optIndex, word);
  }
};

  // --------------------------------------------------
  // Check answers
  // --------------------------------------------------
  const checkAnswers = () => {
    if (locked || showResult) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Oops!", "Please circle all words first.");
      return;
    }

    const correctCount = answers.filter(
      (ans, i) => ans === items[i].correctIndex,
    ).length;

    const total = items.length;

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
      ValidationAlert.success(msg);
    } else if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }

    setShowResult(true);
  };

  // --------------------------------------------------
  // Show answers
  // --------------------------------------------------
  const showAnswers = () => {
    setAnswers(items.map((item) => item.correctIndex));
    setShowResult(true);
    setLocked(true);
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  const reset = () => {
    setAnswers(Array(items.length).fill(null));
    setShowResult(false);
    setLocked(false);
    setActiveWord(null);

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div className="div-forall">
            <ExerciseHeader
          sectionLetter="C"
          title="Look, read, and circle."
          subTitle="Read the clue and check the picture, then tap the one answer that matches"
          isReview="true"
        />

        <div className="CB-review2-p1-q3-container">
          {items.map((q, i) => (
            <div key={i} className="CB-review1-p1-q1-question">
              <div className="CB-review1-p1-q1-left">
                <span className="CB-review1-p1-q1-index">{i + 1}</span>

                <img
                  src={q.img}
                  alt={q.alt}
                  className="CB-review2-p1-q3-image"
                />
              </div>

              <div className="CB-review1-p1-q1-options">
                {q.options.map((word, optIndex) => {
                  const isSelected = answers[i] === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  const wordKey = `${i}-${optIndex}`;
                  const isActive = activeWord === wordKey;

                  return (
                    <div
                      key={optIndex}
                      className="CB-review1-p1-q1-option-wrapper"
                    >
                      {/* Hidden audio element */}
                      <audio
                        ref={(el) => {
                          audioRefs.current[wordKey] = el;
                        }}
                        src={word === "this" ? thisAudio : thatAudio}
                        preload="auto"
                      />

                      <p
                        className={`
                          CB-review1-p1-q1-option
                          ${isSelected ? "is-selected" : ""}
                          ${
                            showResult && isSelected && !isCorrect
                              ? "is-wrong"
                              : ""
                          }
                          ${showResult && isCorrect ? "is-correct" : ""}
                          ${isActive ? "is-audio-active" : ""}
                        `}
                        tabIndex={ 0}
                        role="button"
                        style={{fontSize:"20px"}}
                        aria-label={`Choose ${word}`}
                        onClick={() => handleWordInteraction(i, optIndex, word)}
                        onKeyDown={(event) =>
                          handleWordKeyDown(event, i, optIndex, word)
                        }
                        onFocus={() => setActiveWord(wordKey)}
                        onBlur={() => setActiveWord(null)}
                      >
                        {/* Speaker */}
                        {isActive && (
                          <span className="word-speaker" aria-hidden="true">
                            <FaVolumeUp />
                          </span>
                        )}

                        {word}

                        {showResult && isSelected && !isCorrect && !locked && (
                          <span className="CB-review1-p1-q1-wrong-x">✕</span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
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

export default Review2_Page1_Q3;

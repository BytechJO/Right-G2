import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Unit9_Page5_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD61.Pg86_Instruction1_Adult Lady.mp3";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const questions = [
  {
    id: 1,
    images: [img1, img2],
    correctImage: 1,
    correctWord: "sad",
  },
  {
    id: 2,
    images: [img3, img4],
    correctImage: 0,
    correctWord: "cap",
  },
  {
    id: 3,
    images: [img5, img6],
    correctImage: 1,
    correctWord: "cat",
  },
];

const wordBank = ["sad", "cap", "cat"];

const Unit9_Page5_Q1 = () => {
  const [selected, setSelected] = useState({});
  const [droppedWords, setDroppedWords] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const stopAtSecond = 14.2; // عدلها حسب طول الأوديو عندك

  const captions = [
    {
      start: 0,
      end: 7.5,
      text: "Which picture has a short a? Listen, circle, and write.",
    },
    { start: 7.6, end: 9.5, text: "1. sad" },
    { start: 9.6, end: 11.5, text: "2. cap" },
    { start: 11.6, end: 14.2, text: "3. cat" },
  ];

  const handleSelect = (qId, index) => {
    if (locked) return;
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    setDroppedWords((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((slotId) => {
        if (updated[slotId] === word) {
          delete updated[slotId];
        }
      });

      if (destination.droppableId === "word-bank") {
        return updated;
      }

      updated[destination.droppableId] = word;
      return updated;
    });

    setShowResult(false);
  };

  const removeWordFromSlot = (slotId) => {
    if (locked) return;

    setDroppedWords((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });

    setShowResult(false);
  };

  const availableWords = wordBank;

  const checkAnswers = () => {
    if (locked) return;

    const notComplete = questions.some(
      (q) => selected[q.id] === undefined || !droppedWords[`slot-${q.id}`],
    );

    if (notComplete) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    let totalScore = 0;
    const totalPossible = questions.length * 2; // 6

    questions.forEach((q) => {
      const imageCorrect = selected[q.id] === q.correctImage;
      const wordCorrect = droppedWords[`slot-${q.id}`] === q.correctWord;

      if (imageCorrect) totalScore += 1;
      if (wordCorrect) totalScore += 1;
    });

    const color =
      totalScore === totalPossible
        ? "green"
        : totalScore === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${totalScore} / ${totalPossible}
      </span>
    </div>
  `;

    if (totalScore === totalPossible) {
      ValidationAlert.success(scoreMessage);
    } else if (totalScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    const correctSelected = {};
    const correctWords = {};

    questions.forEach((q) => {
      correctSelected[q.id] = q.correctImage;
      correctWords[`slot-${q.id}`] = q.correctWord;
    });

    setSelected(correctSelected);
    setDroppedWords(correctWords);
    setShowResult(true);
    setLocked(true);
  };

  const resetAll = () => {
    setSelected({});
    setDroppedWords({});
    setShowResult(false);
    setLocked(false);
  };

  const isWrongWord = (q) => {
    if (!showResult) return false;

    const word = droppedWords[`slot-${q.id}`];
    if (!word) return false;

    return word !== q.correctWord;
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall gap-2">
          <h5 className="header-title-page8">
            <span className="ex-A" style={{ marginRight: "20px" }}>
              A
            </span>
            <span style={{ marginRight: "20px", color: "#2e3192" }}>1</span>
            Which picture has a<span style={{ color: "#2e3192" }}>short a</span>
            ? Listen, circle, and write.
          </h5>
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />

          {/* WORD BANK */}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="border-2 border-dashed border-gray-400 rounded-lg p-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  minHeight: "52px",
                }}
              >
                {availableWords.map((word, index) => {
                  const isUsed = Object.values(droppedWords).includes(word);
                  return (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={index}
                      isDragDisabled={locked || isUsed}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...(!isUsed && provided.dragHandleProps)}
                          style={{
                            padding: "8px 18px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "20px",
                            userSelect: "none",

                            background: isUsed ? "#e5e7eb" : "#dbeafe",
                            color: isUsed ? "#9ca3af" : "#1d4ed8",
                            cursor: isUsed || locked ? "not-allowed" : "grab",

                            ...provided.draggableProps.style,
                          }}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="flex flex-col items-center gap-6">
            <div
              className="flex justify-center flex-wrap mb-20 gap-5"
              
            >
              {questions.map((q) => {
                const slotId = `slot-${q.id}`;
                const droppedWord = droppedWords[slotId];

                return (
                  <div key={q.id} className="flex flex-col items-center">
                    <div className="flex gap-2 items-center">
                      {q.images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect(q.id, index)}
                          style={{
                            position: "relative",
                            width: "10vw",
                            height: "10vw",
                            cursor: locked ? "default" : "pointer",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />

                          {selected[q.id] === index && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: showResult
                                  ? index === q.correctImage
                                    ? "4px solid green"
                                    : "4px solid red"
                                  : "4px solid red",
                                borderRadius: "50%",
                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Droppable droppableId={slotId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            marginTop: "12px",
                            minHeight: "38px",
                            minWidth: "95px",
                            borderBottom: "2px solid #222",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative", // 🔥 مهم
                          }}
                        >
                          {droppedWord && (
                            <Draggable
                              draggableId={`word-${droppedWord}`}
                              index={0}
                              isDragDisabled={locked}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => removeWordFromSlot(slotId)}
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: showResult
                                      ? droppedWord === q.correctWord
                                        ? "green"
                                        : "red"
                                      : "#c62828",
                                    cursor: locked ? "default" : "pointer",
                                    userSelect: "none",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {droppedWord}
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                          {/* ❌ WRONG WORD */}
                          {isWrongWord(q) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                width: "20px",
                                height: "20px",
                                background: "#ef4444",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                border: "2px solid white",
                              }}
                            >
                              ✕
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={resetAll}>
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit9_Page5_Q1;

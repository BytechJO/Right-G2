/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/Page 62/Ex A2-4.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit7_Page5_Q2 = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const [filledLetters, setFilledLetters] = useState({});
  const [activeBlank, setActiveBlank] = useState(null);

  const imageRefs = useRef([]);
  const sentenceRefs = useRef([]);
  const containerRef = useRef(null);

  const images = [
    { id: 0, img: img1 },
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
  ];

  // ✨ sentences مع حروف
  const sentences = [
    {
      id: 0,
      word: ["b", "", "", "t"],
      letters: ["o", "a", "i"],
      answer: ["b", "o", "a", "t"],
    },
    {
      id: 1,
      word: ["d", "", "m", ""],
      letters: ["o", "u", "e"],
      answer: ["d", "o", "m", "e"],
    },
    {
      id: 2,
      word: ["f", "", "", "m"],
      letters: ["a", "r", "o"],
      answer: ["f", "o", "a", "m"],
    },
    {
      id: 3,
      word: ["w", "i", "n", "d", "", ""],
      letters: ["o", "w", "a"],
      answer: ["w", "i", "n", "d", "o", "w"],
    },
  ];

  const correct = {
    0: 3,
    1: 2,
    2: 0,
    3: 1,
  };
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const letter = result.draggableId.split("-")[1];

    const [_, sentId, index] = result.destination.droppableId.split("-");

    setFilledLetters((prev) => {
      const updated = { ...prev };

      if (!updated[sentId]) updated[sentId] = [...sentences[sentId].word];

      // ❌ لا تسمح بالاستبدال
      if (updated[sentId][index]) return prev;

      updated[sentId][index] = letter;

      return updated;
    });
  };

  const removeLetter = (sentId, idx) => {
    if (locked) return;

    setFilledLetters((prev) => {
      const updated = { ...prev };

      if (!updated[sentId]) return prev;

      // إذا كان هذا المكان حرف ثابت من الكلمة الأصلية، لا تعملي شيء
      if (sentences[sentId].word[idx] !== "") return prev;

      updated[sentId][idx] = "";

      return updated;
    });
  };
  const selectImage = (id) => {
    if (locked || showResult) return;
    setSelectedImg(id);
  };

  const selectSentence = (id) => {
    if (locked || showResult) return;
    if (selectedImg === null) return;

    setMatches((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((imgKey) => {
        if (updated[imgKey] === id) delete updated[imgKey];
      });

      updated[selectedImg] = id;
      return updated;
    });

    setSelectedImg(null);
  };

  const checkAnswers = () => {
    if (locked || showResult) return;

    if (Object.keys(matches).length !== images.length) {
      ValidationAlert.info("Please match all.");
      return;
    }

    let correctCount = 0;

    images.forEach((img) => {
      const sentId = matches[img.id];
      const wordFilled = filledLetters[sentId];

      if (!wordFilled) return;

      const isMatchCorrect = correct[img.id] === sentId;
      const isWordCorrect =
        JSON.stringify(wordFilled) === JSON.stringify(sentences[sentId].answer);

      if (isMatchCorrect && isWordCorrect) correctCount++;
    });

    const total = images.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    setMatches(correct);

    const filled = {};
    sentences.forEach((s) => {
      filled[s.id] = s.answer;
    });

    setFilledLetters(filled);

    setLocked(true);
    setShowResult(true);
  };

  const reset = () => {
    setSelectedImg(null);
    setMatches({});
    setFilledLetters({});
    setActiveBlank(null);
    setShowResult(false);
    setLocked(false);
  };
  const isWordWrong = (sentId) => {
    if (!showResult) return false;

    const wordFilled = filledLetters[sentId];
    if (!wordFilled) return true;

    return (
      JSON.stringify(wordFilled) !== JSON.stringify(sentences[sentId].answer)
    );
  };

  const isImageWrong = (imgId) => {
    if (!showResult) return false;

    const sentId = matches[imgId];

    if (sentId === undefined) return true;

    const isMatchCorrect = correct[imgId] === sentId;

    const wordFilled = filledLetters[sentId];
    const isWordCorrect =
      wordFilled &&
      JSON.stringify(wordFilled) === JSON.stringify(sentences[sentId].answer);

    return !(isMatchCorrect && isWordCorrect);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* كل الكود تبعك */}
      <div className="main-container-component relative" ref={containerRef}>
        <div className="div-forall">
          <h5 className="header-title-page8">
            <span style={{ color: "#2e3192" }}>2</span>
            Match and write.
          </h5>

          <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center gap-25">
            {/* الصور */}
            <div className="grid grid-cols-4 w-full text-center">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  ref={(el) => (imageRefs.current[index] = el)}
                  onClick={() => selectImage(img.id)}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="relative">
                    {isImageWrong(img.id) && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                        ✕
                      </span>
                    )}

                    <div
                      className={`border-2 rounded-lg w-[140px] h-[110px] flex items-center justify-center transition-all duration-200 ${
                        selectedImg === img.id
                          ? "bg-red-100 border-red-600 scale-105 shadow-lg"
                          : "border-red-300"
                      }`}
                    >
                      <img src={img.img} className="max-h-[120px]" />
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              ))}
            </div>

            {/* الكلمات */}
            <div className="grid grid-cols-4 w-full text-center">
              {sentences.map((sent, index) => (
                <div
                  key={sent.id}
                  ref={(el) => (sentenceRefs.current[index] = el)}
                  onClick={() => selectSentence(sent.id)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full z-10"></div>
                    <div className="relative">
                      {isWordWrong(sent.id) && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                          ✕
                        </span>
                      )}

                      <div className="bg-[#f9e5dd] px-4 py-2 rounded-xl text-lg">
                        {/* الكلمة */}
                        <div className="flex gap-1 justify-center">
                          {sent.word.map((char, idx) => {
                            const filledChar = filledLetters[sent.id]?.[idx];
                            const isBlank = char === "";

                            return (
                              <Droppable
                                key={idx}
                                droppableId={`blank-${sent.id}-${idx}`}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="w-6 h-8 border-b-2 text-center"
                                  >
                                    {filledChar ? (
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeLetter(sent.id, idx);
                                        }}
                                        className="cursor-pointer hover:text-red-500"
                                      >
                                        {filledChar}
                                      </span>
                                    ) : char ? (
                                      char
                                    ) : (
                                      "_"
                                    )}
                                    {provided.placeholder}
                                  </span>
                                )}
                              </Droppable>
                            );
                          })}
                        </div>

                        {/* الحروف */}
                        <Droppable
                          droppableId={`letters-${sent.id}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex gap-2 mt-2 justify-center"
                            >
                              {sent.letters.map((l, i) => (
                                <Draggable
                                  key={`${sent.id}-${l}-${i}`}
                                  draggableId={`${sent.id}-${l}-${i}`}
                                  index={i}
                                  isDragDisabled={locked}
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="px-2 py-1 border rounded cursor-grab bg-yellow-200"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {l}
                                    </span>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* الخطوط */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Object.entries(matches).map(([imgId, sentId], i) => {
            const imgEl = imageRefs.current[imgId];
            const sentEl = sentenceRefs.current[sentId];

            if (!imgEl || !sentEl || !containerRef.current) return null;

            const imgRect = imgEl.getBoundingClientRect();
            const sentRect = sentEl.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const x1 = imgRect.left + imgRect.width / 2 - containerRect.left;
            const y1 = imgRect.bottom - containerRect.top;

            const x2 = sentRect.left + sentRect.width / 2 - containerRect.left;
            const y2 = sentRect.top - containerRect.top;

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#e53935"
                strokeWidth="3"
                fill="none"
              />
            );
          })}
        </svg>

        {/* الأزرار */}
        <div className="action-buttons-container">
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
    </DragDropContext>
  );
};

export default Unit7_Page5_Q2;

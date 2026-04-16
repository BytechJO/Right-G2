/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/P 73_1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 4.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review8_Page2_Q2 = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
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
      word: ["t", "", "b", ""],
      letters: ["a", "u", "e"],
      answer: ["t", "u", "b", "e"],
    },
    {
      id: 1,
      word: ["t", "", "n", ""],
      letters: ["a", "u", "e"],
      answer: ["t", "u", "n", "e"],
    },
    {
      id: 2,
      word: ["s", "", ""],
      letters: ["u", "n", "e"],
      answer: ["s", "u", "e"],
    },
    {
      id: 3,
      word: ["j", "", "n", ""],
      letters: ["i", "e", "u"],
      answer: ["j", "u", "n", "e"],
    },
  ];

  const correct = {
    0: 2,
    1: 3,
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

      updated[sentId][index] = letter;

      return updated;
    });
  };
  const removeLetter = (sentId, index) => {
    if (locked) return;

    setFilledLetters((prev) => {
      const updated = { ...prev };

      if (!updated[sentId]) return prev;

      updated[sentId][index] = "";

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
    let color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount}
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

  // ❌ هل التوصيل غلط؟
  const isWrongMatch = (imgId) => {
    if (!showResult) return false;
    return correct[imgId] !== matches[imgId];
  };

  // ❌ هل الكلمة غلط؟
  const isWrongWord = (sentId) => {
    if (!showResult) return false;

    const filled = filledLetters[sentId];
    if (!filled) return true;

    return JSON.stringify(filled) !== JSON.stringify(sentences[sentId].answer);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* كل الكود تبعك */}
      <div ref={containerRef} className="main-container-component relative">
        <div className="div-forall gap-10">
          <h5 className="header-title-page8">
            <span style={{ marginRight: "15px" }}>F</span>
            Match and write.
          </h5>

          <div className="flex flex-col items-center gap-25">
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
                    <div
                      className={`rounded-lg flex items-center justify-center`}
                    >
                      <img
                        src={img.img}
                        onClick={() => {
                          if (locked) return;
                          setSelectedImage(index);
                        }}
                        className={`${
                          selectedImg === img.id
                            ? "border-2 border-red-600 scale-110"
                            : ""
                        }`}
                        style={{
                          height: "130px",
                          width: "auto",
                          cursor: "pointer",
                          borderRadius: "10px",
                          transition: "0.2s",

                          transform:
                            selectedImage === index
                              ? "scale(1.05)"
                              : "scale(1)",
                         
                        }}
                      />
                    </div>

                    {/* ❌ WRONG IMAGE */}
                    {isWrongMatch(img.id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                  <div
                  onClick={() => {
                          if (locked) return;
                          setSelectedImage(index);
                        }}
                    className={`w-3 h-3 bg-red-500 rounded-full ${
                      selectedImg === img.id ? "bg-red-600 scale-125" : ""
                    }`}
                  ></div>
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
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full z-20"></div>

                    <div className="bg-[#e9d7c9] px-4 py-2 rounded-xl text-lg relative">
                      {/* ❌ WRONG WORD (مرة وحدة فقط) */}
                      {isWrongWord(sent.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white z-20">
                          ✕
                        </div>
                      )}
                      {/* الكلمة */}
                      <div className="flex gap-1 justify-center">
                        {sent.word.map((char, idx) => {
                          const isBlank = char === "";

                          if (!isBlank) {
                            // 🔒 حرف ثابت (ما ينلمس)
                            return (
                              <span
                                key={idx}
                                className="w-6 h-8 text-center font-bold"
                              >
                                {char}
                              </span>
                            );
                          }

                          // ✨ فقط الفراغ Droppable
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
                                  {filledLetters[sent.id]?.[idx] ? (
                                    <span
                                      onClick={() => removeLetter(sent.id, idx)}
                                      className="cursor-pointer hover:text-red-500"
                                    >
                                      {filledLetters[sent.id][idx]}
                                    </span>
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

export default Review8_Page2_Q2;

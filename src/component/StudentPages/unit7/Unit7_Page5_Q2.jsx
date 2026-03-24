/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
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
      letters: ["r", "u", "a"],
      answer: ["d", "r", "u", "m"],
    },
    {
      id: 2,
      word: ["f", "", "", "m"],
      letters: ["a", "r", "o"],
      answer: ["f", "a", "r", "m"],
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

      updated[sentId][index] = letter;

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

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* كل الكود تبعك */}
      <div
        ref={containerRef}
        className="flex flex-col items-center p-10 relative"
      >
        <div className="div-forall" style={{ width: "60%" }}>
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
                  <div
                    className={`border-2 border-red-500 rounded-lg w-[140px] h-[110px] flex items-center justify-center ${
                      selectedImg === img.id ? "bg-red-100" : ""
                    }`}
                  >
                    <img src={img.img} className="max-h-[60px]" />
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
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full"></div>

                    <div className="bg-[#e9d7c9] px-4 py-2 rounded-xl text-lg">
                      {/* الكلمة */}
                      <div className="flex gap-1 justify-center">
                        {sent.word.map((char, idx) => (
                          <Droppable droppableId={`blank-${sent.id}-${idx}`}>
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="w-6 h-8 border-b-2 text-center"
                              >
                                {filledLetters[sent.id]?.[idx] || char || "_"}
                                {provided.placeholder}
                              </span>
                            )}
                          </Droppable>
                        ))}
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

export default Unit7_Page5_Q2;

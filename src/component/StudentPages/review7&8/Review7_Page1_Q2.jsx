import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 4.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 5.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 6.svg";

const Review7_Page1_Q2 = () => {
  const questions = [
    {
      id: 1,
      scramble: "time? what it is",

      questionWords: [
        { id: "q1-2", text: "time" },
        { id: "q1-1", text: "What" },
        { id: "q1-4", text: "it?" },
        { id: "q1-3", text: "is" },
      ],

      answerWords: [
        { id: "a1-1", text: "It's" },
        { id: "a1-2", text: "half" },
        { id: "a1-3", text: "past" },
        { id: "a1-4", text: "three." },
      ],

      correctQuestion: "What time is it?",
      correctAnswer: "It's half past three.",
      image: img1,
    },

    {
      id: 2,
      scramble: "today is day? what it",

      questionWords: [
        { id: "q2-5", text: "today?" },
        { id: "q2-3", text: "is" },
        { id: "q2-2", text: "day" },
        { id: "q2-1", text: "What" },
        { id: "q2-4", text: "it" },
      ],

      answerWords: [
        { id: "a2-1", text: "It's" },
        { id: "a2-2", text: "Friday." },
      ],

      correctQuestion: "What day is it today?",
      correctAnswer: "It's Friday.",
      image: img2,
    },

    {
      id: 3,
      scramble: "is? month it what",

      questionWords: [
        { id: "q3-3", text: "is" },
        { id: "q3-2", text: "month" },
        { id: "q3-4", text: "it?" },
        { id: "q3-1", text: "What" },
      ],

      answerWords: [
        { id: "a3-1", text: "It's" },
        { id: "a3-2", text: "January." },
      ],

      correctQuestion: "What month is it?",
      correctAnswer: "It's January.",
      image: img3,
    },

    {
      id: 4,
      scramble: "? day is today it what",

      questionWords: [
        { id: "q4-2", text: "day" },
        { id: "q4-3", text: "is" },
        { id: "q4-5", text: "today?" },
        { id: "q4-4", text: "it" },
        { id: "q4-1", text: "What" },
      ],

      answerWords: [
        { id: "a4-1", text: "It's" },
        { id: "a4-2", text: "Monday." },
      ],

      correctQuestion: "What day is it today?",
      correctAnswer: "It's Monday.",
      image: img4,
    },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  const [hovered, setHovered] = useState(null);
  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const wordId = result.draggableId;
    const slot = result.destination.droppableId;

    // ❌ إذا الكلمة مستخدمة قبل → امنع
    if (usedWords.includes(wordId)) return;

    let wordText = "";

    questions.forEach((q) => {
      q.questionWords.forEach((w) => {
        if (w.id === wordId) wordText = w.text;
      });

      q.answerWords.forEach((w) => {
        if (w.id === wordId) wordText = w.text;
      });
    });

    setAnswers((prev) => ({
      ...prev,
      [slot]: prev[slot] ? prev[slot] + " " + wordText : wordText,
    }));

    // ✅ سجّل الكلمة كمستخدمة
    setUsedWords((prev) => [...prev, wordId]);
  };

  const reset = () => {
    setAnswers({});
    setUsedWords([]); // 👈 مهم
    setLocked(false);
  };
  const showAnswers = () => {
    const filled = {};

    questions.forEach((q, i) => {
      filled[`q-${i}`] = q.correctQuestion;
      filled[`a-${i}`] = q.correctAnswer;
    });

    setAnswers(filled);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = questions.some(
      (_, i) => !answers[`q-${i}`] || !answers[`a-${i}`],
    );

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;
    const total = questions.length * 2;

    questions.forEach((q, i) => {
      if (answers[`q-${i}`] === q.correctQuestion) score++;
      if (answers[`a-${i}`] === q.correctAnswer) score++;
    });

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
  <div style="font-size:20px;text-align:center;">
    <span style="color:${color};font-weight:bold">
      Score: ${score} / ${total}
    </span>
  </div>
  `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h5 className="header-title-page8 mb-6">
            <span style={{ marginRight: "20px" }}>B</span>
            Look, unscramble, and answer.
          </h5>

          {questions.map((q, i) => {
            const isWrongQ = locked && answers[`q-${i}`] !== q.correctQuestion;

            const isWrongA = locked && answers[`a-${i}`] !== q.correctAnswer;
            return (
              <div key={i} className="flex gap-10 mb-4">
                <div className="flex-1">
                  {/* scrambled */}

                  <div
                    className="flex w-full"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div className="mb-3 text-lg">
                      <span className="font-bold mr-2">{q.id}</span>
                      {q.scramble}
                    </div>

                    {/* question words */}

                    <Droppable
                      droppableId={`bank-q-${i}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex gap-2 mb-2 flex-wrap border-2 border-dashed border-gray-500 p-2 rounded-lg"
                        >
                          {q.questionWords.map((w, index) => (
                            <Draggable
                              key={w.id}
                              draggableId={w.id}
                              index={index}
                              isDragDisabled={
                                locked || usedWords.includes(w.id)
                              }
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`px-3 py-1 rounded ${usedWords.includes(w.id) ? "bg-yellow-100 text-gray-300 cursor-not-allowed" : "bg-yellow-200  cursor-grab"}`}
                                >
                                  {w.text}
                                </span>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {/* question line */}

                  <div className="relative">
                    <Droppable droppableId={`q-${i}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="border-b-2 border-black h-10 mb-4 text-blue-600"
                        >
                          {(answers[`q-${i}`] || "")
                            .split(" ")
                            .map((word, idx) => {
                              if (!word) return null;

                              const key = `q-${i}-${idx}`;

                              return (
                                <span
                                  key={key}
                                  onMouseEnter={() => setHovered(key)}
                                  onMouseLeave={() => setHovered(null)}
                                  onClick={() => {
                                    if (locked) return;

                                    const words = answers[`q-${i}`].split(" ");

                                    const removedWord = q.questionWords.find(
                                      (w) => w.text === word,
                                    )?.id;

                                    setAnswers((prev) => ({
                                      ...prev,
                                      [`q-${i}`]: words
                                        .filter((_, j) => j !== idx)
                                        .join(" "),
                                    }));

                                    // رجّع الكلمة للـ word bank
                                    setUsedWords((prev) =>
                                      prev.filter((id) => id !== removedWord),
                                    );
                                  }}
                                  style={{
                                    marginRight: "6px",
                                    cursor: "pointer",
                                    color: hovered === key ? "red" : "black",
                                    padding: "2px 6px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {word}
                                </span>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {isWrongQ && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-sm font-bold">✕</span>
                      </div>
                    )}
                  </div>
                  {/* answer words */}

                  <Droppable droppableId={`bank-a-${i}`} direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-2 mb-2 flex-wrap border-2 border-dashed border-gray-500 p-2 rounded-lg"
                      >
                        {q.answerWords.map((w, index) => (
                          <Draggable
                            key={w.id}
                            draggableId={w.id}
                            index={index}
                            isDragDisabled={locked || usedWords.includes(w.id)}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`px-3 py-1 rounded ${usedWords.includes(w.id) ? "bg-blue-50 text-gray-300 cursor-not-allowed" : "bg-blue-200  cursor-grab"}`}
                              >
                                {w.text}
                              </span>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* answer line */}

                  <div className="relative">
                    <Droppable droppableId={`a-${i}`}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="border-b-2 border-black h-10 text-blue-600"
                        >
                          {(answers[`a-${i}`] || "")
                            .split(" ")
                            .map((word, idx) => {
                              if (!word) return null;

                              const key = `q-${i}-${idx}`;

                              return (
                                <span
                                  key={key}
                                  onMouseEnter={() => setHovered(key)}
                                  onMouseLeave={() => setHovered(null)}
                                  onClick={() => {
                                    if (locked) return;

                                    const words = answers[`q-${i}`].split(" ");

                                    const removedWord = q.questionWords.find(
                                      (w) => w.text === word,
                                    )?.id;

                                    setAnswers((prev) => ({
                                      ...prev,
                                      [`q-${i}`]: words
                                        .filter((_, j) => j !== idx)
                                        .join(" "),
                                    }));

                                    // رجّع الكلمة للـ word bank
                                    setUsedWords((prev) =>
                                      prev.filter((id) => id !== removedWord),
                                    );
                                  }}
                                  style={{
                                    marginRight: "6px",
                                    cursor: "pointer",
                                    color: hovered === key ? "red" : "black",
                                    padding: "2px 6px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {word}
                                </span>
                              );
                            })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {isWrongA && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-white text-sm font-bold">✕</span>
                      </div>
                    )}
                  </div>
                </div>

                <img
                  src={q.image}
                  className="object-contain"
                  style={{ height: "auto", width: "180px" }}
                />
              </div>
            );
          })}

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
      </div>
    </DragDropContext>
  );
};

export default Review7_Page1_Q2;

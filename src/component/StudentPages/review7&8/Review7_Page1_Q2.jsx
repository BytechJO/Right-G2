import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

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

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const wordId = result.draggableId;
    const slot = result.destination.droppableId;

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
  };

  const reset = () => {
    setAnswers({});
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
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h5 className="header-title-page8 mb-6">
            <span style={{ marginRight: "20px" }}>B</span>
            Look, unscramble, and answer.
          </h5>

          {questions.map((q, i) => (
            <div key={i} className="flex gap-10 mb-12">
              <div className="flex-1">
                {/* scrambled */}

                <div className="mb-3 text-lg">
                  <span className="font-bold mr-2">{q.id}</span>
                  {q.scramble}
                </div>

                {/* question words */}

                <Droppable droppableId={`bank-q-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-2 mb-2 flex-wrap"
                    >
                      {q.questionWords.map((w, index) => (
                        <Draggable
                          key={w.id}
                          draggableId={w.id}
                          index={index}
                          isDragDisabled={locked}
                        >
                          {(provided) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-yellow-200 px-3 py-1 rounded cursor-grab"
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

                {/* question line */}

                <Droppable droppableId={`q-${i}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-b-2 border-black min-h-10 mb-4 text-red-600"
                    >
                      {answers[`q-${i}`]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* answer words */}

                <Droppable droppableId={`bank-a-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-2 mb-2 flex-wrap"
                    >
                      {q.answerWords.map((w, index) => (
                        <Draggable
                          key={w.id}
                          draggableId={w.id}
                          index={index}
                          isDragDisabled={locked}
                        >
                          {(provided) => (
                            <span
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-blue-200 px-3 py-1 rounded cursor-grab"
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

                <Droppable droppableId={`a-${i}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="border-b-2 border-black min-h-10 text-red-600"
                    >
                      {answers[`a-${i}`]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <img
                src={q.image}
                className="w-[180px]! h-[150px]! object-contain"
              />
            </div>
          ))}

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

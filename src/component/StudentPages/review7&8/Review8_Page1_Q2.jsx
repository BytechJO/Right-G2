import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

const items = [
  {
    sentence: "He has four pairs of",
    scrambled: ["neerg", "strohs"],
    correct: ["green", "shorts"],
  },
  {
    sentence: "She has five pairs of",
    scrambled: ["lube", "skcos"],
    correct: ["blue", "socks"],
  },
  {
    sentence: "They have nine",
    scrambled: ["kcalb", "stekcaj"],
    correct: ["black", "jackets"],
  },
  {
    sentence: "You have six",
    scrambled: ["etihw", "seit"],
    correct: ["white", "ties"],
  },
  {
    sentence: "I have three",
    scrambled: ["knip", "sesserd"],
    correct: ["pink", "dresses"],
  },
];

export default function Review8_Page1_Q3() {
  // ✨ كل كلمة string بدل array
  const [answers, setAnswers] = useState(items.map(() => ["", ""]));

  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const letter = draggableId.split("-")[1];
    const [qIndex, wordIndex] = destination.droppableId.split("-").slice(1);

    const updated = [...answers];

    // ✨ منع زيادة الحروف عن الحد
    if (
      updated[qIndex][wordIndex].length >=
      items[qIndex].correct[wordIndex].length
    )
      return;

    // ✨ نضيف الحرف تدريجياً
    updated[qIndex][wordIndex] += letter;

    setAnswers(updated);
    setShowResult(false);
  };

  const resetAll = () => {
    setAnswers(items.map(() => ["", ""]));
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    setAnswers(items.map((item) => item.correct));
    setLocked(true);
    setShowResult(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = answers.some((row) => row.some((word) => word === ""));

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    answers.forEach((row, i) => {
      if (row.join(" ") === items[i].correct.join(" ")) {
        score++;
      }
    });

    const total = items.length;

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowResult(true);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="div-forall" style={{ width: "60%" }}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>B</span>
            Unscramble the words and write the sentences.
          </h5>

          {items.map((item, i) => (
            <div key={i} className="mb-6 mt-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* number */}
                <span className="font-bold text-lg w-5">{i + 1}</span>

                {/* sentence */}
                <span className="text-lg">{item.sentence}</span>

                {/* scrambled letters */}
                <Droppable droppableId={`bank-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-3"
                    >
                      {item.scrambled.map((word, wordIndex) => {
                        const letters = word.split("");

                        return (
                          <div key={wordIndex} className="flex gap-1">
                            {letters.map((letter, letterIndex) => {
                              const id = `${letter}-${i}-${wordIndex}-${letterIndex}`;

                              return (
                                <Draggable
                                  key={id}
                                  draggableId={`letter-${id}`}
                                  index={wordIndex * 10 + letterIndex}
                                  isDragDisabled={locked}
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="w-8 h-8 flex items-center justify-center bg-yellow-200 rounded border cursor-grab"
                                    >
                                      {letter}
                                    </span>
                                  )}
                                </Draggable>
                              );
                            })}
                          </div>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* ✨ answer words (live typing) */}
                <div className="flex gap-4">
                  {answers[i].map((word, wordIndex) => {
                    const dropId = `slot-${i}-${wordIndex}`;

                    return (
                      <Droppable droppableId={dropId} key={dropId}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-w-[120px] border-b-2 border-black h-8 flex items-center px-2
                              ${
                                word === items[i].correct[wordIndex]
                                  ? "text-green-600 font-bold"
                                  : ""
                              }`}
                          >
                            {word}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              </div>

              {/* final sentence */}
              {showResult && (
                <div className="text-red-600 font-semibold mt-2 ml-8">
                  {item.sentence} {answers[i].join(" ")}.
                </div>
              )}
            </div>
          ))}

          {/* buttons */}
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
      </div>
    </DragDropContext>
  );
}

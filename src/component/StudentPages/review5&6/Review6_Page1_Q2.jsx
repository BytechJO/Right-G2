import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q2.css";

const items = [
  { scrambled: ["og", "ot", "pseel"], correct: ["go", "to", "sleep"] },
  { scrambled: ["mkea", "hte", "deb"], correct: ["make", "the", "bed"] },
  { scrambled: ["tae", "chunl"], correct: ["eat", "lunch"] },
  { scrambled: ["teg", "pu"], correct: ["get", "up"] },
  { scrambled: ["og", "meoh"], correct: ["go", "home"] },
  { scrambled: ["tae", "stafkearb"], correct: ["eat", "breakfast"] },
];

export default function Review6_Page1_Q2() {
  const [answers, setAnswers] = useState(
    items.map((item) =>
      item.correct.map((word) => Array(word.length).fill("")),
    ),
  );
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const letter = draggableId.split("-")[1];
    const [qIndex, wordIndex, letterIndex] = destination.droppableId
      .split("-")
      .slice(1);

    const updated = [...answers];
    updated[qIndex][wordIndex][letterIndex] = letter;

    setAnswers(updated);

    setAnswers(updated);
    setShowResult(false);
  };

  const resetAll = () => {
    setAnswers(
      items.map((item) =>
        item.correct.map((word) => Array(word.length).fill("")),
      ),
    );

    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    setAnswers(items.map((item) => item.correct.map((word) => word.split(""))));

    setLocked(true);
  };
  const checkAnswers = () => {
    if (locked) return;

    const empty = answers.some((row) =>
      row.some((word) => word.some((l) => l === "")),
    );

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    answers.forEach((row, i) => {
      const built = row.map((word) => word.join("")).join(" ");

      if (built === items[i].correct.join(" ")) {
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
        <div className="w-[60%]">
          <h5 className="header-title-page8 mb-5">
            <span className=" mr-4">A</span>
            Unscramble and write.{" "}
          </h5>

          {items.map((item, i) => {
            return (
              <div
                key={i}
                className="flex items-center gap-[15px] my-5 text-[20px]"
              >
                <span className="font-bold">{i + 1}</span>

                {/* scrambled letters */}
                <Droppable droppableId={`bank-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-1.5"
                    >
                      {item.scrambled.map((chunk, chunkIndex) => {
                        const letters = chunk.split("");

                        return (
                          <div
                            key={chunkIndex}
                            className="flex gap-1 mr-3.5"
                          >
                            {letters.map((letter, letterIndex) => {
                              const id = `${letter}-${i}-${chunkIndex}-${letterIndex}`;

                              return (
                                <Draggable
                                  key={id}
                                  draggableId={`letter-${id}`}
                                  index={chunkIndex * 10 + letterIndex}
                                  isDragDisabled={locked}
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="px-2.5 py-1.5 border-2 border-[#444] rounded-md bg-[#f3f3f3] cursor-grab font-bold"
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

                {/* answer slots */}
                <div className="flex gap-5 ml-5">
                  {answers[i].map((wordSlots, wordIndex) => {
                    return (
                      <div key={wordIndex} className="flex gap-1">
                        {wordSlots.map((letter, slotIndex) => {
                          const slotId = `slot-${i}-${wordIndex}-${slotIndex}`;

                          return (
                            <Droppable droppableId={slotId} key={slotId}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="w-7 border-b-2 border-black text-center text-[22px]"
                                >
                                  {letter}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* wrong mark */}
                {showResult &&
                  answers[i].map((w) => w.join("")).join(" ") !==
                    items[i].correct.join(" ") && (
                    <span className="text-red-500 font-bold ml-2.5">✕</span>
                  )}
              </div>
            );
          })}
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
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
}

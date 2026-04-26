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
      item.correct.map((word) => Array(word.length).fill(null)),
    ),
  );

  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // ✅ check by ID (حل مشكلة التكرار)
  const isLetterUsed = (id) => {
    return answers.some((row) =>
      row.some((word) => word.some((slot) => slot?.id === id)),
    );
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const id = draggableId.replace("letter-", "");
    const letter = id.split("-")[0];

    const [qIndex, wordIndex, letterIndex] = destination.droppableId
      .split("-")
      .slice(1);

    const updated = [...answers];

    // ❌ لا تكتب فوق slot مليان
    if (updated[qIndex][wordIndex][letterIndex] !== null) return;

    updated[qIndex][wordIndex][letterIndex] = {
      letter,
      id,
    };

    setAnswers(updated);
    setShowResult(false);
  };
  const removeLetter = (qIndex, wordIndex, slotIndex) => {
    if (locked) return;

    const updated = [...answers];

    updated[qIndex][wordIndex][slotIndex] = null;

    setAnswers(updated);
    setShowResult(false);
  };
  const resetAll = () => {
    setAnswers(
      items.map((item) =>
        item.correct.map((word) => Array(word.length).fill(null)),
      ),
    );
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    setAnswers(
      items.map((item) =>
        item.correct.map((word) =>
          word.split("").map((l, idx) => ({
            letter: l,
            id: `correct-${l}-${idx}`,
          })),
        ),
      ),
    );
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = answers.some((row) =>
      row.some((word) => word.some((l) => l === null)),
    );

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    answers.forEach((row, i) => {
      const built = row
        .map((word) => word.map((l) => l.letter).join(""))
        .join(" ");

      if (built === items[i].correct.join(" ")) {
        score++;
      }
    });

    const total = items.length;

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

    setShowResult(true);
    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h5 className="header-title-page8">
            <span className="mr-4">B</span>
            Unscramble and write.
          </h5>

          {items.map((item, i) => {
            const built = answers[i]
              .map((w) => w.map((l) => l?.letter || "").join(""))
              .join(" ");

            const isWrong = showResult && built !== item.correct.join(" ");

            return (
              <div key={i} className="flex flex-col gap-3 text-[20px]">
                <div className="flex flex-col gap-5 my-6 text-[20px]">
                  <div className="flex gap-4">
                    <span className="font-bold">{i + 1}</span>
                    <h1>{item.scrambled.join(" ")}</h1>
                  </div>
                  <div className="flex gap-6 flex-wrap">
                    {item.scrambled.map((chunk, wordIndex) => {
                      const letters = chunk.split("");

                      return (
                        <div
                          key={wordIndex}
                          className="flex items-center gap-2"
                        >
                          {/* 🔤 BANK */}
                          <Droppable
                            droppableId={`bank-${i}-${wordIndex}`}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-1"
                              >
                                {letters.map((letter, letterIndex) => {
                                  const id = `${letter}-${i}-${wordIndex}-${letterIndex}`;
                                  const used = isLetterUsed(id);

                                  return (
                                    <Draggable
                                      key={id}
                                      draggableId={`letter-${id}`}
                                      index={letterIndex}
                                      isDragDisabled={locked || used}
                                    >
                                      {(provided) => (
                                        <span
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`px-2 py-1 border-2 border-gray-500 bg-white text-[22px] h-[40px] w-[40px] flex items-center justify-center rounded font-bold transition-all
                                            ${
                                              used
                                                ? "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
                                                : "bg-[#f3f3f3] cursor-grab hover:bg-blue-100"
                                            }
                                          `}
                                        >
                                          {letter}
                                        </span>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>

                          {/* ✏️ SLOTS */}
                          <div className="flex gap-1">
                            {answers[i][wordIndex].map((slot, slotIndex) => {
                              const slotId = `slot-${i}-${wordIndex}-${slotIndex}`;

                              return (
                                <Droppable droppableId={slotId} key={slotId}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      onClick={() =>
                                        removeLetter(i, wordIndex, slotIndex)
                                      }
                                      className={`w-7 h-7 text-center text-[22px] transition-all duration-200 cursor-pointer
    ${
      snapshot.isDraggingOver
        ? "border-b-2 border-blue-500 bg-blue-100 scale-110"
        : "border-b-2 border-black"
    }
  `}
                                    >
                                      {slot?.letter}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* result input */}
                <div className="relative">
                  <input
                    type="text"
                    value={built}
                    readOnly
                    className="w-[90%] border-b-2 border-gray-600 text-[22px] outline-none bg-transparent"
                  />
                  {isWrong && (
                    <div className="absolute -top-2 left-70 ml-3 w-6 h-6 bg-red-500 rounded-full flex items-center text-sm justify-center text-white font-bold border-2 border-white shadow-lg">
                      ✕
                    </div>
                  )}
                </div>

             
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

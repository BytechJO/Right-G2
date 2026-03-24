import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

const items = [
  { scrambled: ["tae"], correct: ["eat"] },
  { scrambled: ["tesn"], correct: ["nest"] },
  { scrambled: ["neegr"], correct: ["green"] },
  { scrambled: ["leas"], correct: ["seal"] },
  { scrambled: ["geg"], correct: ["egg"] },
  { scrambled: ["nep"], correct: ["pen"] },
];

export default function Review10_Page2_Q3() {
  const [answers, setAnswers] = useState(items.map(() => []));
  const [letterBank, setLetterBank] = useState(
    items.map((item) => item.scrambled[0].split("")),
  );
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || locked) return;

    if (
      source.droppableId.startsWith("bank") &&
      destination.droppableId.startsWith("slot")
    ) {
      const sourceIndex = Number(source.droppableId.split("-")[1]);
      const destIndex = Number(destination.droppableId.split("-")[1]);

      if (sourceIndex !== destIndex) return;

      const updatedAnswers = [...answers];
      const updatedBank = [...letterBank];

      if (
        updatedAnswers[destIndex].length >= items[destIndex].correct[0].length
      ) {
        return;
      }

      const [movedLetter] = updatedBank[sourceIndex].splice(source.index, 1);
      updatedAnswers[destIndex] = [...updatedAnswers[destIndex], movedLetter];

      setAnswers(updatedAnswers);
      setLetterBank(updatedBank);
    }
  };

  const handleRemoveLetter = (questionIndex, letterIndex) => {
    if (locked) return;

    const updatedAnswers = [...answers];
    const updatedBank = [...letterBank];

    const [removedLetter] = updatedAnswers[questionIndex].splice(
      letterIndex,
      1,
    );
    updatedBank[questionIndex] = [...updatedBank[questionIndex], removedLetter];

    setAnswers(updatedAnswers);
    setLetterBank(updatedBank);
  };

  const resetAll = () => {
    setAnswers(items.map(() => []));
    setLetterBank(items.map((item) => item.scrambled[0].split("")));
    setLocked(false);
    setChecked(false);
  };

  const showAnswers = () => {
    setAnswers(items.map((item) => item.correct[0].split("")));
    setLetterBank(items.map(() => []));
    setLocked(true);
    setChecked(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = answers.some((letters) => letters.length === 0);

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    answers.forEach((letters, i) => {
      if (letters.join("") === items[i].correct[0]) {
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

    setLocked(true);
    setChecked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h5 className="header-title-page8">
            <span className=" mr-4">G</span>
            Unscramble and write the words.
          </h5>

          {items.map((item, i) => (
            <div key={i} className="mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-lg w-5">{i + 1}</span>

                <Droppable droppableId={`bank-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-2"
                    >
                      {letterBank[i].map((letter, index) => {
                        const id = `letter-${i}-${index}-${letter}`;

                        return (
                          <Draggable
                            key={id}
                            draggableId={id}
                            index={index}
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
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable droppableId={`slot-${i}`} direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-w-[120px] border-b-2 border-black min-h-8 flex items-center gap-1 px-2 ${
                        checked && answers[i].join("") === items[i].correct[0]
                          ? "text-green-600 font-bold"
                          : ""
                      }`}
                    >
                      {answers[i].map((letter, letterIndex) => (
                        <span
                          key={`${letter}-${letterIndex}`}
                          onClick={() => handleRemoveLetter(i, letterIndex)}
                          className={`w-8 h-8 flex items-center justify-center rounded border ${
                            locked
                              ? "bg-gray-100 cursor-default"
                              : "bg-blue-100 cursor-pointer"
                          }`}
                        >
                          {letter}
                        </span>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}

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

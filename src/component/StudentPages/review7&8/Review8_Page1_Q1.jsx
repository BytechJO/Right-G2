import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import imgA from "../../../assets/imgs/test6.png";
import imgB from "../../../assets/imgs/test6.png";

const Review8_Page1_Q1 = () => {
  const I_answers = ["I have pants.", "I have a cap.", "I have shorts."];

  const She_answers = ["She has skirts.", "She has a hat.", "She has a scarf."];

  const answersBank = [...I_answers, ...She_answers];

  const questions = [
    { id: "I-1", type: "I" },
    { id: "I-2", type: "I" },
    { id: "I-3", type: "I" },

    { id: "S-1", type: "She" },
    { id: "S-2", type: "She" },
    { id: "S-3", type: "She" },
  ];

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const sentence = result.draggableId;
    const id = result.destination.droppableId.replace("answer-", "");
    setAnswers((prev) => {
      const newAnswers = { ...prev };

      // remove sentence if already used
      Object.keys(newAnswers).forEach((key) => {
        if (newAnswers[key] === sentence) {
          delete newAnswers[key];
        }
      });

      newAnswers[id] = sentence;

      return newAnswers;
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
  };

  const showAnswers = () => {
    const filled = {};

    let iIndex = 0;
    let sIndex = 0;

    questions.forEach((q) => {
      if (q.type === "I") {
        filled[q.id] = I_answers[iIndex++];
      } else {
        filled[q.id] = She_answers[sIndex++];
      }
    });

    setAnswers(filled);
    setLocked(true);
  };
  const checkAnswers = () => {
    if (locked) return;
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let correct = 0;

    // I group
    const userI = Object.entries(answers)
      .filter(([k]) => k.startsWith("I"))
      .map(([, v]) => v);

    const correctI = I_answers;

    correct += userI.filter((a) => correctI.includes(a)).length;

    // She group
    const userShe = Object.entries(answers)
      .filter(([k]) => k.startsWith("S"))
      .map(([, v]) => v);

    const correctShe = She_answers;

    correct += userShe.filter((a) => correctShe.includes(a)).length;
    const total = questions.length;

    const msg = `
<div style="font-size:20px;text-align:center;">
<b>Score: ${correct} / ${total}</b>
</div>
`;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center p-8">
        <div className="w-[80%]">
          <h5 className="header-title-page8 ">
            <span style={{ marginRight: "20px" }}>A</span> Look and write.
          </h5>

          {/* IMAGES */}
          <div className="w-[70%] mx-auto">
            <div className="flex justify-center gap-8 ">
              <div className="relative">
                <img
                  src={imgA}
                  className="w-[380px]! h-[230px]! object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  A
                </span>
              </div>

              <div className="relative">
                <img
                  style={{ width: "380px", height: "230px" }}
                  src={imgB}
                  className="object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  B
                </span>
              </div>
            </div>

            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5"
                >
                  {answersBank
                    .filter((a) => !Object.values(answers).includes(a))
                    .map((a, index) => (
                      <Draggable
                        key={a}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-yellow-200 px-4 py-2 rounded-lg cursor-grab"
                          >
                            {a}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS GRID */}

            <div className="grid grid-cols-2 gap-x-16 mb-20">
              {/* LEFT - I */}
              <div>
                {questions
                  .filter((q) => q.type === "I")
                  .map((q, index) => (
                    <div key={q.id} className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-lg">{index + 1}</span>

                      <Droppable droppableId={`answer-${q.id}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="border-b-2 border-black min-h-10 flex-1"
                          >
                            <span className="text-red-600 font-semibold">
                              {answers[q.id]}
                            </span>

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </div>

              {/* RIGHT - She */}
              <div>
                {questions
                  .filter((q) => q.type === "She")
                  .map((q, index) => (
                    <div key={q.id} className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-lg">{index + 1}</span>

                      <Droppable droppableId={`answer-${q.id}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="border-b-2 border-black min-h-10 flex-1"
                          >
                            <span className="text-red-600 font-semibold">
                              {answers[q.id]}
                            </span>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* BUTTONS */}

          <div className="action-buttons-container mt-10">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswers}
              className="show-answer-btn swal-continue"
            >
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

export default Review8_Page1_Q1;

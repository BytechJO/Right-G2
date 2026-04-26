import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import calendar from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-1.svg";
import glue from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-2.svg";
import tube from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-3.svg";
import blue from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-4.svg";
import nute from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-5.svg"
const Unit8_Page5_Q2 = () => {
  const options = ["flute", "June", "blue", "glue", "tube"];

  const blanks = {
    b1: "flute",
    b2: "June",
    b3: "blue",
    b4: "glue",
    b5: "tube",
  };

  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    setAnswers({
      ...answers,
      [destination.droppableId]: word,
    });
  };

  const reset = () => {
    setAnswers({});
    setLocked(false);
    setShowResult(false);
  };

  const show = () => {
    setAnswers(blanks);
    setLocked(true);
  };

  const checkAnswers = () => {
    if (locked) return;
    const total = Object.keys(blanks).length;

    if (Object.keys(answers).length < total) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    Object.keys(blanks).forEach((key) => {
      if (answers[key] === blanks[key]) score++;
    });

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
    setShowResult(true);
  };

  const Blank = ({ id }) => (
  <Droppable droppableId={id}>
    {(provided, snapshot) => (
      <span className="relative inline-block min-w-[90px] h-[50px] mx-2 text-center">
        
        {/* ❌ */}
        {isWrong(id) && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
            ✕
          </span>
        )}

        <span
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`inline-block w-full h-full border-b-2 transition-all duration-200
            ${
              snapshot.isDraggingOver
                ? "bg-blue-100 border-2 border-dashed border-blue-500 rounded-md"
                : isWrong(id)
                ? "border-red-500"
                : "border-black"
            }
          `}
        >
          {answers[id] && (
            <span className="text-red-600 font-semibold">
              {answers[id]}
            </span>
          )}

          {provided.placeholder}
        </span>
      </span>
    )}
  </Droppable>
);
  const isWordUsed = (word) => {
    return Object.values(answers).includes(word);
  };

  const isWrong = (id) => {
    if (!showResult) return false;
    return answers[id] !== blanks[id];
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          {" "}
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8">
            <span style={{ color: "#2e3192", marginRight: "20px" }}>2</span>Look
            and complete the poem. Then say.
          </h5>
          <div className="flex flex-col gap-5">
          {/* word bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-5 justify-center p-2 rounded-lg"
              >
                {options.map((word, index) => {
                  const used = isWordUsed(word);

                  return (
                    <Draggable
                      key={word}
                      draggableId={word}
                      index={index}
                      isDragDisabled={locked || used}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-4 py-2 text-xl border-2 border-blue-900 rounded-lg shadow transition-all
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-gray-100"
            }
          `}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* poem */}
          <div className="text-2xl leading-[60px] text-gray-700 mt-8">
            <div>
              <span className="text-[#2e3192] font-bold mr-4">1</span>
              Sue McClue likes to play her
              <Blank id="b1" />
              <img
                src={calendar}
                className="inline w-14! h-14! mx-2 object-contain"
              />{" "}
              in
              <Blank id="b2" />
              <img
                src={glue}
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              <span className="text-[#2e3192] font-bold mr-4">2 </span>
              Sue wears
              <Blank id="b3" />
              <img
                src={tube}
                className="inline w-14! h-14! mx-2 object-contain"
              />
              and puts a spoon in the
              <Blank id="b4" />
              <img
                src={blue}
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              when she plays her tune called
              <Blank id="b5" />
              <img
                src={nute}
                className="inline w-14! h-14! mx-2 object-contain"
              />
              on the Moon.
            </div>
          </div></div>
        </div>

        {/* buttons */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={show} className="show-answer-btn swal-continue">
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

export default Unit8_Page5_Q2;

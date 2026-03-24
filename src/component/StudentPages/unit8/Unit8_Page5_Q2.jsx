import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import calendar from "../../../assets/imgs/test6.png";
import glue from "../../../assets/imgs/test6.png";
import tube from "../../../assets/imgs/test6.png";
import blue from "../../../assets/imgs/test6.png";

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

    const msg = `
    <div style="font-size:20px;text-align:center;">
    <span style="color:#2e7d32;font-weight:bold">
    Score: ${score} / ${total}
    </span>
    </div>`;

    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  const Blank = ({ id }) => (
    <Droppable droppableId={id}>
      {(provided) => (
        <span
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="inline-block min-w-[90px] border-b-2 border-black text-center mx-2"
        >
          {answers[id] && (
            <span className="text-red-600 font-semibold">{answers[id]}</span>
          )}
          {provided.placeholder}
        </span>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          {/* ❌ الهيدر كما هو */}
          <h5 className="header-title-page8 mb-8">
            <span style={{ color: "#2e3192", marginRight: "20px" }}>2</span>Look
            and complete the poem. Then say.
          </h5>
          {/* word bank */}

          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 justify-center mt-6 mb-6"
              >
                {options
                  .filter((w) => !Object.values(answers).includes(w))
                  .map((word, i) => (
                    <Draggable
                      key={word}
                      draggableId={`word-${word}`}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3 py-1 bg-yellow-200 rounded cursor-pointer font-semibold"
                        >
                          {word}
                        </span>
                      )}
                    </Draggable>
                  ))}

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
                src={blue}
                className="inline w-14! h-14! mx-2 object-contain"
              />{" "}
              in
              <Blank id="b2" />
              <img
                src={calendar}
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              <span className="text-[#2e3192] font-bold mr-4">2 </span>
              Sue wears
              <Blank id="b3" />
              <img
                src={blue}
                className="inline w-14! h-14! mx-2 object-contain"
              />
              and puts a spoon in the
              <Blank id="b4" />
              <img
                src={glue}
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              when she plays her tune called
              <Blank id="b5" />
              <img
                src={tube}
                className="inline w-14! h-14! mx-2 object-contain"
              />
              on the Moon.
            </div>
          </div>
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

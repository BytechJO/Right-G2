import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 55/Ex D 1.svg";
import "./Review6_Page2_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 6/cd38pg55-instruction1-adult-lady_rmKHQrku.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const words = [
  { id: 1, word: "light" },
  { id: 2, word: "bike" },
  { id: 3, word: "five" },
  { id: 4, word: "night" },
  { id: 5, word: "bike" },
];

const correctAnswers = ["bike", "five", "light", "bike", "night"];

export default function Review6_Page2_Q1() {
  const [answers, setAnswers] = useState([null, null, null, null, null]);
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false); // ✅ جديد

  const stopAtSecond = 7.059;

  const captions = [
    {
      start: 0.56,
      end: 7.059,
      text: "Page 55, review 6, exercise D. Listen, read, and complete the story.",
    },
    {
      start: 8.179,
      end: 15.02,
      text: "Andrew rides his bike at 5 o'clock every evening. He has a light on his bike when he rides at night",
    },
  ];

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const id = Number(draggableId.replace("word-", ""));
    const index = Number(destination.droppableId.split("-")[1]);

    const selectedWord = words.find((w) => w.id === id);

    const updated = [...answers];
    updated[index] = selectedWord;

    setAnswers(updated);
  };

  const resetAnswers = () => {
    setAnswers([null, null, null, null, null]);
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    const available = [...words];

    const filled = correctAnswers.map((word) => {
      const index = available.findIndex((w) => w.word === word);
      const selected = available[index];
      available.splice(index, 1);
      return selected;
    });

    setAnswers(filled);
    setLocked(true);
    setShowResult(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((a) => a === null)) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a.word === correctAnswers[i]) score++;
    });

    const total = correctAnswers.length;

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
    setShowResult(true); // ✅ مهم
  };

  // ✅ check wrong slot
  const isWrong = (index) => {
    return showResult && answers[index]?.word !== correctAnswers[index];
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{gap:"40px"}}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>D</span>
            Listen, read, and complete the story.
          </h5>

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />
   
   <div className="flex flex-col gap-5">
          {/* STORY */}
          <div className="flex items-center gap-[3%]">
            <div   className="flex flex-col justify-between rounded-lg w-full" style={{height:"220px"}}>
             {/* WORD BANK */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex justify-between rounded-lg w-[80%]"
              >
                {words.map((word, i) => {
                  const isWordUsed = (id) => {
                    return answers.some((a) => a?.id === id);
                  };
                  const used = isWordUsed(word.id);

                  return (
                    <Draggable
                      key={word.id}
                      draggableId={`word-${word.id}`}
                      index={i}
                      isDragDisabled={locked || used}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-3.5 py-1.5 border-2 rounded-lg font-bold transition-all
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-blue-100 border-[#2c5287]"
            }
          `}
                        >
                          {word.word}
                        </span>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
            <div className="text-[20px] leading-loose flex-1">
              Andrew rides his
              {/* SLOT 0 */}
              <Droppable droppableId="slot-0">
                {(provided, snapshot) => (
                  <span className="relative inline-block min-w-[100px] mx-1.5 text-center">
                    {isWrong(0) && (
                      <span className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-10 block border-b-2 transition-all duration-200 px-2 py-1
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(0)
        ? "border-red-500"
        : "border-black"
  }
`}
                    >
                      {answers[0]?.word}
                      {provided.placeholder}
                    </span>
                  </span>
                )}
              </Droppable>
              at
              {/* SLOT 1 */}
              <Droppable droppableId="slot-1">
                {(provided, snapshot) => (
                  <span className="relative inline-block min-w-[100px] mx-1.5 text-center">
                    {isWrong(1) && (
                      <span className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-10 block border-b-2 transition-all duration-200 px-2 py-1
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(1)
        ? "border-red-500"
        : "border-black"
  }
`}
                    >
                      {answers[1]?.word}
                      {provided.placeholder}
                    </span>
                  </span>
                )}
              </Droppable>
              o’clock every evening. He has a{/* SLOT 2 */}
              <Droppable droppableId="slot-2">
                {(provided, snapshot) => (
                  <span className="relative inline-block min-w-[100px] mx-1.5 text-center">
                    {isWrong(2) && (
                      <span className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-10 block border-b-2 transition-all duration-200 px-2 py-1
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(2)
        ? "border-red-500"
        : "border-black"
  }
`}
                    >
                      {answers[2]?.word}
                      {provided.placeholder}
                    </span>
                  </span>
                )}
              </Droppable>
              on his
              {/* SLOT 3 */}
              <Droppable droppableId="slot-3">
                {(provided, snapshot) => (
                  <span className="relative inline-block min-w-[100px] mx-1.5 text-center">
                    {isWrong(3) && (
                      <span className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-10 block border-b-2 transition-all duration-200 px-2 py-1
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(3)
        ? "border-red-500"
        : "border-black"
  }
`}
                    >
                      {answers[3]?.word}
                      {provided.placeholder}
                    </span>
                  </span>
                )}
              </Droppable>
              when he rides at
              {/* SLOT 4 */}
              <Droppable droppableId="slot-4">
                {(provided, snapshot) => (
                  <span className="relative inline-block min-w-[100px] mx-1.5 text-center">
                    {isWrong(4) && (
                      <span className="absolute top-0 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                    <span
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-10 block border-b-2 transition-all duration-200 px-2 py-1
  ${
    snapshot.isDraggingOver
      ? "border-blue-500 bg-blue-100 scale-105 shadow-md"
      : isWrong(4)
        ? "border-red-500"
        : "border-black"
  }
`}
                    >
                      {answers[4]?.word}
                      {provided.placeholder}
                    </span>
                  </span>
                )}
              </Droppable>
              .
            </div>
</div>
            <img
              src={img1}
              alt=""
              style={{
                width: "auto",
               
                height: "220px",
                borderRadius: "15px",
              }}
            />
          </div>

         
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
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

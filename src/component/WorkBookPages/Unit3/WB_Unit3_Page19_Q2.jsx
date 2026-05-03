import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 4.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const answerQuestions = [
  {
    id: "j1",
    img: img1,
    question: "Can she sing?",
    correctAnswer: "Yes, she can.",
  },
  {
    id: "j2",
    img: img2,
    question: "Can it swim?",
    correctAnswer: "Yes, it can.",
  },
  {
    id: "j3",
    img: img3,
    question: "Can it hop?",
    correctAnswer: "Yes, it can.",
  },
  {
    id: "j4",
    img: img4,
    question: "Can she fly?",
    correctAnswer: "No, she can't.",
  },
];

const initialState = {
  wordBank: [
    { id: "w1", text: "Yes, she can." },
    { id: "w2", text: "Yes, it can." },
    { id: "w3", text: "Yes, it can." },
    { id: "w4", text: "No, she can't." },
  ],
  j1: [],
  j2: [],
  j3: [],
  j4: [],
};

const WB_Unit3_Page19_Q2 = () => {
  const [items, setItems] = useState(initialState);
  const [showResults, setShowResults] = useState(false);

  const normalize = (text) =>
    text
      ?.trim()
      .toLowerCase()
      .replace(/[.,!?]/g, "");

  const isWrong = (qId) => {
    if (!showResults) return false;
    const dropped = items[qId]?.[0]?.text;
    if (!dropped) return false;

    const correct = answerQuestions.find((q) => q.id === qId).correctAnswer;

    return normalize(dropped) !== normalize(correct);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    setShowResults(false);

    setItems((prev) => {
      const newState = { ...prev };

      const sourceList = Array.from(newState[source.droppableId]);
      const destList = Array.from(newState[destination.droppableId]);

      const movedItem = sourceList[source.index];

      // 🔁 نفس المكان
      if (source.droppableId === destination.droppableId) return prev;

      // 🔄 استبدال
      if (destination.droppableId !== "wordBank" && destList.length > 0) {
        destList.shift();
      }

      // ➕ إضافة للسؤال
      if (destination.droppableId !== "wordBank") {
        destList.splice(0, 0, movedItem);
      }

      // ❗ لا تحذف من wordBank أبداً
      newState[destination.droppableId] = destList;

      return newState;
    });
  };
  const checkAnswers = () => {
    if (showResults) return;
    const allFilled = answerQuestions.every(
      (q) => items[q.id] && items[q.id].length > 0,
    );

    if (!allFilled) {
      ValidationAlert.warning("Please fill all blanks first!");
      return;
    }

    setShowResults(true);

    let score = 0;

    answerQuestions.forEach((q) => {
      if (normalize(items[q.id][0].text) === normalize(q.correctAnswer)) {
        score++;
      }
    });

    if (score === answerQuestions.length) {
      ValidationAlert.success(`Score: ${score} / ${answerQuestions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${answerQuestions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${answerQuestions.length}`);
    }
  };

const handleShowAnswer = () => {
  const filled = {};
  
  answerQuestions.forEach((q, index) => {
    filled[q.id] = [{ id: `a-${index}`, text: q.correctAnswer }];
  });

  setItems((prev) => ({
    ...filled,
    wordBank: prev.wordBank.map((w) => ({
      ...w,
      disabled: true, // ✅ تعطيل كل الكلمات
    })),
  }));

  setShowResults(true);
};
  const handleStartAgain = () => {
    setItems(initialState);
    setShowResults(false);
  };
  const usedWords = Object.keys(items)
    .filter((key) => key !== "wordBank")
    .flatMap((key) => items[key]);
  return (
    <div className="main-container-component mb-15">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Read, look, and write the answers.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <Droppable droppableId="wordBank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap justify-center gap-3 p-2 rounded-xl min-h-[40px] text-[20px]"
              >
                {items.wordBank.map((word, index) => {
                  const isUsed = usedWords.some((w) => w.id === word.id);
                  console.log(isUsed);

                  return (
                    <Draggable
                      key={word.id}
                      draggableId={`${word.id}-${index}`}
                      index={index}
                      isDragDisabled={isUsed ||showResults} // 🔒 المنع
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`WB-word-bank 
            ${
              isUsed ||showResults
                ? "bg-gray-100 text-gray-400 border border-blue-800 cursor-not-allowed opacity-70"
                : "bg-white text-gray-800 border border-blue-800 cursor-grab hover:bg-gray-50"
            }`}
                        >
                          {word.text}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-15">
            {answerQuestions.map((q, index) => (
              <div
                key={q.id}
                className="relative flex flex-col justify-center w-full"
              >
                <div className="flex gap-2 items-center">
                  <p className="font-bold text-blue-900 text-xl">{index + 1}</p>
                  <p className="text-[20px]">{q.question}</p>
                </div>
                <img
                  src={q.img}
                  className="w-24 h-24 mt-2"
                  style={{ height: "90px" }}
                />

                <Droppable droppableId={q.id}>
                  {(provided ,snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`w-[90%] min-h-[35px] border-b-2 flex items-center justify-center ${isWrong(q.id) && "border-red-500"}  ${
          snapshot.isDraggingOver
            ? "bg-blue-100 border-blue-400 border-dashed"
            : isWrong(q.id)
            ? "border-red-500"
            : "border-gray-400"
        }`}
                    >
                      {items[q.id].map((word, i) => (
                        <Draggable
                          key={word.id}
                          draggableId={word.id}
                          index={i}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="text-[20px]"
                            >
                              {word.text}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {isWrong(q.id) && (
                        <div className="absolute top-33 right-8 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                          ✕
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit3_Page19_Q2;

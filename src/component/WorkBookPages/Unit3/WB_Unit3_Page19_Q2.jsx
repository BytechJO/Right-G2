import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 4.svg";

import Button from "../button";
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

      const [movedItem] = sourceList.splice(source.index, 1);

      // إذا نفس المكان
      if (source.droppableId === destination.droppableId) {
        sourceList.splice(destination.index, 0, movedItem);
        newState[source.droppableId] = sourceList;
        return newState;
      }

      // إذا فيه كلمة قديمة رجعها للبنك
      if (destination.droppableId !== "wordBank" && destList.length > 0) {
        const old = destList.shift();
        newState.wordBank = [...newState.wordBank, old];
      }

      if (destination.droppableId === "wordBank") {
        destList.splice(destination.index, 0, movedItem);
      } else {
        destList.splice(0, 0, movedItem);
      }

      newState[source.droppableId] = sourceList;
      newState[destination.droppableId] = destList;

      return newState;
    });
  };

  const checkAnswers = () => {
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
    setItems({
      wordBank: [],
      j1: [{ id: "a1", text: "Yes, she can." }],
      j2: [{ id: "a2", text: "Yes, it can." }],
      j3: [{ id: "a3", text: "Yes, it can." }],
      j4: [{ id: "a4", text: "No, she can't." }],
    });
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setItems(initialState);
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span> Drag the correct answer.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <Droppable droppableId="wordBank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap justify-center gap-3 p-2 border rounded-xl bg-gray-50 min-h-[40px]"
              >
                {items.wordBank.map((word, index) => (
                  <Draggable key={word.id} draggableId={word.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        {word.text}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {answerQuestions.map((q, index) => (
              <div key={q.id}>
                <div className="flex gap-2">
                  <p className="font-bold text-blue-600">{index + 1}</p>
                  <p>{q.question}</p>
                </div>
                <img src={q.img} className="w-24 h-24 mt-2" style={{height:"90px"}} />

                <Droppable droppableId={q.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative mt-2 min-h-[50px] flex items-center justify-center border-2 border-dashed rounded`}
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
                              className="bg-white px-3 py-1 rounded shadow"
                            >
                              {word.text}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {isWrong(q.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-lg">
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

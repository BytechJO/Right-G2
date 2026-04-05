import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WB_Unit3_Page19_Q1.css";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 2.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex I 4.svg";

const fillInQuestions = [
  {
    id: "i1",
    img: img1,
    startText: "",
    endText: "fly?",
    answer: "No, it can't.",
    correctAnswer: "Can it",
  },
  {
    id: "i2",
    img: img2,
    startText: "",
    endText: "run?",
    answer: "Yes, they can.",
    correctAnswer: "Can they",
  },
  {
    id: "i3",
    img: img3,
    startText: "",
    endText: "walk?",
    answer: "No, they can't.",
    correctAnswer: "Can they",
  },
  {
    id: "i4",
    img: img4,
    startText: "",
    endText: "swim?",
    answer: "Yes, it can.",
    correctAnswer: "Can it",
  },
];

const initialWords = {
  wordBank: [
    { id: "w1", text: "Can it" },
    { id: "w2", text: "Can they" },
    { id: "w3", text: "Can they" },
    { id: "w4", text: "Can it" },
  ],
  i1: [],
  i2: [],
  i3: [],
  i4: [],
};

const WB_Unit3_Page19_Q1 = () => {
  const [items, setItems] = useState(initialWords);
  const [showResults, setShowResults] = useState(false);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);

    const [removed] = sourceClone.splice(droppableSource.index, 1);

    if (droppableDestination.droppableId === "wordBank") {
      destClone.splice(droppableDestination.index, 0, removed);
    } else {
      // كل سؤال لازم يحتوي كلمة واحدة فقط
      if (destClone.length > 0) {
        sourceClone.splice(droppableSource.index, 0, removed);
        return null;
      }
      destClone.splice(0, 0, removed);
    }

    const result = {
      [droppableSource.droppableId]: sourceClone,
      [droppableDestination.droppableId]: destClone,
    };

    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    setShowResults(false);

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setItems((prev) => {
      const newState = { ...prev };
      const sourceList = Array.from(newState[source.droppableId]);
      const destList = Array.from(newState[destination.droppableId]);
      const [movedItem] = sourceList.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceList.splice(destination.index, 0, movedItem);
        newState[source.droppableId] = sourceList;
        return newState;
      }

      // إذا نزل على سؤال وفيه كلمة، رجع القديمة للبنك
      if (destination.droppableId !== "wordBank" && destList.length > 0) {
        const oldItem = destList.shift();
        newState.wordBank = [...newState.wordBank, oldItem];
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

  const handleShowAnswer = () => {
    setItems({
      wordBank: [],
      i1: [{ id: "a1", text: "Can it" }],
      i2: [{ id: "a2", text: "Can they" }],
      i3: [{ id: "a3", text: "Can they" }],
      i4: [{ id: "a4", text: "Can it" }],
    });
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setItems(initialWords);
    setShowResults(false);
  };
  const isWrongAnswer = (qId) => {
    if (!showResults || !items[qId]?.length) return false;

    const droppedText = items[qId][0].text.trim().toLowerCase();
    const correctText = fillInQuestions
      .find((q) => q.id === qId)
      ?.correctAnswer.trim()
      .toLowerCase();

    return droppedText !== correctText;
  };

  const checkAnswers = () => {
    // 🔴 أول شي: تحقق إذا كل الفراغات معبّية
    const allFilled = fillInQuestions.every(
      (q) => items[q.id] && items[q.id].length > 0,
    );

    if (!allFilled) {
      ValidationAlert.warning("Please fill all blanks first!");
      return;
    }

    // بعدين نعمل التصحيح
    setShowResults(true);

    let score = 0;

    fillInQuestions.forEach((q) => {
      if (
        items[q.id]?.[0]?.text?.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
      ) {
        score++;
      }
    });

    if (score === fillInQuestions.length) {
      ValidationAlert.success(`Score: ${score} / ${fillInQuestions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${fillInQuestions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${fillInQuestions.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span> Look, read, and drag the correct
          word.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <div className="p-2 border rounded-xl bg-gray-50 min-h-[42px]">
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {items.wordBank.map((word, index) => (
                    <Draggable
                      key={word.id}
                      draggableId={word.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm cursor-grab ${
                            snapshot.isDragging ? "rotate-2" : ""
                          }`}
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
          </div>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {fillInQuestions.map((q, index) => (
              <div key={q.id} className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-blue-600">{index + 1}</span>

                  <img
                    src={q.img}
                    alt={`Question ${index + 1}`}
                    className="max-w-20 max-h-20"
                  />

                  <div className="flex items-center gap-2 text-lg flex-wrap">
                    <Droppable droppableId={q.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`relative min-w-[90px] min-h-[42px] px-2 flex items-center justify-center border-2 border-dashed rounded-md transition-colors`}
                        >
                          {items[q.id].map((word, wordIndex) => (
                            <Draggable
                              key={word.id}
                              draggableId={word.id}
                              index={wordIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`px-3 py-1 bg-white rounded-md shadow text-center font-semibold ${
                                    snapshot.isDragging ? "rotate-2" : ""
                                  }`}
                                >
                                  {word.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {isWrongAnswer(q.id) && (
                            <div className="wrong-icon-unit3-p19-q1 absolute">
                              ✕
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <span>{q.endText}</span>
                  </div>
                </div>

                <p className="ml-12 text-gray-600">{q.answer}</p>
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

export default WB_Unit3_Page19_Q1;

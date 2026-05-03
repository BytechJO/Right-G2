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
    endText: "fly?",
    answer: "No, it can't.",
    correctAnswer: "Can it",
  },
  {
    id: "i2",
    img: img2,
    endText: "run?",
    answer: "Yes, they can.",
    correctAnswer: "Can they",
  },
  {
    id: "i3",
    img: img3,
    endText: "walk?",
    answer: "No, they can't.",
    correctAnswer: "Can they",
  },
  {
    id: "i4",
    img: img4,
    endText: "swim?",
    answer: "Yes, it can.",
    correctAnswer: "Can it",
  },
];

const initialWords = {
  wordBank: [
    { id: "w1", text: "Can it", disabled: false },
    { id: "w2", text: "Can they", disabled: false },
    { id: "w3", text: "Can they", disabled: false },
    { id: "w4", text: "Can it", disabled: false },
  ],
  i1: [],
  i2: [],
  i3: [],
  i4: [],
};

const WB_Unit3_Page19_Q1 = () => {
  const [items, setItems] = useState(initialWords);
  const [showResults, setShowResults] = useState(false);

  const handleShowAnswer = () => {
    const filledAnswers = {
      wordBank: initialWords.wordBank.map((word) => ({
        ...word,
        disabled: true,
      })),
      i1: [{ ...initialWords.wordBank[0] }],
      i2: [{ ...initialWords.wordBank[1] }],
      i3: [{ ...initialWords.wordBank[2] }],
      i4: [{ ...initialWords.wordBank[3] }],
    };

    setItems(filledAnswers);
    setShowResults(true);
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

      // ❌ منع سحب الكلمة إذا كانت disabled
      if (source.droppableId === "wordBank" && movedItem.disabled) {
        return prev;
      }

      // نفس المكان
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return prev;
      }

      // 🔁 ترتيب داخلي
      if (source.droppableId === destination.droppableId) {
        sourceList.splice(source.index, 1);
        sourceList.splice(destination.index, 0, movedItem);
        newState[source.droppableId] = sourceList;
        return newState;
      }

      // 🟢 سحب من البنك → تعطيل الكلمة (باستخدام id ✅)
      if (source.droppableId === "wordBank") {
        newState.wordBank = newState.wordBank.map((item) =>
          item.id === movedItem.id ? { ...item, disabled: true } : item,
        );
      } else {
        // 🔁 سحب من السؤال → حذفها من السؤال
        sourceList.splice(source.index, 1);
      }

      // 🔄 استبدال كلمة داخل السؤال
      if (destination.droppableId !== "wordBank" && destList.length > 0) {
        const oldItem = destList.shift();

        // رجّع الكلمة القديمة للبنك (وفعّلها)
        newState.wordBank = newState.wordBank.map((item) =>
          item.id === oldItem.id ? { ...item, disabled: false } : item,
        );
      }

      // ➕ إضافة الكلمة للسؤال
      if (destination.droppableId !== "wordBank") {
        destList.splice(0, 0, { ...movedItem });
      }

      newState[source.droppableId] = sourceList;
      newState[destination.droppableId] = destList;

      return newState;
    });
  };

  const handleStartAgain = () => {
    setItems(initialWords);
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const allFilled = fillInQuestions.every(
      (q) => items[q.id] && items[q.id].length > 0,
    );

    if (!allFilled) {
      ValidationAlert.info("Please fill all blanks first!");
      return;
    }

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

    if (score === fillInQuestions.length)
      ValidationAlert.success(` Score: ${score} / ${fillInQuestions.length}`);
    else if (score === 0)
      ValidationAlert.error(` Score: ${score} / ${fillInQuestions.length}`);
    else
      ValidationAlert.warning(` Score: ${score} / ${fillInQuestions.length}`);
  };
  const usedWords = Object.keys(items)
    .filter((key) => key !== "wordBank")
    .flatMap((key) => items[key]);

  const isWrong = (qId) => {
    if (!showResults) return false;

    return (
      items[qId]?.[0]?.text?.trim().toLowerCase() !==
      fillInQuestions
        .find((q) => q.id === qId)
        .correctAnswer.trim()
        .toLowerCase()
    );
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span> Look, read, and drag the correct
          word.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <div className="p-2 rounded-xl min-h-[42px]">
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center gap-10"
                >
                  {items.wordBank.map((word, index) => {
                    const isUsed = usedWords.some((w) => w.id === word.id);

                    return (
                      <Draggable
                        key={word.id}
                        draggableId={`${word.id}-${index}`}
                        index={index}
                        isDragDisabled={isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`WB-word-bank
  ${
    isUsed
      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60 border border-blue-800"
      : "bg-white text-gray-800 cursor-grab border border-blue-800 hover:bg-gray-50"
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
          </div>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fillInQuestions.map((q, index) => (
              <div key={q.id} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex gap-5">
                  <span className="font-bold text-blue-900 text-xl">{index + 1}</span>

                  <img src={q.img} alt=""  style={{height:"120px" ,width:"120px"}}/>
</div>
               <Droppable droppableId={q.id}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`
        min-w-[90px] min-h-[42px] border-b-2 flex items-center justify-center 
        transition-all duration-200
        ${
          snapshot.isDraggingOver
            ? "bg-blue-100 border-dashed border-blue-400"
            : isWrong(q.id)
            ? "border-red-500"
            : "border-gray-400"
        }
      `}
    >
      {items[q.id].map((word, i) => (
        <Draggable
          key={word.id}
          draggableId={word.id}
          index={i}
          isDragDisabled={true}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="px-3 py-1 rounded text-[20px]"
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
                  {isWrong(q.id) && (
                    <div className="absolute top-3 right-43 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
                  <span className="text-[20px]">{q.endText}</span>
                </div>

                <p className="ml-12 text-gray-600 text-[20px]">{q.answer}</p>
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

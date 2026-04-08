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

  // ✅ بنك الحروف مع حالة used
  const [letterBank, setLetterBank] = useState(
    items.map((item) =>
      item.scrambled[0].split("").map((l) => ({
        value: l,
        used: false,
      })),
    ),
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

      // ❌ منع السحب بين الكلمات
      if (sourceIndex !== destIndex) return;

      const updatedAnswers = [...answers];
      const updatedBank = [...letterBank];

      const letterObj = updatedBank[sourceIndex][source.index];

      // ❌ إذا مستخدم
      if (letterObj.used) return;

      // ❌ إذا امتلأت الكلمة
      if (
        updatedAnswers[destIndex].length >= items[destIndex].correct[0].length
      ) {
        return;
      }

      // ✅ أضف الحرف
      updatedAnswers[destIndex] = [
        ...updatedAnswers[destIndex],
        letterObj.value,
      ];

      // ✅ علّمه مستخدم
      updatedBank[sourceIndex][source.index].used = true;

      setAnswers(updatedAnswers);
      setLetterBank(updatedBank);
    }
  };

  // ✅ حذف حرف وإرجاعه للبنك
  const handleRemoveLetter = (questionIndex, letterIndex) => {
    if (locked) return;

    const updatedAnswers = [...answers];
    const updatedBank = [...letterBank];

    const removedLetter = updatedAnswers[questionIndex][letterIndex];

    updatedAnswers[questionIndex].splice(letterIndex, 1);

    // 🔁 إعادة تفعيل أول حرف مطابق
    const bankLetters = updatedBank[questionIndex];

    const indexToEnable = bankLetters.findIndex(
      (l) => l.value === removedLetter && l.used === true,
    );

    if (indexToEnable !== -1) {
      bankLetters[indexToEnable].used = false;
    }

    setAnswers(updatedAnswers);
    setLetterBank(updatedBank);
  };

  const resetAll = () => {
    setAnswers(items.map(() => []));
    setLetterBank(
      items.map((item) =>
        item.scrambled[0].split("").map((l) => ({
          value: l,
          used: false,
        })),
      ),
    );
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

    let color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${score} /${total}
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
      <div className="main-container-component">
        <div className="div-forall gap-2">
          <h5 className="header-title-page8">
            <span className=" mr-4">G</span>
            Unscramble and write the words.
          </h5>
          <div>
            {items.map((item, i) => (
              <div key={i} className="mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-lg w-5">{i + 1}</span>

                  {/* 🔤 BANK */}
                  <div className="w-50">
                    <Droppable droppableId={`bank-${i}`} direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex gap-2"
                        >
                          {letterBank[i].map((letter, index) => {
                            const id = `letter-${i}-${index}-${letter.value}`;

                            return (
                              <Draggable
                                key={id}
                                draggableId={id}
                                index={index}
                                isDragDisabled={locked || letter.used}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`w-8 h-8 flex items-center justify-center rounded border
                                  ${
                                    letter.used
                                      ? "bg-gray-300 cursor-not-allowed"
                                      : "bg-yellow-200 cursor-grab"
                                  }
                                `}
                                  >
                                    {letter.value}
                                  </span>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {/* ✍️ SLOT */}
                  <div style={{ position: "relative" }}>
                    <Droppable droppableId={`slot-${i}`} direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`w-90 border-b-2 border-black h-10 flex items-center gap-0 px-2 ${
                            checked && answers[i].join("") !== item.correct[0]
                              ? "border-b-2 border-red-500"
                              : ""
                          }`}
                        >
                          {answers[i].map((letter, letterIndex) => (
                            <span
                              key={`${letter}-${letterIndex}`}
                              onClick={() => handleRemoveLetter(i, letterIndex)}
                              className={`
    text-xl font-semibold
    ${locked ? "cursor-default" : "cursor-pointer"}
  `}
                              style={{
                                marginRight: "2px",
                              }}
                            >
                              {letter}
                            </span>
                          ))}
                          {provided.placeholder}
                          {checked &&
                            answers[i].join("") !== item.correct[0] && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  width: "26px",
                                  height: "26px",
                                  backgroundColor: "red",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                  border:"2px solid white"
                                }}
                              >
                               ✕
                              </div>
                            )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit1_Page4_Q2.css";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex D 5.svg";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const data = [
  {
    parts: [
      {
        before: "She’s my",
        middleImg: img1,
        blank: 1,
        after: ".",
      },
      {
        before: "He’s my",
        middleImg: img2,
        blank: 2,
        after: "I want no other.",
      },
    ],
    correct: ["mother", "father"],
  },
  {
    parts: [
      {
        before: "This is my",
        middleImg: img3,
        blank: 1,
        after: "and",
      },
      {
        before: "my",
        middleImg: img4,
        blank: 2,
        after: "who like to",
      },
      {
        before: " ",
        middleImg: img5,
        blank: 3,
        after: ".",
      },
    ],
    correct: ["sister", "brother", "play"],
  },
];

const WB_Unit1_Page4_Q2 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const letter = draggableId.replace("letter-", "");
    const [qIndex, blankIndex] = destination.droppableId
      .replace("slot-", "")
      .split("-")
      .map(Number);

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);

      updated[qIndex][blankIndex] = letter;
      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا تعديل بعد Show Answer
    // 1) افحص إذا في أي خانة فاضية
    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === ""),
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    // 2) اجمع كل الأخطاء
    let wrong = [];
    let correctCount = 0;

    answers.forEach((arr, qIndex) => {
      arr.forEach((val, blankIndex) => {
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++; // صح
        } else {
          wrong.push(`${qIndex}-${blankIndex}`); // غلط
        }
      });
    });

    setWrongInputs(wrong);

    // 3) احسب العدد الكلي للحقول
    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0,
    );

    // 4) اختر اللون حسب السكور
    let color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalInputs}
      </span>
    </div>
  `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    // 5) طباعة النتيجة
    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctFilled = data.map((d) => [...d.correct]);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setWrongInputs([]); // إزالة الأخطاء
    setLocked(true); // قفل الحقول
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper">
        <div
          className="div-forall"
        
        >
          <h3 className="WB-header-title-page8">
            <span className="WB-ex-A">D</span> Look and complete. Read.
          </h3>
             
             <div>
          <Droppable droppableId="letters" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "30px",
                  padding: "10px",
                  // border: "2px dashed #ccc",
                  borderRadius: "10px",
                  marginBottom: "40px",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {["mother", "father", "sister", "brother", "play"].map(
                  (l, i) => {
                    const isUsed = answers.some((row) => row.includes(l));
                    return (
                      <Draggable
                        key={l}
                        draggableId={`letter-${l}`}
                        index={i}
                        isDragDisabled={locked || isUsed}
                      >
                        {(provided) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="WB-word-bank"
                            style={{
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {l}
                          </span>
                        )}
                      </Draggable>
                    );
                  },
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {data.map((item, qIndex) => (
            <div className="row-missing" key={qIndex}>
            

              <div className="sentence-wb-unit1-page4-q2">
                  <span className="num">{qIndex + 1}.</span>
                {item.parts.map((p, blankIndex) => (
                  <span key={blankIndex} className="sentence-part">
                    {p.before}

                    <div className={`input-wrapper-review4-p2-q1`}>
                      <Droppable droppableId={`slot-${qIndex}-${blankIndex}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`missing-input-review4-p2-q1  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {answers[qIndex][blankIndex] && (
                              <Draggable
                                draggableId={`filled-${answers[qIndex][blankIndex]}`}
                                index={0}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {answers[qIndex][blankIndex]}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {wrongInputs.includes(`${qIndex}-${blankIndex}`) && (
                        <span className="wrong-icon-review4-p2-q1">✕</span>
                      )}
                    </div>

                    {p.after}
                    <img src={p.middleImg} className="middle-img" alt="" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div></div>
        <div className="action-buttons-container">
          <button
            className="try-again-button"
            onClick={() => {
              setAnswers(data.map((d) => Array(d.correct.length).fill("")));
              setWrongInputs([]);
              setLocked(false); // ⭐ NEW — فتح التعديل من جديد
            }}
          >
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page4_Q2;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
// import "./Review3_Page1_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 34/Ex C 2.svg";

const Review3_Page1_Q3 = () => {
  const items = [
    {
      image: img1,
      questionParts: ["Can he fly a kite?"],
      blanksCount: 0,
      questionAnswers: [],
      answer: "No, he can't.",
    },
    {
      image: img2,
      questionParts: ["Can she make a sandwich?"],
      blanksCount: 1,
      questionAnswers: [],
      answer: "Yes,she can.",
    },
  ];

  const wordBank = ["Yes,she can.", "No, he can't."];

  const [questionInputs, setQuestionInputs] = useState(
    items.map((item) => Array(item.blanksCount).fill("")),
  );

  const [answers, setAnswers] = useState(items.map(() => ""));
  const [showCorrect, setShowCorrect] = useState(false);
  const [wrongMarks, setWrongMarks] = useState([]);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showCorrect) return;

    const value = draggableId.replace("word-", "");
    const [type, i, j] = destination.droppableId.split("-");

    const qIndex = Number(i);
    const blankIndex = Number(j);

    if (type === "q") {
      const updated = [...questionInputs];
      updated[qIndex][blankIndex] = value;
      setQuestionInputs(updated);
    }

    if (type === "a") {
      const updated = [...answers];
      updated[qIndex] = value;
      setAnswers(updated);
    }
  };

  const showAnswers = () => {
    setQuestionInputs(
      items.map((item) =>
        item.blanksCount > 0 ? [...item.questionAnswers] : [],
      ),
    );

    setAnswers(items.map((item) => item.answer));
    setShowCorrect(true);
    setWrongMarks([]);
  };

  const resetAll = () => {
    setQuestionInputs(items.map((item) => Array(item.blanksCount).fill("")));
    setAnswers(items.map(() => ""));
    setShowCorrect(false);
    setWrongMarks([]);
  };

  const checkAnswers = () => {
    if (showCorrect) return;

    for (let i = 0; i < items.length; i++) {
      if (!answers[i]?.trim()) {
        ValidationAlert.info(
          "Oops!",
          "Please complete all answers before checking.",
        );
        return;
      }
    }

    let score = 0;
    let total = 0;
    let wrong = [];

    items.forEach((item, i) => {
      item.questionAnswers.forEach((correctWord, idx) => {
        total++;
        if (
          questionInputs[i][idx]?.trim().toLowerCase() ===
          correctWord.toLowerCase()
        ) {
          score++;
        } else {
          wrong.push({ type: "question", qIndex: i, idx });
        }
      });

      total++;
      if (answers[i]?.trim().toLowerCase() === item.answer.toLowerCase()) {
        score++;
      } else {
        wrong.push({ type: "answer", qIndex: i });
      }
    });

    setWrongMarks(wrong);
    setShowCorrect(true);

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
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ gap: "40px" }}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>C</span>Look and answer the
            questions.
          </h5>

          <div className="flex flex-col gap-5">
            <Droppable droppableId="bank" isDropDisabled={showCorrect}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "60px",
                    padding: "10px",
                    // border: "2px dashed #ccc",
                    borderRadius: "10px",
                    justifyContent: "center",
                  }}
                >
                  {wordBank.map((word, index) => {
                    const isUsed = answers.some((row) => row.includes(word));
                    return (
                      <Draggable
                        key={word}
                        draggableId={`word-${word}`}
                        index={index}
                        isDragDisabled={showCorrect || isUsed}
                      >
                        {(provided) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="CB-unit2-p6-q2-word"
                            style={{
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {word}
                          </span>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="flex flex-col gap-5">
              {items.map((item, i) => {
                const isWrong = wrongMarks.some(
                  (w) => w.type === "answer" && w.qIndex === i,
                );

                return (
                  <div className="content-CB-unit4-p6-q1">
                    <div className="flex w-[56%]">
                      <span className="text-2xl text-blue-800 font-bold mr-5">
                        {i + 1}
                      </span>
                      <img
                        src={item.image}
                        alt=""
                        style={{ height: "150px", width: "200px" }}
                      />
                    </div>
                    <div key={i} className="question-box-CB-unit4-p6-q1 flex flex-col justify-center">
                      <div className="CB-unit4-p6-q1-title-container">
                        <p style={{ width: "100%", display: "flex" }}>
                          {item.questionParts.map((part, idx) => {
                            if (part === "") {
                              const blankIndex =
                                item.questionParts
                                  .slice(0, idx + 1)
                                  .filter((p) => p === "").length - 1;

                              return (
                                <Droppable
                                  key={idx}
                                  droppableId={`q-${i}-${blankIndex}`}
                                  isDropDisabled={showCorrect}
                                >
                                  {(provided, snapshot) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`question-blank-CB-unit4-p6-q1 ${
                                        snapshot.isDraggingOver
                                          ? "drag-over-cell"
                                          : ""
                                      }`}
                                    >
                                      {questionInputs[i][blankIndex]}
                                      {provided.placeholder}
                                    </span>
                                  )}
                                </Droppable>
                              );
                            }

                            return (
                              <span
                                key={idx}
                                style={{ width: "100%", fontSize: "20px" }}
                              >
                                {" "}
                                {part}{" "}
                              </span>
                            );
                          })}
                        </p>
                      </div>

                      <Droppable
                        droppableId={`a-${i}`}
                        isDropDisabled={showCorrect}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`answer-input-CB-unit4-p6-q1  ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                            style={{ position: "relative" }}
                          >
                            {answers[i]}

                            {isWrong && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                                ✕
                              </span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
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
};

export default Review3_Page1_Q3;

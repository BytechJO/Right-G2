import React, { useState } from "react";
import img from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 9/Page9-Ex E 1.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./Page9_Q2.css";
import Button from "../../WorkBookPages/Button";

const inputData = [
  { question: "", correct: "He's my father" },
  { question: "", correct: "She's my mother" },
  { question: "", correct: "He's my brother" },
  { question: "", correct: "She's my sister" },
  { question: "", correct: "She's my aunt" },
  { question: "", correct: "he's my uncle" },
];

const dragData = {
  data: ["sister", "mother", "uncle", "father", "brother", "aunt"],
  correct: "jack",
};

const Page9_Q2 = () => {
  const [answers, setAnswers] = useState(Array(inputData.length).fill(""));

  const [wrongInputs, setWrongInputs] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [missingAnswer, setMissingAnswer] = useState("");
  const missingCorrect = "jack";
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    if (!destination.droppableId.startsWith("drop-")) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = value;
      return updated;
    });

    setWrongInputs([]);
  };
  const checkAnswers = () => {
    if (showAnswer) return;

    const missingCorrectAnswer =
      missingAnswer.trim().toLowerCase() === missingCorrect;

    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    const totalQuestions = inputData.length + 1;
    let correctCount = missingCorrectAnswer ? 1 : 0;

    let wrong = [];

    answers.forEach((ans, i) => {
      const fullAnswer = inputData[i].correct.toLowerCase();

      if (fullAnswer.includes(ans.toLowerCase())) {
        correctCount++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowAnswer(true);

    let color =
      correctCount === totalQuestions
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalQuestions}
      </span>
    </div>
  `;

    if (correctCount === totalQuestions) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };
  const reset = () => {
    setAnswers(Array(inputData.length).fill(""));
    setWrongInputs([]);
    setMissingAnswer("");
    setShowAnswer(false);
  };

  const showCorrectAnswers = () => {
    const correctWords = inputData.map((item) => {
      return item.correct.split(" ").pop().toLowerCase();
    });

    setAnswers(correctWords);
    setMissingAnswer("jack");
    setWrongInputs([]);
    setShowAnswer(true);
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
        <div className="div-forall mb-10" style={{ width: "60%" }}>
          <div className="component-wrapper">
            <h3 className="header-title-page8">
              <span className="ex-A"> D</span> Look and write.
            </h3>

            <div className="CB-unit1-p9-q2-top-container">
              <div className="family-image-wrapper">
                <img src={img} className="CB-unit1-p9-q2-shape-img" alt="" />
              </div>

              <div className="CB-unit1-p9-q2-rightSide">
                {/* ✅ الكلمات */}
                <Droppable droppableId="words" direction="horizontal">
                  {(provided) => (
                    <div
                      className="word-list-box"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {dragData.data.map((word, index) => {
                        const isUsed = answers.includes(word);
                        return (
                          <Draggable
                            key={word}
                            draggableId={`word-${word}`}
                            index={index}
                            isDragDisabled={showAnswer || isUsed}
                          >
                            {(provided) => (
                              <div
                                className="word-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  // background: isUsed ? "#ccc" : "",
                                  textDecoration:  isUsed ? "line-through" : "",
                                  opacity: isUsed ? 0.6 : 1,
                                  cursor: isUsed ? "not-allowed" : "grab",
                                  ...provided.draggableProps.style,
                                }}
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

                {/* الفقاعة */}
                <div className="missing-bubble">
                  <input
                    className="blank-space"
                    value={missingAnswer}
                    disabled={showAnswer}
                    onChange={(e) => setMissingAnswer(e.target.value)}
                  />
                  {(missingAnswer !== "jack" || missingAnswer === "") &&
                    showAnswer && (
                      <span className="CB-unit1-p9-q2-wrong-icon1">✕</span>
                    )}
                  <span> is missing from the picture.</span>
                </div>
              </div>
            </div>

            {/* ✅ الأسئلة */}
            <div className="CB-unit1-p9-q2-content">
              <div className="CB-unit1-p9-q2-group-input">
                {inputData.map((item, index) => (
                  <div key={index} className="CB-unit1-p9-q2-question-row">
                    <span className="CB-unit1-p9-q2-q-number">
                      {index + 1}.
                    </span>

                    <Droppable droppableId={`drop-${index}`}>
                      {(provided) => (
                        <div
                          className="CB-unit1-p9-q2-question-text relative"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <input
                            type="text"
                            value={answers[index]}
                            readOnly
                            className="CB-unit1-p9-q2-input"
                          />
                          {wrongInputs.includes(index) && (
                            <span className="CB-unit1-p9-q2-wrong-icon">✕</span>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            handleStartAgain={reset}
            handleShowAnswer={showCorrectAnswers}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Page9_Q2;

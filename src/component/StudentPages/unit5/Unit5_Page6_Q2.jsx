import React, { useState, useEffect, useRef } from "react";
import "./Unit5_Page6_Q2.css";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex E 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const questions = [
  {
    id: 1,
    image: img1,
    scrambled: ["he", "doesn't", "like", "cheese"],
    correct: "he doesn't like cheese",
  },
  {
    id: 2,
    image: img2,
    scrambled: ["she", "like", "spaghetti", "doesn't"],
    correct: "she doesn't like spaghetti",
  },
  {
    id: 3,
    image: img3,
    scrambled: ["he", "meat", "likes"],
    correct: "he likes meat",
  },
  {
    id: 4,
    image: img4,
    scrambled: ["likes", "it", "milk"],
    correct: "it likes milk",
  },
];

const Unit5_Page6_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [userInputs, setUserInputs] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const scrambledWords = {
    1: ["he", "doesn't", "like", "cheese"],
    2: ["she", "like", "spaghetti", "doesn't"],
    3: ["he", "meat", "like"],
    4: ["likes", "it", "milk"],
  };
  const correctSentences = Object.fromEntries(
    questions.map((q) => [q.id, q.correct]),
  );

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const { draggableId, destination } = result;

    // ✅ نسمح بالدروب فقط على الإنبت
    if (!destination.droppableId.startsWith("blank-")) return;

    const draggedSentence = draggableId.split("-")[0];
    const targetSentence = destination.droppableId.replace("blank-", "");

    // ❌ منع النقل بين جمل مختلفة
    if (draggedSentence !== targetSentence) return;

    const word = draggableId.split("-").slice(1, -1).join("-");

    setUserInputs((prev) => {
      const updated = { ...prev };

      const wordsInSentence = updated[targetSentence]
        ? updated[targetSentence].split(" ")
        : [];

      // ❌ منع تكرار الكلمة بنفس الجملة
      if (wordsInSentence.includes(word)) return prev;

      updated[targetSentence] = wordsInSentence.length
        ? `${updated[targetSentence]} ${word}`
        : word;

      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (!userInputs[1] || !userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    let sentenceCorrect = 0;
    // let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      const userAnswer = userInputs[key].trim().toLowerCase();
      const correctAnswer = correctSentences[key].toLowerCase();

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    const totalScore = Object.keys(correctSentences).length;

    const userScore = sentenceCorrect;

    setLocked(true);

    let color =
      userScore === totalScore ? "green" : userScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${userScore} / ${totalScore}
      </span>
    </div>
  `;

    if (userScore === totalScore) ValidationAlert.success(scoreMessage);
    else if (userScore === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
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
        <div className="div-forall">
          <h5 className="header-title-page8">
            {" "}
            <span className="ex-A">E</span>Look and write
          </h5>
          <div className="CB-unit5-p6-q2-container" ref={containerRef}>
            {questions.map((q) => (
              <div className="CB-unit5-p6-q2-row mb-10" key={q.id}>
                <div
                  className="CB-unit5-p6-q2-row-inner"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    gap: "60px",
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <div
                    className="CB-unit5-p6-q2-image-section"
                    style={{
                      display: "flex",
                    }}
                  >
                    <span className="font-bold text-2xl text-blue-800">
                      {q.id}
                    </span>
                    <img
                      src={q.image}
                      alt=""
                      className="CB-unit5-p6-q2-image"
                      style={{
                        cursor: "pointer",
                        height: "auto",
                        width: "250px",
                      }}
                    />
                  </div>

                  {/* Word + Input */}
                  <div className="CB-unit5-p6-q2-word-section">
                    {/* Word Bank */}
                    <Droppable
                      droppableId={`bank-${q.id}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          // className="CB-unit5-p6-q2-word-bank"
                          style={{
                            display: "flex",
                            gap: "30px",
                            padding: "10px",
                            // border: "2px dashed #ccc",
                            borderRadius: "10px",
                            alignItems: "center",
                            width: "90%",
                            justifyContent: "flex-start",
                          }}
                        >
                          {q.scrambled.map((word, i) => {
                            const isUsed = userInputs[q.id]
                              ?.split(" ")
                              .includes(word);
                            return (
                              <Draggable
                                key={`${q.id}-${word}-${i}`}
                                draggableId={`${q.id}-${word}-${i}`}
                                index={i}
                                isDragDisabled={showAnswer || locked || isUsed}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="CB-unit5-p6-q2-word-box"
                                    style={{
                                      padding: "5px",
                                      border: "2px solid #2c5287",
                                      borderRadius: "8px",
                                      fontWeight: "bold",
                                      background: isUsed ? "#ccc" : "white",
                                      opacity: isUsed ? 0.6 : 1,
                                      cursor: isUsed ? "not-allowed" : "grab",
                                      width:"90px",
                                      display:"flex",
                                      justifyContent:"center",
                                      fontSize:"18px",
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

                    {/* Input */}
                    <Droppable droppableId={`blank-${q.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`CB-unit5-p6-q2-input ${
                            snapshot.isDraggingOver
                              ? "CB-unit5-p6-q2-drag-over"
                              : ""
                          }`}
                          style={{
                            minHeight: "40px",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            padding: "5px",
                          }}
                        >
                          {(userInputs[q.id] || "")
                            .split(" ")
                            .map((word, index) => {
                              if (!word) return null;

                              const key = `${q.id}-${index}`;

                              return (
                                <span
                                  key={key}
                                  onMouseEnter={() => setHoveredWord(key)}
                                  onMouseLeave={() => setHoveredWord(null)}
                                  onClick={() => {
                                    if (locked || showAnswer) return;

                                    const words = userInputs[q.id].split(" ");

                                    const updated = words.filter(
                                      (_, i) => i !== index,
                                    );

                                    setUserInputs((prev) => ({
                                      ...prev,
                                      [q.id]: updated.join(" "),
                                    }));
                                  }}
                                  style={{
                                    marginRight: "6px",
                                    cursor: locked ? "default" : "pointer",
                                    padding: "2px 6px",
                                    borderRadius: "6px",
                                    color:
                                      hoveredWord === key ? "red" : "black",
                                    transition: "0.2s",
                                  }}
                                >
                                  {word}
                                </span>
                              );
                            })}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {wrongInputs.includes(String(q.id)) && (
                      <span className="CB-unit5-p6-q2-error-mark">✕</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setLines([]);
              setUserInputs({
                1: "",
                2: "",
                3: "",
                4: "",
              });
              setWrongWords([]);
              setWrongInputs([]);
              setShowAnswer(false);
              setLocked(false);
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>

          <button
            onClick={() => {
              // 2️⃣ تعبئة جميع الإجابات الصحيحة في inputs
              setUserInputs({
                1: correctSentences["1"],
                2: correctSentences["2"],
                3: correctSentences["3"],
                4: correctSentences["4"],
              });

              // 3️⃣ منع التعديل على كل شيء (قفل inputs + منع الرسم)
              setLocked(true);
              setShowAnswer(true);
              setWrongWords([]);
              setWrongInputs([]);
            }}
            className="show-answer-btn swal-continue"
          >
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

export default Unit5_Page6_Q2;

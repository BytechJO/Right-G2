import React, { useState, useEffect, useRef } from "react";
// import "./WB_Unit1_Page4_Q1.css";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 4.svg";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page4_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const questions = [
    {
      id: 1,
      matchWord: "He is my father.",
      correctSentence: "who is he",
      scrambled: ["who", "he", "is"],
      image: img3,
    },
    {
      id: 2,
      matchWord: "She is my aunt.",
      correctSentence: "who is she",
      scrambled: ["who", "she", "is"],
      image: img1,
    },
    {
      id: 3,
      matchWord: "He is my brother.",
      correctSentence: "who is he",
      scrambled: ["who", "he", "is"],
      image: img4,
    },
    {
      id: 4,
      matchWord: "She is my sister.",
      correctSentence: "who is she",
      scrambled: ["who", "she", "is"],
      image: img2,
    },
  ];

  const correctMatches = questions.map((q) => ({
    word: q.matchWord,
    image: q.image,
  }));


  const correctSentences = Object.fromEntries(
    questions.map((q) => [q.id, q.correctSentence]),
  );

  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });



  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const [qId, word] = result.draggableId.split("-");
    const dest = result.destination.droppableId;

    if (!dest.startsWith("sentence-")) return;

    setUserInputs((prev) => ({
      ...prev,
      [qId]: [...prev[qId].filter((w) => w !== word), word],
    }));
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    // التحقق من إكمال جميع الجمل
    const allFilled = Object.values(userInputs).every((arr) => arr.length > 0);
    if (!allFilled) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    let sentenceCorrect = 0;
    let wrongInputsTemp = [];

    // حساب الدرجات من 4 (جمل الترتيب فقط)
    Object.keys(correctSentences).forEach((key) => {
      const userAnswer = userInputs[key].join(" ").toLowerCase();
      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) {
        sentenceCorrect++;
      } else {
        wrongInputsTemp.push(key);
      }
    });

    setWrongInputs(wrongInputsTemp);
    setLocked(true);

    const totalScore = 4;
    const userScore = sentenceCorrect;

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

  const handleRemoveWord = (qId, index) => {
    if (locked || showAnswer) return;
    setUserInputs((prev) => {
      const updated = [...prev[qId]];
      updated.splice(index, 1);
      return { ...prev, [qId]: updated };
    });
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
        <div className="div-forall" style={{gap:"25px"}}>
          <h4 className="WB-header-title-page8">
            <span className="WB-ex-A">C</span> Look, trace, read, and write.
          </h4>
         <div className="flex w-full gap-1 items-center">
            <div
              className="container12"
              // ref={containerRef}
               style={{
    position: "relative",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap:"15px"
  }}
            >
     
                {questions.map((q, i) => (
                  <div
                    className="CB-unit5-p6-q1-row"
                    key={q.id}
                    style={{ position: "relative",width:"100%",marginBottom:"10px" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <span className="CB-unit5-p6-q1-number">{q.id}</span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "60%",
                          // gap: "10px",
                        }}
                      >
                        {/* Word Bank */}
                        <Droppable
                          droppableId={`bank-${q.id}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="CB-unit5-p6-q1-word-bank flex gap-5"
                            >
                              {q.scrambled.map((word, i) => {
                                const isUsed = userInputs[q.id]?.includes(word);
                                return (
                                  <Draggable
                                    key={word}
                                    draggableId={`${q.id}-${word}`}
                                    index={i}
                                    isDragDisabled={
                                      locked || showAnswer || isUsed
                                    }
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="WB-word-bank flex items-center"
                                        style={{
                                          background: isUsed ? "#ccc" : "white",
                                          opacity: isUsed ? 0.6 : 1,
                                          cursor: isUsed
                                            ? "not-allowed"
                                            : "grab",
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

                        {/* Sentence Input Area */}
                        <div style={{ position: "relative" }}>
                          <Droppable
                            droppableId={`sentence-${q.id}`}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`CB-unit5-p6-q1-unscramble-input ${wrongInputs.includes(String(q.id)) ? "wrong-input" : ""}`}
                                style={{ position: "relative" }}
                              >
                                {userInputs[q.id]?.map((word, index) => (
                                  <span
                                    key={index}
                                    onClick={() =>
                                      handleRemoveWord(q.id, index)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      marginRight: "6px",
                                    }}
                                  >
                                    {word}
                                  </span>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>

                          {/* أيقونة الخطأ (X أبيض في دائرة حمراء) */}
                          {wrongInputs.includes(String(q.id)) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "-10px",
                                right: "16px",
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                zIndex: 10,
                                boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                                border: "2px solid white",
                              }}
                            >
                              ✕
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
           
             
            </div>
              {/* RIGHT MATCHING */}
                       <div
  className="flex justify-center items-stretch"
  style={{ width: "100%" }}
>
  <img
    src={img}
    alt="exercise"
    className="w-full h-full object-contain"
    style={{height:"100%" ,width:"100%"}}
  />
</div>
          </div>

          <div className="action-buttons-container">
            <button
              onClick={() => {
                const rect = containerRef.current.getBoundingClientRect();
                const getDotPosition = (selector) => {
                  const el = document.querySelector(selector);
                  if (!el) return { x: 0, y: 0 };
                  const r = el.getBoundingClientRect();
                  return { x: r.left - rect.left + 8, y: r.top - rect.top + 8 };
                };
                const initialLines = correctMatches.map((match) => ({
                  x1: getDotPosition(`[data-word="${match.word}"]`).x,
                  y1: getDotPosition(`[data-word="${match.word}"]`).y,
                  x2: getDotPosition(`[data-image="${match.image}"]`).x,
                  y2: getDotPosition(`[data-image="${match.image}"]`).y,
                  word: match.word,
                  image: match.image,
                }));
                setLines(initialLines);
                setUserInputs({ 1: [], 2: [], 3: [], 4: [] });
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
                const rect = containerRef.current.getBoundingClientRect();
                const getDotPosition = (selector) => {
                  const el = document.querySelector(selector);
                  if (!el) return { x: 0, y: 0 };
                  const r = el.getBoundingClientRect();
                  return { x: r.left - rect.left + 8, y: r.top - rect.top + 8 };
                };
                const finalLines = correctMatches.map((line) => ({
                  ...line,
                  x1: getDotPosition(`[data-word="${line.word}"]`).x,
                  y1: getDotPosition(`[data-word="${line.word}"]`).y,
                  x2: getDotPosition(`[data-image="${line.image}"]`).x,
                  y2: getDotPosition(`[data-image="${line.image}"]`).y,
                }));
                setLines(finalLines);
                setUserInputs({
                  1: correctSentences["1"].split(" "),
                  2: correctSentences["2"].split(" "),
                  3: correctSentences["3"].split(" "),
                  4: correctSentences["4"].split(" "),
                });
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
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page4_Q1;

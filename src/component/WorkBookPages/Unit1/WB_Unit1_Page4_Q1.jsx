import React, { useState, useEffect, useRef } from "react";
// import "./WB_Unit1_Page4_Q1.css";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex C 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page4_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
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
  const images = [img1, img2, img3, img4];
  const imgesWord = [
    "She is my aunt.",
    "She is my sister.",
    "He is my father.",
    "He is my brother.",
  ];
  const correctSentences = Object.fromEntries(
    questions.map((q) => [q.id, q.correctSentence]),
  );

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

  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const rect = containerRef.current.getBoundingClientRect();

    const word = e.target.dataset.word || null;
    const image = e.target.dataset.image || null;

    const alreadyUsed = lines.some((line) => line.word === word);
    if (alreadyUsed) return;

    setFirstDot({
      word,
      image,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return;
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const endWord = e.target.dataset.word || null;
    const endImage = e.target.dataset.image || null;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,
      word: firstDot.word || endWord,
      image: firstDot.image || endImage,
    };

    setLines((prev) => [...prev, newLine]);
    setFirstDot(null);
  };

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (!userInputs[1] || !userInputs[2] || !userInputs[3] || !userInputs[4]) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    if (lines.length < 4) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");
      return;
    }

    let sentenceCorrect = 0;
    let lineCorrect = 0;

    let wrongInputsTemp = [];

    Object.keys(correctSentences).forEach((key) => {
      const userAnswer = userInputs[key].join(" ").toLowerCase();

      const correctAnswer = correctSentences[key];

      if (userAnswer === correctAnswer) sentenceCorrect++;
      else wrongInputsTemp.push(key);
    });

    setWrongInputs(wrongInputsTemp);

    let wrongLines = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) lineCorrect++;
      else wrongLines.push(line.word);
    });

    const totalScore = 9;
    const userScore = sentenceCorrect + lineCorrect;

    setWrongWords([...wrongLines]);
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
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="page8-q1-container">
            <h4 className="WB-header-title-page8">
              <span className="WB-ex-A">C</span> Look, trace, read, and write.
            </h4>

            <div
              className="container12"
              ref={containerRef}
              // style={{ margin: "30px" }}
            >
              {/* الصف الأول */}
              {questions.map((q, i) => (
                <div className="CB-unit5-p6-q1-row" key={q.id}>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span className="CB-unit5-p6-q1-number">{q.id}</span>
                       <div style={{display:"flex",flexDirection:"column",width:"60%",gap:"10px"}}>
                    {/* Word Bank */}
                    <Droppable
                      droppableId={`bank-${q.id}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="CB-unit5-p6-q1-word-bank"
                        >
                          {q.scrambled.map((word, i) => {
                              const isUsed = userInputs[q.id]?.includes(word);
                            return(
                              <Draggable
                                key={word}
                                draggableId={`${q.id}-${word}`}
                                index={i}
                                isDragDisabled={locked || showAnswer || isUsed}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="CB-unit5-p6-q1-word-box"
                                    
                            style={{
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              ...provided.draggableProps.style,
                            }}
                                  >
                                    {word}
                                  </div>
                                )}
                              </Draggable>
                            )})}
                          {provided.placeholder}
                          {wrongWords.includes(q.matchWord) && (
                            <span className="CB-unit5-p6-q1-error-mark">✕</span>
                          )}
                        </div>
                      )}
                    </Droppable>

                    {/* Sentence */}
                    <Droppable
                      droppableId={`sentence-${q.id}`}
                      direction="horizontal"
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`CB-unit5-p6-q1-unscramble-input ${
                            snapshot.isDraggingOver
                              ? "CB-unit5-p6-q1-active-drop"
                              : ""
                          }`}
                        >
                          {userInputs[q.id].join(" ")}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    </div>
                    <div className="CB-unit5-p6-q1-dot-wrapper">
                      <div
                        className="CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-start"
                        id={`dot-word-${q.id}`}
                        data-word={q.matchWord}
                        onClick={handleStartDotClick}
                      />
                    </div>
                  </div>

                  {/* Image Side */}
                  <div className="CB-unit5-p6-q1-match-section">
                    <div className="CB-unit5-p6-q1-dot-wrapper">
                      <div
                        className="CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-end"
                        data-image={images[i]}
                        id={`dot-img-${q.id}`}
                        onClick={handleEndDotClick}
                      />
                    </div>

                    <img
                      src={images[i]}
                      className={`CB-unit5-p6-q1-matched-img ${
                        locked || showAnswer
                          ? "CB-unit5-p6-q1-disabled-word"
                          : ""
                      }`}
                      alt=""
                      onClick={() =>
                        document.getElementById(`dot-img-${q.id}`).click()
                      }
                    />
                    <h5>{imgesWord[i]}</h5>
                  </div>
                </div>
              ))}

              <svg className="lines-layer">
                {lines.map((line, i) => (
                  <line key={i} {...line} stroke="red" strokeWidth="3" />
                ))}
              </svg>
            </div>
          </div>

          <div className="action-buttons-container">
            <button
              onClick={() => {
                setLines([]);
                setUserInputs({
                  1: [],
                  2: [],
                  3: [],
                  4: [],
       
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
                const rect = containerRef.current.getBoundingClientRect();

                const getDotPosition = (selector) => {
                  const el = document.querySelector(selector);
                  if (!el) return { x: 0, y: 0 };
                  const r = el.getBoundingClientRect();
                  return {
                    x: r.left - rect.left + 8,
                    y: r.top - rect.top + 8,
                  };
                };

                // 1️⃣ إنشاء الخطوط الصحيحة
                const finalLines = correctMatches.map((line) => ({
                  ...line,
                  x1: getDotPosition(`[data-word="${line.word}"]`).x,
                  y1: getDotPosition(`[data-word="${line.word}"]`).y,
                  x2: getDotPosition(`[data-image="${line.image}"]`).x,
                  y2: getDotPosition(`[data-image="${line.image}"]`).y,
                }));

                setLines(finalLines);

                // 2️⃣ تعبئة جميع الإجابات الصحيحة في inputs
                setUserInputs({
                  1: correctSentences["1"].split(" "),
                  2: correctSentences["2"].split(" "),
                  3: correctSentences["3"].split(" "),
                  4: correctSentences["4"].split(" "),
               
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
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page4_Q1;

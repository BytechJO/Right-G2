import React, { useState, useEffect, useRef } from "react";
import "./Unit5_Page6_Q1.css";
import img1 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page 45/Ex D 5.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit5_Page6_Q1 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [activeSentence, setActiveSentence] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const questions = [
    {
      id: 1,
      matchWord: "likes / she / fruit",
      correctSentence: "she likes fruit",
      scrambled: ["likes", "she", "fruit"],
      image: img4,
    },
    {
      id: 2,
      matchWord: "don't like / I / meat",
      correctSentence: "I don't like meat",
      scrambled: ["don't", "like", "I", "meat"],
      image: img5,
    },
    {
      id: 3,
      matchWord: "doesn't like / she / stew",
      correctSentence: "she doesn't like stew",
      scrambled: ["doesn't", "like", "she", "stew"],
      image: img1,
    },
    {
      id: 4,
      matchWord: "like / you / fish",
      correctSentence: "you like fish",
      scrambled: ["like", "you", "fish"],
      image: img2,
    },
    {
      id: 5,
      matchWord: "doesn't like / he / chicken",
      correctSentence: "he doesn't like chicken",
      scrambled: ["doesn't", "like", "he", "chicken"],
      image: img3,
    },
  ];

  const correctMatches = questions.map((q) => ({
    word: q.matchWord,
    image: q.image,
  }));

  const images = [img1, img2, img3, img4, img5];

  const correctSentences = Object.fromEntries(
    questions.map((q) => [q.id, q.correctSentence]),
  );

  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
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

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const rect = containerRef.current.getBoundingClientRect();
    const word = e.target.dataset.word || null;
    const image = e.target.dataset.image || null;

    // 🔥 تحديد العنصر
    if (word) {
      setActiveSentence(word);
      setActiveImage(null);
    }

    if (image) {
      setActiveImage(image);
      setActiveSentence(null);
    }

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

  setLines((prev) => {
    const filteredLines = prev.filter(
      (line) => line.word !== newLine.word && line.image !== newLine.image
    );
    return [...filteredLines, newLine];
  });

  // ✅ هون الحل
  setActiveSentence(null);
  setActiveImage(null);

  setFirstDot(null);
};

  const checkAnswers = () => {
    if (showAnswer || locked) return;

    if (
      userInputs[1].length === 0 ||
      userInputs[2].length === 0 ||
      userInputs[3].length === 0 ||
      userInputs[4].length === 0 ||
      userInputs[5].length === 0
    ) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");
      return;
    }

    if (lines.length < 5) {
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

    const totalScore = 10; // 5 sentences + 5 lines
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
          padding: "30px",    marginBottom:"30px"
        }}
      >
        <div
          className="div-forall"
         style={{gap:"30px"}}
        >
         
            <h4 className="header-title-page8">
              <span className="ex-A">D</span> Unscramble and write. Then, match.
            </h4>
 <div className="page8-q1-container">
            <div className="container12" ref={containerRef}>
              {questions.map((q, i) => (
                <div className="CB-unit5-p6-q1-row" key={q.id}>
                  <div className="flex flex-col gap-2"style={{ width: "50%"}}>
                    <div className="CB-unit5-p6-q1-word-with-dot">
                     
<span className="CB-unit5-p6-q1-number mr-5">{q.id}</span>
                      <span
                        className={`
    CB-unit5-p6-q1-word-text
    ${locked || showAnswer ? "CB-unit5-p6-q1-disabled-word" : ""}
    transition-all duration-200

    ${activeSentence === q.matchWord ? "text-red-600 scale-110 underline" : ""}
  `}
                        onClick={() =>
                          document.getElementById(`dot-word-${q.id}`).click()
                        }
                        style={{ cursor: "pointer" }}
                      > 
                        {q.matchWord}
                      </span>

                      {wrongWords.includes(q.matchWord) && (
                        <span className="CB-unit5-p6-q1-error-mark">✕</span>
                      )}

                      <div className="CB-unit5-p6-q1-dot-wrapper">
                        <div
                          className={`
    CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-start
    transition-all duration-200

    ${activeSentence === q.matchWord ? "scale-150 bg-red-600" : ""}
  `}
                          id={`dot-word-${q.id}`}
                          data-word={q.matchWord}
                          onClick={handleStartDotClick}
                        />
                      </div>
                    </div>

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

                            return (
                              <Draggable
                                key={word}
                                draggableId={`${q.id}-${word}`}
                                index={i}
                                isDragDisabled={isUsed || locked}
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
                            );
                          })}
                          {provided.placeholder}
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
                          {userInputs[q.id].map((word, index) => {
                            const key = `${q.id}-${index}`;

                            return (
                              <span
                                key={key}
                                onMouseEnter={() => setHoveredWord(key)}
                                onMouseLeave={() => setHoveredWord(null)}
                                onClick={() => {
                                  if (locked || showAnswer) return;

                                  setUserInputs((prev) => ({
                                    ...prev,
                                    [q.id]: prev[q.id].filter(
                                      (_, i) => i !== index,
                                    ),
                                  }));
                                }}
                                style={{
                                  marginRight: "6px",
                                  cursor: locked ? "default" : "pointer",
                                  borderRadius: "6px",
                                  color: hoveredWord === key ? "red" : "black",
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
                  </div>

                  {/* Image Side */}
                  <div className="CB-unit5-p6-q1-match-section">
                    <div className="CB-unit5-p6-q1-dot-wrapper">
                      <div
                        className={`
    CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-end
    transition-all duration-200 z-9999

    ${activeImage === images[i] ? "scale-110 bg-red-600" : ""}
  `}
                        data-image={images[i]}
                        id={`dot-img-${q.id}`}
                        onClick={handleEndDotClick}
                      />
                    </div>

                    <img
                      src={images[i]}
                      className={`
    CB-unit5-p6-q1-matched-img
    ${locked || showAnswer ? "CB-unit5-p6-q1-disabled-word" : ""}
    transition-all duration-200

    ${
      activeImage === images[i]
        ? "scale-110 border-2 border-red-600 rounded-lg"
        : ""
    }
  `}
                      alt=""
                      onClick={() =>
                        document.getElementById(`dot-img-${q.id}`).click()
                      }
                    />
                  </div>
                </div>
              ))}

              <svg className="lines-layer">
                {lines.map((l, i) => (
                  <path
                    key={`${l.word}-${l.image}`}
                    d={`
    M ${l.x1} ${l.y1}
    C ${(l.x1 + l.x2) / 2} ${l.y1},
      ${(l.x1 + l.x2) / 2} ${l.y2},
      ${l.x2} ${l.y2}
  `}
                    stroke="red"
                    strokeWidth="3"
                    fill="none"
                  />
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
                  5: [],
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
                  5: correctSentences["5"].split(" "),
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

export default Unit5_Page6_Q1;

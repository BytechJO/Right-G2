import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WB_Unit1_Page3_Q2.css";

const WB_Unit1_Page3_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);
  const [locked, setLocked] = useState(false);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);
  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  // ========== حالات جديدة لتتبع العناصر المختارة ==========
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedWordDot, setSelectedWordDot] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageDot, setSelectedImageDot] = useState(null);

  const initialQuestions = [
    {
      id: 1,
      matchWord: "tisesr",
      correctSentence: "sister",
      scrambled: ["t", "i", "s", "e", "s", "r"].map((char, index) => ({
        id: `1-${char}-${index}`,
        value: char,
      })),
      image: img4,
    },
    {
      id: 2,
      matchWord: "aftreh",
      correctSentence: "father",
      scrambled: ["a", "f", "t", "r", "e", "h"].map((char, index) => ({
        id: `2-${char}-${index}`,
        value: char,
      })),
      image: img3,
    },
    {
      id: 3,
      matchWord: "lapy",
      correctSentence: "play",
      scrambled: ["l", "a", "p", "y"].map((char, index) => ({
        id: `3-${char}-${index}`,
        value: char,
      })),
      image: img1,
    },
    {
      id: 4,
      matchWord: "thomer",
      correctSentence: "mother",
      scrambled: ["t", "h", "o", "m", "e", "r"].map((char, index) => ({
        id: `4-${char}-${index}`,
        value: char,
      })),
      image: img2,
    },
  ];
  const correctMatches = [
    { word: "sister", image: "img2" },
    { word: "father", image: "img1" },
    { word: "play", image: "img3" },
    { word: "mother", image: "img4" },
  ];
  const [questionsState, setQuestionsState] = useState(
    initialQuestions.map((q) => ({
      ...q,
      currentLetters: [...q.scrambled],
    })),
  );

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const { source, destination, draggableId } = result;
    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (!sourceId.startsWith("bank-") || !destId.startsWith("sentence-"))
      return;

    const qId = destId.split("-")[1];
    if (!qId) return;

    const question = questionsState.find((q) => String(q.id) === String(qId));
    if (!question) return;

    const draggedItem = question.scrambled.find(item => item.id === draggableId);
    if (!draggedItem) return;

    setUserInputs((prev) => ({
      ...prev,
      [qId]: [...prev[qId], draggedItem],
    }));
  };

  // ========== معالج النقر على الكلمة من اليمين ==========
  const handleWordClick = (qId) => {
    if (locked || showAnswer) return;
    setSelectedWord(selectedWord === qId ? null : qId);
  };

  // ========== معالج النقر على النقطة الأولى (اليمين) ==========
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const rect = containerRef.current.getBoundingClientRect();
    const wordId = e.target.dataset.wordId;
    const qId = wordId.split("-")[1];

    // تأثير الانضغاط على النقطة
    setSelectedWordDot(selectedWordDot === qId ? null : qId);

    setFirstDot({
      wordId,
      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ========== معالج النقر على النقطة الثانية (اليسار) ==========
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return;
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();
    const endImage = e.target.dataset.image || null;
    const qId = endImage.replace("img", "");

    // تأثير الانضغاط على النقطة
    setSelectedImageDot(selectedImageDot === qId ? null : qId);

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,
      wordId: firstDot.wordId,
      image: endImage,
    };

    setLines((prev) => {
      const filteredLines = prev.filter(
        (line) => line.wordId !== newLine.wordId && line.image !== newLine.image
      );
      return [...filteredLines, newLine];
    });
    
    setFirstDot(null);
  };

  // ========== معالج النقر على الصورة من اليسار ==========
  const handleImageClick = (qId) => {
    if (locked || showAnswer) return;
    setSelectedImage(selectedImage === qId ? null : qId);
  };

  const checkAnswers2 = () => {
    if (showAnswer || locked) return;

    // تحديد الكلمات التي ترتيب حروفها خاطئ
    const wrongInputIds = [];
    questionsState.forEach((q) => {
      const currentInput = userInputs[q.id].map((item) => item.value).join("");
      if (currentInput !== q.correctSentence) {
        wrongInputIds.push(String(q.id));
      }
    });
    setWrongWords(wrongInputIds);

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair, index) =>
          `word-${index + 1}` === line.wordId && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.wordId);
      }
    });

    setWrongImages(wrong);

    const total = correctMatches.length;
    const color =
      correctCount === total && wrongInputIds.length === 0 ? "green" : (correctCount === 0 ? "red" : "orange");

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total && wrongInputIds.length === 0) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true);
  };

  const handleRemoveLetter = (qId, letterId) => {
    if (locked || showAnswer) return;

    setUserInputs((prev) => ({
      ...prev,
      [qId]: prev[qId].filter((item) => item.id !== letterId),
    }));
  };

  // مكون علامة الخطأ (X)
  const ErrorMark = () => (
    <div className="absolute -top-2 -right-2 z-20 flex items-center justify-center w-6 h-6 bg-red-500 border-2 border-white rounded-full shadow-md">
      <span className="text-white text-xs font-bold">✕</span>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall mb-10" style={{gap:"20px"}}>
          <h5 className="WB-header-title-page8">
            <span className="mr-5 WB-ex-A">B</span>
            Read and match.
          </h5>

          <div
            className="CB-review3-p1-q2-wrapper relative w-full min-h-96"
            ref={containerRef}
          >
            <div className="flex flex-col gap-5 w-full">
              {questionsState.map((q, i) => (
                <div
                  key={q.id}
                  className="flex flex-row gap-4 items-center justify-between w-full"
                >
                  <div className="flex items-center w-[100%]">
                    <div className="flex flex-col gap-3 items-start w-70">
                      <div className="flex flex-row items-center gap-2 whitespace-nowrap flex-shrink-0 relative">
                        <span className="flex items-center justify-center w-7 h-7 text-xl font-bold">
                          {q.id}
                        </span>

                        <span
                          className={`text-base font-bold letter-spacing-1  transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            locked || showAnswer
                              ? "opacity-60 cursor-not-allowed"
                              : "text-gray-800 hover:text-red-600 hover:underline cursor-pointer"
                          } ${
                            selectedWord === q.id
                              ? "scale-125 text-red-600 font-bold underline decoration-red-600 decoration-2 underline-offset-2"
                              : ""
                          }`}
                          onClick={() => {
                            handleWordClick(q.id);
                            document.getElementById(`dot-word-${q.id}`).click();
                          }}
                        >
                          {q.matchWord}
                        </span>
                        
                        {/* علامة الخطأ فوق الكلمة إذا كان التوصيل خاطئاً */}
                        {locked && wrongImages.includes(`word-${q.id}`) && <ErrorMark />}
                      </div>

                      <Droppable
                        droppableId={`bank-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex flex-row gap-2 flex-wrap"
                          >
                            {q.scrambled.map((letterObj, i) => {
                              const isUsed = userInputs[q.id]?.some(
                                (item) => item.id === letterObj.id,
                              );
                              return (
                                <Draggable
                                  key={letterObj.id}
                                  draggableId={letterObj.id}
                                  isDragDisabled={locked || isUsed }
                                  index={i}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`flex items-center justify-center w-8 h-8 border-1 border-gray-300 rounded text-lg font-bold transition-all touch-none ${
                                        isUsed ||showAnswer
                                          ? "bg-gray-400 opacity-60 cursor-not-allowed"
                                          : "bg-white cursor-grab hover:border-blue-900 hover:shadow-md"
                                      }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {letterObj.value}
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <Droppable
                        droppableId={`sentence-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div className="relative w-full">
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex flex-row gap-1 p-2 h-8 items-center transition-all flex-wrap w-full ${
                                snapshot.isDraggingOver
                                  ? "bg-blue-100 border-b-2 border-blue-600 shadow-md"
                                  : "bg-white border-b-2 border-gray-300"
                              }`}
                            >
                              {userInputs[q.id]?.map((item, index) => (
                                <span
                                  key={item.id}
                                  onClick={() =>
                                    handleRemoveLetter(q.id, item.id)
                                  }
                                  className="flex items-center justify-center w-2 h-7 text-xl text-black cursor-pointer transition-all hover:text-red-500 hover:border-red-600 flex-shrink-0"
                                >
                                  {item.value}
                                </span>
                              ))}
                              {provided.placeholder}
                            </div>
                            {/* علامة الخطأ فوق حقل الإدخال إذا كان الترتيب خاطئاً */}
                            {locked && wrongWords.includes(String(q.id)) && <ErrorMark />}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    <div className="flex items-end justify-start w-8 h-8 flex-shrink-0">
                      <div
                        className={`rounded-full cursor-pointer transition-all shadow-md ${
                          selectedWordDot === q.id.toString()
                            ? "w-5 h-5 bg-red-600 shadow-xl scale-125"
                            : "w-3.5 h-3.5 bg-red-600 hover:w-5 hover:h-5 hover:shadow-lg"
                        }`}
                        id={`dot-word-${q.id}`}
                        data-word-id={`word-${q.id}`}
                        onClick={handleStartDotClick}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row gap-3 items-center justify-end flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                      <div
                        className={`rounded-full cursor-pointer transition-all shadow-md ${
                          selectedImageDot === q.id.toString()
                            ? "w-5 h-5 bg-red-600 shadow-xl scale-125"
                            : "w-3.5 h-3.5 bg-red-600 hover:w-5 hover:h-5 hover:shadow-lg"
                        }`}
                        data-image={`img${q.id}`}
                        id={`img${q.id}-dot`}
                        onClick={handleEndDotClick}
                      />
                    </div>

                    <div
                      className={`flex items-center justify-center flex-shrink-0 w-40 transition-all ${
                        selectedImage === q.id
                          ? "scale-95 border-2 border-red-600 rounded-lg shadow-xl"
                          : "border-2 border-gray-300 rounded-lg"
                      }`}
                    >
                      <img
                        src={q.image}
                        alt=""
                        className={`object-contain transition-all ${
                          locked || showAnswer
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:scale-105 hover:brightness-110"
                        }`}
                        onClick={() => {
                          handleImageClick(q.id);
                          document.getElementById(`img${q.id}-dot`).click();
                        }}
                        style={{ height: "120px", width: "auto" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <svg className="lines-layer absolute top-0 left-0 w-full h-full pointer-events-none z-10">
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="red"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="action-buttons-container mt-8">
          <button
            onClick={() => {
              setLines([]);
              setWrongImages([]);
              setFirstDot(null);
              setShowAnswer(false);
              setLocked(false);
              setSelectedWord(null);
              setSelectedWordDot(null);
              setSelectedImage(null);
              setSelectedImageDot(null);
              setWrongWords([]);
              setUserInputs({
                1: [],
                2: [],
                3: [],
                4: [],
              });
              setQuestionsState(
                initialQuestions.map((q) => ({
                  ...q,
                  currentLetters: [...q.scrambled],
                })),
              );
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

              const finalLines = correctMatches.map((line, index) => ({
                x1: getDotPosition(`[data-word-id="word-${index + 1}"]`).x,
                y1: getDotPosition(`[data-word-id="word-${index + 1}"]`).y,
                x2: getDotPosition(`[data-image="${line.image}"]`).x,
                y2: getDotPosition(`[data-image="${line.image}"]`).y,
                wordId: `word-${index + 1}`,
                image: line.image,
              }));

              const solvedInputs = {};
              initialQuestions.forEach((q) => {
                solvedInputs[q.id] = q.correctSentence
                  .split("")
                  .map((char, index) => ({
                    id: `answer-${q.id}-${char}-${index}`,
                    value: char,
                  }));
              });
setLocked(true);
              setUserInputs(solvedInputs);
              setLines(finalLines);
              setWrongImages([]);
              setWrongWords([]);
              setShowAnswer(true);
              
            }}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers2} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page3_Q2;
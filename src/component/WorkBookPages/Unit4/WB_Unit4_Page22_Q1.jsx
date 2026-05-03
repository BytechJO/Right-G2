import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page22/Ex C 8.svg";

const WB_Unit4_Page22_Q1 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [lines, setLines] = useState([]);

  const data = {
    questions: [
      {
        id: 1,
        correct: "He is a pilot",
        text: "pilot he a is",
        img: img5,
      },
      {
        id: 2,
        correct: "I am a clerk",
        text: "a clerk I am",
        img: img6,
      },
      {
        id: 3,
        correct: "He is a photographer",
        text: "photographer a is he",
        img: img7,
      },
      {
        id: 4,
        correct: "You are a vet",
        text: "are vet you a",
        img: img8,
      },
    ],
    answers: [
      { id: 1, img: img1 },
      { id: 2, img: img2 },
      { id: 3, img: img3 },
      { id: 4, img: img4 },
    ],
  };

  const correctMatches = { 1: 3, 2: 1, 3: 4, 4: 2 };

  const buildInitialWords = () => {
    const state = {};
    data.questions.forEach((q) => {
      const words = q.text.split(" ");

      state[`bank-${q.id}`] = words.map((word, i) => ({
        id: `${q.id}-${i}`,
        text: word,
      }));

      state[`answer-${q.id}`] = [];
    });
    return state;
  };

  const [items, setItems] = useState(buildInitialWords());

const onDragEnd = (result) => {
  const { source, destination } = result;
  if (!destination) return;

  setItems((prev) => {
    const newState = { ...prev };

    const sourceList = Array.from(newState[source.droppableId]);
    const destList = Array.from(newState[destination.droppableId]);

    const movedItem = sourceList[source.index];

    // نفس المكان
    if (source.droppableId === destination.droppableId) {
      return prev;
    }

    // ❗ لا تحذف من البنك
    // بس تأكد ما تنضاف مرتين
    const alreadyExists = destList.some((w) => w.id === movedItem.id);

    if (!alreadyExists) {
      destList.push(movedItem);
    }

    newState[destination.droppableId] = destList;

    return newState;
  });
};

  const handleLeftClick = (id) => setSelectedLeft(id);

  const handleRightClick = (id) => {
    if (!selectedLeft || showResults) return;

    setMatches((prev) => {
      const newMatches = { ...prev };

      // ❗ احذف أي left مربوط بهاي right (منع التكرار)
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === id) {
          delete newMatches[key];
        }
      });

      // ❗ حط الربط الجديد (سواء كان موجود أو لا)
      newMatches[selectedLeft] = id;

      return newMatches;
    });

    setSelectedLeft(null);
  };
  useEffect(() => {
    const newLines = [];

    Object.keys(matches).forEach((leftId) => {
      const rightId = matches[leftId];

      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];

      if (leftEl && rightEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        newLines.push({
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        });
      }
    });

    setLines(newLines);
  }, [matches]);

  const isWrongSentence = (qId) => {
    if (!showResults) return false;

    const question = data.questions.find((q) => q.id === qId);
    if (!question) return false;

    const userSentence = items[`answer-${qId}`]
      .map((w) => w.text)
      .join(" ")
      .toLowerCase()
      .trim();

    if (!userSentence) return false;

    return userSentence !== question.correct.toLowerCase().trim();
  };

  const isWrongMatch = (leftId) => {
    if (!showResults) return false;
    if (!matches[leftId]) return false;

    return matches[leftId] !== correctMatches[leftId];
  };

  const checkAnswers = () => {
    if (showResults) return;
    const allSentencesFilled = data.questions.every(
      (q) => items[`answer-${q.id}`].length > 0,
    );

    if (!allSentencesFilled) {
      ValidationAlert.info("Please complete all sentences first.");
      return;
    }

    const allMatchesConnected = data.answers.every((a) => matches[a.id]);

    if (!allMatchesConnected) {
      ValidationAlert.info("Please complete all matches first.");
      return;
    }

    let sentenceScore = 0;
    let matchScore = 0;

    data.questions.forEach((q) => {
      const sentence = items[`answer-${q.id}`]
        .map((w) => w.text)
        .join(" ")
        .toLowerCase()
        .trim();

      if (sentence === q.correct.toLowerCase().trim()) {
        sentenceScore++;
      }

      if (matches[q.id] === correctMatches[q.id]) {
        matchScore++;
      }
    });

    const score = sentenceScore + matchScore;
    const total = data.questions.length * 2;

    setShowResults(true);

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    }
  };

 const handleShowAnswer = () => {
  const filled = {};

  data.questions.forEach((q) => {
    const words = q.text.split(" ");

    // ✅ رجّع البنك زي ما كان
    filled[`bank-${q.id}`] = words.map((word, i) => ({
      id: `${q.id}-${i}`,
      text: word,
    }));

    // ✅ حط الجواب الصح
    filled[`answer-${q.id}`] = q.correct.split(" ").map((w, idx) => ({
      id: `ans-${q.id}-${idx}`,
      text: w,
    }));
  });

  setItems(filled);
  setMatches(correctMatches);
  setShowResults(true);
};

  const handleStartAgain = () => {
    setItems(buildInitialWords());
    setMatches({});
    setShowResults(false);
  };
  const usedWordsPerQuestion = (qId) => {
    return items[`answer-${qId}`] || [];
  };
const returnWordToBank = (qId, wordIndex) => {
  setItems((prev) => {
    const newState = { ...prev };

    const answerKey = `answer-${qId}`;
    const answerList = Array.from(newState[answerKey]);

    // احذف من الجملة فقط
    answerList.splice(wordIndex, 1);

    newState[answerKey] = answerList;

    return newState;
  });
};
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"30px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Look, unscramble, and write. Match.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div
            ref={containerRef}
            className="flex justify-between w-full relative"
          >
            {/* LEFT */}
            <div className="flex flex-col items-start justify-center space-y-8 w-80">
              {data.answers.map((a) => (
                <div key={a.id} className="flex items-center gap-4 relative">
                  <span>{a.id}</span>
                  <img
                    src={a.img}
                    onClick={() => handleLeftClick(a.id)}
                    className={`w-12 h-12 rounded-full cursor-pointer transition
    ${
      selectedLeft === a.id
        ? "ring-4 ring-red-600 scale-105"
        : "hover:scale-105"
    }
  `}
                    style={{ height: "90px", width: "90px" }}
                  />
                  <div
                    ref={(el) => (leftRefs.current[a.id] = el)}
                    onClick={() => handleLeftClick(a.id)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition
    ${
      selectedLeft === a.id
        ? "bg-red-600 scale-125 ring-4 ring-red-600"
        : "bg-red-500 hover:scale-110"
    }
  `}
                  />

                  {isWrongMatch(a.id) && (
                    <span className="absolute -top-2 -right-6 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex-1 space-y-5.5">
              {data.questions.map((q) => (
                <div key={q.id}>
                  <div className="flex items-center gap-3">
                    <div
                      ref={(el) => (rightRefs.current[q.id] = el)}
                      onClick={() => handleRightClick(q.id)}
                      className={`w-[4%] h-4 rounded-full cursor-pointer transition
    ${
      Object.values(matches).includes(q.id)
        ? "bg-red-600 scale-105"
        : "bg-red-500 hover:scale-125"
    }
  `}
                    />

                    <img
                      src={q.img}
                      onClick={() => handleRightClick(q.id)}
                      className={`w-12 h-12 rounded-full cursor-pointer transition
    ${Object.values(matches).includes(q.id) ? "scale-105" : "hover:scale-125 active:ring-4 active:ring-red-600 "}
  `}
                      style={{ height: "90px", width: "90px" }}
                    />

                    <div className="flex flex-col w-[90%]">
                      {/* WORD BANK */}
                      <Droppable
                        droppableId={`bank-${q.id}`}
                        type={`group-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex items-center justify-start gap-2 mt-2 rounded p-2 min-h-[52px]"
                          >
                            {items[`bank-${q.id}`].map((word, i) => {
                              const isUsed = usedWordsPerQuestion(q.id).some(
                                (w) => w.id === word.id,
                              );

                              return (
                                <Draggable
                                  key={word.id}
                                 draggableId={`bank-${q.id}-${word.id}`}
                                  index={i}
                                  isDragDisabled={isUsed || showResults} // 🔒
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`WB-word-bank 
            ${
              isUsed || showResults
                ? "text-gray-400 border border-blue-900 cursor-not-allowed opacity-60"
                : "bg-gray-200 text-black cursor-grab border border-blue-900"
            }`}
            style={{padding:"1px 14px"}}
                                    >
                                      {word.text}
                                    </span>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* sentence drop */}
                      <Droppable
                        droppableId={`answer-${q.id}`}
                        type={`group-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="relative min-h-[40px] w-50 border-b-2 border-gray-400 flex w-full"
                          >
                            {items[`answer-${q.id}`].map((word, i) => (
                              <Draggable
                                key={word.id}
                                draggableId={word.id}
                                index={i}
                                isDragDisabled={true}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => {
                                      if (!showResults)
                                        returnWordToBank(q.id, i);
                                    }}
                                    className={`px-2 py-1 rounded transition
  ${!showResults ? "cursor-pointer hover:text-red-500" : "opacity-60 cursor-not-allowed"}
`}
                                  >
                                    {word.text}
                                  </span>
                                )}
                              </Draggable>
                            ))}

                            {isWrongSentence(q.id) && (
                              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                                ✕
                              </span>
                            )}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LINES */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {lines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="red"
                  strokeWidth="2"
                />
              ))}
            </svg>
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

export default WB_Unit4_Page22_Q1;

import React, { useMemo, useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import sound from "../../../assets/audio/WorkBook/titel G2/Unit 2.mp3";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex B 1.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const conversations = [
  {
    id: "conv1",
    audioSrc: "/audio/conversation1.mp3",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where's my ",
          { id: "c1_1", correct: "y" },
          "o-",
          { id: "c1_2", correct: "y" },
          "o, John?",
        ],
      },
      { speaker: "John", text: ["Which one?"] },
      {
        speaker: "Stella",
        text: [
          "The ",
          { id: "c1_3", correct: "y" },
          "ellow one. It's ",
          { id: "c1_4", correct: "y" },
          "ellow like a banana.",
        ],
      },
      {
        speaker: "John",
        text: ["Oh yes! Here ", { id: "c1_5", correct: "y" }, "ou are."],
      },
    ],
  },
  {
    id: "conv2",
    audioSrc: "/audio/conversation2.mp3",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where are my ",
          { id: "c2_1", correct: "j" },
          "eans, ",
          { id: "c2_2", correct: "J" },
          "ohn?",
        ],
      },
      { speaker: "John", text: ["Which ones?"] },
      {
        speaker: "Stella",
        text: [
          "The blue ones that I bought with the red ",
          { id: "c2_3", correct: "j" },
          "acket?",
        ],
      },
      {
        speaker: "John",
        text: ["Here ", { id: "c2_4", correct: "y" }, "ou are."],
      },
    ],
  },
];

const buildInitialState = () => {
  const state = {
    wordBank: [
      { id: "bank_y", text: "y" },
      { id: "bank_j", text: "j" },
    ],
  };

  conversations.forEach((conv) => {
    conv.lines.forEach((line) => {
      line.text.forEach((part) => {
        if (typeof part === "object") {
          state[part.id] = [];
        }
      });
    });
  });

  return state;
};

const WB_Unit3_Page20_Q2 = () => {
  const initialState = useMemo(() => buildInitialState(), []);
  const [items, setItems] = useState(initialState);
  const [showResults, setShowResults] = useState(false);

  const stopAtSecond = 9;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];

  const allBlanks = useMemo(() => {
    const blanks = [];
    conversations.forEach((conv) => {
      conv.lines.forEach((line) => {
        line.text.forEach((part) => {
          if (typeof part === "object") blanks.push(part);
        });
      });
    });
    return blanks;
  }, []);

  const normalize = (text) => text?.trim().toLowerCase();

  const isWrongAnswer = (blankId, correctLetter) => {
    if (!showResults) return false;
    const dropped = items[blankId]?.[0]?.text;
    if (!dropped) return false;

    return normalize(dropped) !== normalize(correctLetter);
  };

  const onDragEnd = (result) => {
      if (showResults) return; // ✅ يمنع أي سحب
    const { source, destination } = result;
    if (!destination) return;

    setShowResults(false);

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setItems((prev) => {
      const newState = { ...prev };

      // إذا السحب من wordBank إلى فراغ: نعمل clone
      if (
        source.droppableId === "wordBank" &&
        destination.droppableId !== "wordBank"
      ) {
        const sourceItem = prev.wordBank[source.index];
        const destList = Array.from(newState[destination.droppableId]);

        const clonedItem = {
          id: `${sourceItem.text}_${destination.droppableId}_${Date.now()}`,
          text: sourceItem.text,
        };

        destList.splice(0, destList.length, clonedItem);
        newState[destination.droppableId] = destList;
        return newState;
      }

      // إذا من فراغ إلى wordBank: نحذف من الفراغ فقط
      if (
        source.droppableId !== "wordBank" &&
        destination.droppableId === "wordBank"
      ) {
        newState[source.droppableId] = [];
        return newState;
      }

      // إذا من فراغ إلى فراغ
      if (
        source.droppableId !== "wordBank" &&
        destination.droppableId !== "wordBank"
      ) {
        const sourceList = Array.from(newState[source.droppableId]);
        const destList = Array.from(newState[destination.droppableId]);
        const [movedItem] = sourceList.splice(source.index, 1);

        destList.splice(0, destList.length, movedItem);

        newState[source.droppableId] = sourceList;
        newState[destination.droppableId] = destList;
        return newState;
      }

      return newState;
    });
  };

  const handleShowAnswer = () => {
    const filledAnswers = {
      wordBank: [
        { id: "bank_y", text: "y" },
        { id: "bank_j", text: "j" },
      ],
    };

    allBlanks.forEach((blank, index) => {
      filledAnswers[blank.id] = [
        {
          id: `ans_${index + 1}`,
          text: blank.correct,
        },
      ];
    });

    setItems(filledAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setItems(initialState);
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const allFilled = allBlanks.every(
      (blank) => items[blank.id] && items[blank.id].length > 0,
    );

    if (!allFilled) {
      ValidationAlert.info("Please fill all blanks first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = allBlanks.length;

    allBlanks.forEach((blank) => {
      if (normalize(items[blank.id][0]?.text) === normalize(blank.correct)) {
        score++;
      }
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span> Listen and drag the missing
          letters.
        </h1>
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <div className="p-2 border-2 border-gray-400 border-dashed rounded-xl bg-gray-50">
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center items-center gap-3 min-h-[42px]"
                >
                  {items.wordBank.map((letter, index) => (
                    <Draggable
                      key={letter.id}
                      draggableId={letter.id}
                      index={index}
                      isDragDisabled={showResults}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg shadow-sm cursor-grab ${
                            snapshot.isDragging ? "rotate-2" : ""
                          }`}
                        >
                          {letter.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 mt-2">
            <img
              src={placeholderImg}
              alt="conversation"
              className="max-w-50 max-h-48 rounded-lg shadow-md mx-auto md:mx-0 mt-25"
            />

            <div className="space-y-6">
              {conversations.map((conv, index) => (
                <div key={conv.id}>
                  {conv.lines.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-lg leading-10 flex flex-wrap items-center"
                    >
                      <span className="font-bold w-20 inline-block">
                        {line.speaker}:
                      </span>

                      {line.text.map((part, partIndex) =>
                        typeof part === "string" ? (
                          <span key={partIndex}>{part}</span>
                        ) : (
                          <Droppable key={part.id} droppableId={part.id} isDropDisabled={showResults}>
                            {(provided, snapshot) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`relative inline-flex align-middle mx-1 w-8 h-9 items-center justify-center border-b-2 font-bold transition-all
        ${
          snapshot.isDraggingOver
            ? "border-blue-500 bg-blue-100 scale-110"
            : "border-gray-400"
        }
        ${isWrongAnswer(part.id, part.correct) ? "border-red-500" : "border-gray-400"}
      `}
                              >
                                {items[part.id].map((letter, index) => (
                                  <Draggable
                                    key={letter.id}
                                    draggableId={letter.id}
                                    index={index}
                                    isDragDisabled={true}
                                  >
                                    {(provided) => (
                                      <span
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-red-600 font-bold"
                                      >
                                        {letter.text}
                                      </span>
                                    )}
                                  </Draggable>
                                ))}

                                {isWrongAnswer(part.id, part.correct) && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg">
                                    ✕
                                  </span>
                                )}

                                {provided.placeholder}
                              </span>
                            )}
                          </Droppable>
                        ),
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page20_Q2;

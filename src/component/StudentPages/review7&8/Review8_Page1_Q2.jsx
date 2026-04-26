import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

const items = [
  {
    sentence: "He has four pairs of",
    scrambled: ["neerg", "strohs"],
    correct: ["green", "shorts"],
  },
  {
    sentence: "She has five pairs of",
    scrambled: ["lube", "skcos"],
    correct: ["blue", "socks"],
  },
  {
    sentence: "They have nine",
    scrambled: ["kcalb", "stekcaj"],
    correct: ["black", "jackets"],
  },
  {
    sentence: "You have six",
    scrambled: ["etihw", "seit"],
    correct: ["white", "ties"],
  },
  {
    sentence: "I have three",
    scrambled: ["knip", "sesserd"],
    correct: ["pink", "dresses"],
  },
];

export default function Review8_Page1_Q3() {
  const [answers, setAnswers] = useState(items.map(() => ["", ""]));
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [usedLetterIds, setUsedLetterIds] = useState([]);
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const parts = draggableId.split("-");
    const letter = parts[1];
    const sourceQ = parts[2];
    const sourceWord = parts[3];

    const id = draggableId.replace("letter-", "");

    const [qIndex, wordIndex] = destination.droppableId.split("-").slice(1);

    if (sourceQ !== qIndex || sourceWord !== wordIndex) return;

    if (usedLetterIds.includes(id)) return;

    const updated = [...answers];

    if (
      updated[qIndex][wordIndex].length >=
      items[qIndex].correct[wordIndex].length
    )
      return;

    updated[qIndex][wordIndex] += letter;

    setAnswers(updated);
    setUsedLetterIds((prev) => [...prev, id]);
  };
  const removeLetter = (qIndex, wordIndex, letterIndex) => {
    if (locked) return;

    const updated = [...answers];
    const word = updated[qIndex][wordIndex];

    const newWord = word.slice(0, letterIndex) + word.slice(letterIndex + 1);

    updated[qIndex][wordIndex] = newWord;

    // لازم كمان نحذف من usedLetterIds
    const letter = word[letterIndex];

    const idToRemove = usedLetterIds.find((id) =>
      id.startsWith(`${letter}-${qIndex}-${wordIndex}`),
    );

    setAnswers(updated);
    setUsedLetterIds((prev) => prev.filter((id) => id !== idToRemove));
  };
  const resetAll = () => {
    setAnswers(items.map(() => ["", ""]));
    setUsedLetterIds([]); // ✅ مهم
    setLocked(false);
    setShowResult(false);
  };

  const showAnswers = () => {
    setAnswers(items.map((item) => item.correct));
    setLocked(true);
    setShowResult(true);
  };

  const checkAnswers = () => {
    if (locked) return;

    const empty = answers.some((row) => row.some((word) => word === ""));

    if (empty) {
      ValidationAlert.info("Please complete all answers.");
      return;
    }

    let score = 0;

    answers.forEach((row, i) => {
      if (row.join(" ") === items[i].correct.join(" ")) {
        score++;
      }
    });

    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setShowResult(true);
    setLocked(true);
  };
  const usedLetters = answers.flatMap((row) => row.join("").split(""));
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>B</span>
            Unscramble the words and write the sentences.
          </h5>
    <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="mb-8 mt-4">
              <div className="flex gap-4 flex-col">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl w-5">{i + 1}</span>
                  <span className="text-xl">
                    {item.sentence} {item.scrambled[0]} {item.scrambled[1]}
                  </span>
                </div>
                {/* الكلمات */}
                <div className="flex gap-8 mt-3 ml-8">
                  {item.scrambled.map((word, wordIndex) => {
                    const letters = word.split("");
                    const dropId = `slot-${i}-${wordIndex}`;

                    return (
                      <div
                        key={wordIndex}
                        className="flex flex-col items-center gap-2"
                      >
                        {/* 🔤 الحروف */}
                        <Droppable
                          droppableId={`bank-${i}-${wordIndex}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="flex gap-1"
                            >
                              {letters.map((letter, letterIndex) => {
                                const id = `${letter}-${i}-${wordIndex}-${letterIndex}`;

                                const isUsed = usedLetterIds.includes(id);
                                return (
                                  <Draggable
                                    key={id}
                                    draggableId={`letter-${id}`}
                                    index={letterIndex}
                                    isDragDisabled={locked || isUsed}
                                  >
                                    {(provided) => (
                                      <span
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`
  w-9 h-9 text-xl flex items-center justify-center rounded border-2 border-gray-500
  ${
    isUsed
      ? "bg-gray-300 cursor-not-allowed opacity-50"
      : "bg-white cursor-grab"
  }
`}
                                      >
                                        {letter}
                                      </span>
                                    )}
                                  </Draggable>
                                );
                              })}

                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {/* ✏️ input */}
                     
                        <Droppable droppableId={dropId}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`w-[100%] h-10 relative border-0 border-b-2 border-black px-3 py-2 text-lg text-center
  ${
    answers[i][wordIndex] === item.correct[wordIndex]
      ? "border-black"
      : showResult
        ? "border-red-500"
        : "border-gray-500"
  }
`}
                            >
                              {answers[i][wordIndex]
                                .split("")
                                .map((char, idx) => (
                                  <span
                                    key={idx}
                                    onClick={() =>
                                      removeLetter(i, wordIndex, idx)
                                    }
                                    className="cursor-pointer hover:text-red-500"
                                  >
                                    {char}
                                  </span>
                                ))}
                              {showResult &&
                                answers[i][wordIndex] !==
                                  item.correct[wordIndex] && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white">
                                    ✕
                                  </div>
                                )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable></div>
                      
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 ml-8">
                <div className="w-full max-w-[500px] border-2 border-gray-500 rounded-lg px-3 py-3 text-lg flex gap-2 flex-wrap items-center">

  <span>{item.sentence}</span>

  {item.correct.map((word, wordIndex) => (
    <span
      key={wordIndex}
      className="min-w-[80px] h-[30px] border-b-2 border-gray-600 text-center px-2"
    >
      {answers[i][wordIndex]}
    </span>
  ))}

</div>
              </div>
            </div>
          ))}
</div>
          {/* buttons */}
          <div className="action-buttons-container">
            <button className="try-again-button" onClick={resetAll}>
              Start Again ↻
            </button>

            <button onClick={showAnswers} className="show-answer-btn">
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

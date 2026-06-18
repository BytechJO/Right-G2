import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 39/Ex B 4.svg";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
const exerciseDataL = {
  sentences: [
    {
      id: "l1",
      correctSentence: "It's eight thirty.",
      words: ["eight", "It's", "thirty."],
    },
    {
      id: "l2",
      correctSentence: "It's four o'clock.",
      words: ["four", "It's", "o'clock."],
    },
    {
      id: "l3",
      correctSentence: "It's a quarter past two.",
      words: ["quarter", "two.", "It's", "a", "past"],
    },
    {
      id: "l4",
      correctSentence: "It's a quarter to two.",
      words: ["two.", "quarter", "It's", "a", "to"],
    },
  ],
};

const DraggableWord = ({
  word,
  sentenceId,
  index,
  used,
  showResults,
  onReturn,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${sentenceId}-${index}-${word}`,
    data: {
      word,
      sentenceId,
    },
    disabled: used || showResults,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px,0)`
      : undefined,
    touchAction: "none",
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => {
        if (onReturn) onReturn();
      }}
      className={`WB-word-bank
      ${
        used
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
          : "border-2 border-blue-900 hover:bg-gray-300 cursor-grab"
      }`}
    >
      {word}
    </button>
  );
};

const DropZone = ({ id, children, isWrong }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-8 border-b-2 p-2 w-80
      ${isWrong ? "border-red-500" : "border-gray-500"}
      ${isOver ? "bg-blue-50" : ""}
    `}
    >
      {children}
    </div>
  );
};
const WB_Unit7_Page39_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const images = [img1, img2, img3, img4];

  const handleDragStart = (event) => {
    setActiveItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over || showResults) return;

    const { word, sentenceId } = active.data.current;

    if (over.id !== sentenceId) return;

    const currentAnswer = userAnswers[sentenceId] || [];

    if (currentAnswer.includes(word)) return;

    const sentence = exerciseDataL.sentences.find((s) => s.id === sentenceId);

    if (!sentence) return;

    if (currentAnswer.length >= sentence.words.length) return;

    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: [...currentAnswer, word],
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnBlank = (sentenceId) => {
    if (!draggedWord || draggedWord.sentenceId !== sentenceId || showResults) {
      return;
    }

    const currentAnswer = userAnswers[sentenceId] || [];

    // 🔒 منع التكرار
    if (currentAnswer.includes(draggedWord.word)) {
      setDraggedWord(null);
      return;
    }

    const sentence = exerciseDataL.sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;

    if (currentAnswer.length >= sentence.words.length) {
      setDraggedWord(null);
      return;
    }

    const newAnswer = [...currentAnswer, draggedWord.word];

    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: newAnswer,
    }));

    setDraggedWord(null);
  };

  const handleRemoveWord = (sentenceId, index) => {
    if (showResults) return;

    const currentAnswer = userAnswers[sentenceId] || [];
    const newAnswer = currentAnswer.filter((_, i) => i !== index);

    setUserAnswers((prev) => ({
      ...prev,
      [sentenceId]: newAnswer,
    }));
  };

  const isSentenceComplete = (sentence) => {
    return (userAnswers[sentence.id] || []).length === sentence.words.length;
  };

  const checkAnswers = () => {
    if (showResults) return;
    const incomplete = exerciseDataL.sentences.filter(
      (sentence) => !isSentenceComplete(sentence),
    );

    if (incomplete.length > 0) {
      ValidationAlert.warning(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = exerciseDataL.sentences.length;

    exerciseDataL.sentences.forEach((sentence) => {
      const userSentence = (userAnswers[sentence.id] || []).join(" ").trim();
      const correctSentence = sentence.correctSentence.trim();

      if (userSentence === correctSentence) {
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

  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setDraggedWord(null);
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};

    exerciseDataL.sentences.forEach((sentence) => {
      correctAnswers[sentence.id] = sentence.correctSentence.split(" ");
    });

    setUserAnswers(correctAnswers);
    setShowResults(true);
  };

  const isWrongSentence = (sentence) => {
    if (!showResults) return false;

    const userSentence = (userAnswers[sentence.id] || []).join(" ").trim();
    if (!userSentence) return false;

    return userSentence !== sentence.correctSentence.trim();
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-container-component">
        <div className="div-forall mb-10" style={{ gap: "25px" }}>
          {" "}
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">B</span>Look and write sentences.{" "}
          </h1>
          <div className="grid grid-cols-2 gap-16 mb-8">
            {exerciseDataL.sentences.map((sentence, idx) => {
              const builtSentence = (userAnswers[sentence.id] || []).join(" ");

              return (
                <div key={sentence.id} className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-xl text-blue-900 mb-4">
                      {idx + 1}
                    </span>

                    <img
                      src={images[idx]}
                      className="object-cover"
                      style={{ height: "130px" }}
                    />
                  </div>

                  {/* WORD BANK */}
                  <div className="flex flex-wrap gap-3 min-h-14 p-2 rounded-lg bg-white">
                    {sentence.words.map((word, i) => {
                      const isUsed = (userAnswers[sentence.id] || []).includes(
                        word,
                      );

                      return (
                        <DraggableWord
                          key={`bank-${sentence.id}-${i}`}
                          word={word}
                          sentenceId={sentence.id}
                          index={`bank-${i}`}
                          used={isUsed}
                          showResults={showResults}
                        />
                      );
                    })}
                  </div>

                  {/* ANSWER */}
                  <div className="relative">
                    <DropZone
                      id={sentence.id}
                      isWrong={isWrongSentence(sentence)}
                    >
                      <div className="flex flex-wrap gap-2 mb-1">
                        {(userAnswers[sentence.id] || []).map((word, i) => (
                          <button
                            key={`answer-${word}-${i}`}
                            onClick={() => handleRemoveWord(sentence.id, i)}
                            className="cursor-pointer hover:bg-red-50"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </DropZone>

                    {isWrongSentence(sentence) && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                        <span className="text-white text-sm font-bold leading-none">
                          ✕
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="WB-word-bank px-4 py-2 shadow-lg bg-white">
            {activeItem.word}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page39_Q2;

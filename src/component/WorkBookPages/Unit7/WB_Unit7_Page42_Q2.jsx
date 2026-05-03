import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex G 5.svg";
const exerciseData = {
  sentences: [
    {
      id: "1",
      words: [
        { scrambled: ["l", "g", "t", "i", "h", "f"], correct: "flight" },
        {
          scrambled: ["t", "e", "d", "a", "t", "n", "a", "t", "n"],
          correct: "attendant",
        },
      ],
      questionParts: ["My mom is a ", " ", "."],
    },
    {
      id: "2",
      words: [
        {
          scrambled: ["s", "e", "a", "c", "t", "i", "u", "s"],
          correct: "suitcase",
        },
      ],
      questionParts: ["She can pack her ", "."],
    },
    {
      id: "3",
      words: [
        {
          scrambled: ["n", "i", "r", "v", "e", "u", "o", "s"],
          correct: "souvenir",
        },
        { scrambled: ["p", "o", "s", "h"], correct: "shop" },
      ],
      questionParts: ["He is looking at the things in the ", " ", "."],
    },
    {
      id: "4",
      words: [
        { scrambled: ["l", "v", "a", "i", "r", "r", "a"], correct: "arrival" },
        {
          scrambled: ["n", "e", "a", "l", "p", "r", "i", "a"],
          correct: "airplane",
        },
      ],
      questionParts: ["We saw the ", " of the ", "."],
    },
    {
      id: "5",
      words: [{ scrambled: ["l", "t", "o", "p", "i"], correct: "pilot" }],
      questionParts: ["The ", " walked to the plane."],
    },
  ],
};
const images = [img1, img2, img3, img4, img5];
const buildInitialAnswers = () => {
  const initial = {};
  exerciseData.sentences.forEach((sentence) => {
    initial[sentence.id] = sentence.words.map(() => "");
  });
  return initial;
};

const buildInitialUsedLetters = () => {
  const initial = {};
  exerciseData.sentences.forEach((sentence) => {
    initial[sentence.id] = sentence.words.map(() => []);
  });
  return initial;
};

const DraggableLetter = ({ id, letter, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { letter },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={`WB-word-bank  ${
        disabled
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "border-blue-900 text-gray-800 cursor-grab active:cursor-grabbing hover:bg-gray-300"
      }`}
    >
      {letter}
    </button>
  );
};

const WordDropZone = ({
  dropId,
  value,
  showResults,
  isCorrect,
  onRemoveLastLetter,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
  });

  let resultClass = "border-gray-400 text-gray-800 bg-white";

  if (showResults) {
    resultClass = isCorrect
      ? "border-blue-500 text-black bg-gray-50"
      : "border-red-500 text-black bg-gray-50";
  } else if (isOver) {
    resultClass = "border-blue-500 text-gray-800 bg-blue-50";
  }

  return (
    <div className="relative inline-block w-full">
      <button
        ref={setNodeRef}
        type="button"
        onClick={onRemoveLastLetter}
        disabled={showResults}
        className={`w-full min-h-[40px] px-4 py-2 border-b-2 font-semibold text-xl text-center transition-colors
  ${resultClass}
  ${!showResults ? "hover:text-red-500" : ""}
`}
      >
        {value}
      </button>

      {showResults && value && !isCorrect && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
};

const WB_Unit7_Page42_Q2 = () => {
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [usedLetters, setUsedLetters] = useState(buildInitialUsedLetters);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  const handleDragEnd = (event) => {
    if (showResults) return;

    const { active, over } = event;
    if (!active || !over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith("letter-") || !overId.startsWith("drop-")) return;

    const [, fromSentenceId, fromWordIndex, fromLetterIndex] =
      activeId.split("-");
    const [, toSentenceId, toWordIndex] = overId.split("-");

    if (fromSentenceId !== toSentenceId || fromWordIndex !== toWordIndex)
      return;

    const sentenceId = fromSentenceId;
    const wordIndex = Number(toWordIndex);
    const letterIndex = Number(fromLetterIndex);

    const sentence = exerciseData.sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;

    const letter = sentence.words[wordIndex].scrambled[letterIndex];
    const correctLength = sentence.words[wordIndex].correct.length;

    const currentWord = answers[sentenceId][wordIndex] || "";
    const currentUsed = usedLetters[sentenceId][wordIndex] || [];

    if (currentUsed.includes(letterIndex)) return;
    if (currentWord.length >= correctLength) return;

    const newAnswers = { ...answers };
    const newUsedLetters = { ...usedLetters };

    newAnswers[sentenceId] = [...newAnswers[sentenceId]];
    newUsedLetters[sentenceId] = [...newUsedLetters[sentenceId]];

    newAnswers[sentenceId][wordIndex] = currentWord + letter;
    newUsedLetters[sentenceId][wordIndex] = [...currentUsed, letterIndex];

    setAnswers(newAnswers);
    setUsedLetters(newUsedLetters);
  };

  const handleRemoveLastLetter = (sentenceId, wordIndex) => {
    if (showResults) return;

    const currentWord = answers[sentenceId][wordIndex];
    const currentUsed = usedLetters[sentenceId][wordIndex];

    if (!currentWord || !currentUsed.length) return;

    const newAnswers = { ...answers };
    const newUsedLetters = { ...usedLetters };

    newAnswers[sentenceId] = [...newAnswers[sentenceId]];
    newUsedLetters[sentenceId] = [...newUsedLetters[sentenceId]];

    newAnswers[sentenceId][wordIndex] = currentWord.slice(0, -1);
    newUsedLetters[sentenceId][wordIndex] = currentUsed.slice(0, -1);

    setAnswers(newAnswers);
    setUsedLetters(newUsedLetters);
  };

  const handleStartAgain = () => {
    setAnswers(buildInitialAnswers());
    setUsedLetters(buildInitialUsedLetters());
    setShowResults(false);
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    const correctUsed = {};

    exerciseData.sentences.forEach((sentence) => {
      correctAnswers[sentence.id] = sentence.words.map((word) => word.correct);
      correctUsed[sentence.id] = sentence.words.map((word) =>
        word.scrambled.map((_, idx) => idx),
      );
    });

    setAnswers(correctAnswers);
    setUsedLetters(correctUsed);
    setShowResults(true);
  };

  const checkAnswers = () => {
    if (showResults) return;

    const hasIncomplete = exerciseData.sentences.some((sentence) =>
      sentence.words.some((word, wordIndex) => {
        const answer = answers[sentence.id][wordIndex] || "";
        return answer.length !== word.correct.length;
      }),
    );

    if (hasIncomplete) {
      ValidationAlert.info();
      return;
    }

    let score = 0;

    exerciseData.sentences.forEach((sentence) => {
      const isSentenceCorrect = sentence.words.every((word, wordIndex) => {
        return answers[sentence.id][wordIndex] === word.correct;
      });

      if (isSentenceCorrect) score++;
    });

    setShowResults(true);

    if (score === exerciseData.sentences.length) {
      ValidationAlert.success(
        `Score: ${score} / ${exerciseData.sentences.length}`,
      );
    } else if (score > 0) {
      ValidationAlert.warning(
        `Score: ${score} / ${exerciseData.sentences.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${score} / ${exerciseData.sentences.length}`,
      );
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">H</span>
          Read and look. Unscramble the word. Rewrite the sentence.
        </h1>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="p-6 space-y-6">
            {exerciseData.sentences.map((sentence, idx) => {
              return (
                <div
                  key={sentence.id}
                  className="border-blue-900 border-2 p-4 rounded-lg flex gap-6 items-start w-full"
                >
                  <div className="flex flex-col w-full">
                    <p className="text-lg leading-10">
                      <span className="font-bold">{idx + 1}.</span>{" "}
                      {sentence.questionParts.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                          {part}
                          {partIndex < sentence.words.length && (
                            <span className="inline-block mx-1 px-1 border-b-2 border-gray-500 font-semibold tracking-wide">
                              {sentence.words[partIndex].scrambled.join("")}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>

                    <div
                      className="space-y-2 flex flex-col flex-wrap"
                      style={{ justifyContent: "space-around" }}
                    >
                      {sentence.words.map((word, wordIndex) => {
                        const value = answers[sentence.id][wordIndex] || "";
                        const isCorrect = value === word.correct;

                        return (
                          <div
                            key={`${sentence.id}-${wordIndex}`}
                            className="space-y-4"
                          >
                            <WordDropZone
                              dropId={`drop-${sentence.id}-${wordIndex}`}
                              value={value}
                              showResults={showResults}
                              isCorrect={isCorrect}
                              onRemoveLastLetter={() =>
                                handleRemoveLastLetter(sentence.id, wordIndex)
                              }
                            />

                            <div className="flex flex-wrap gap-2 w-full">
                              {word.scrambled.map((letter, letterIndex) => {
                                const isUsed =
                                  usedLetters[sentence.id][wordIndex].includes(
                                    letterIndex,
                                  );

                                return (
                                  <DraggableLetter
                                    key={`letter-${sentence.id}-${wordIndex}-${letterIndex}`}
                                    id={`letter-${sentence.id}-${wordIndex}-${letterIndex}`}
                                    letter={letter}
                                    disabled={showResults || isUsed}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-auto w-[50%] flex justify-end">
                    <img
                      src={images[idx]}
                      alt="question"
                      style={{
                        width: "auto",
                        height: "240px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <Button
              handleStartAgain={handleStartAgain}
              handleShowAnswer={handleShowAnswer}
              checkAnswers={checkAnswers}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default WB_Unit7_Page42_Q2;

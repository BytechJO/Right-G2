import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const exerciseData = [
  {
    id: 1,
    scrambled: "this/ a/ Is/ bird /?",
    correctQuestion: "Is this a bird?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img1,
  },
  {
    id: 2,
    scrambled: "these /Are /dogs /?",
    correctQuestion: "Are these dogs?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "No, they aren't.",
    image: img2,
  },
  {
    id: 3,
    scrambled: "clouds /those /Are /?",
    correctQuestion: "Are those clouds?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "Yes, they are.",
    image: img3,
  },
  {
    id: 4,
    scrambled: "pond /a /that/ Is /?",
    correctQuestion: "Is that a pond?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img4,
  },
];

const buildQuestionFromWords = (words) => {
  return words
    .map((w) => w.text)
    .join(" ")
    .replace(/\s+\?/g, "?")
    .trim();
};

const createInitialState = () =>
  exerciseData.reduce((acc, item) => {
    acc[item.id] = {
      arrangedWords: [],
      wordBank: item.scrambled
        .split("/")
        .map((w) => w.trim())
        .filter(Boolean)
        .map((word, index) => ({
          id: `${item.id}-${word}-${index}`,
          text: word,
          isUsed: false,
        })),
      selectedOption: null,
    };
    return acc;
  }, {});

const WB_Unit2_Page10_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState(createInitialState());
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleOptionClick = (id, option) => {
    if (locked) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], selectedOption: option },
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { source, destination } = result;
    const [, sourceItemId] = source.droppableId.split("-");
    const [, destItemId] = destination.droppableId.split("-");

    // امنع النقل بين أسئلة مختلفة
    if (sourceItemId !== destItemId) return;

    const itemId = sourceItemId;

    setUserAnswers((prev) => {
      const current = { ...prev };
      const itemState = { ...current[itemId] };

      const isSourceBank = source.droppableId.startsWith("bank-");
      const isDestBank = destination.droppableId.startsWith("bank-");

      let sourceList = isSourceBank
        ? [...itemState.wordBank]
        : [...itemState.arrangedWords];

      let destList = isDestBank
        ? [...itemState.wordBank]
        : [...itemState.arrangedWords];

      let movedItem;

      // من البنك إلى الجملة
      if (isSourceBank) {
        const originalItem = sourceList[source.index];

        // إذا الكلمة مستخدمة، لا تسمح بسحبها مرة ثانية
        if (originalItem.isUsed) return prev;

        // خليه يضل موجود بالبنك لكن disabled
        sourceList[source.index] = {
          ...originalItem,
          isUsed: true,
        };

        // أضف نسخة جديدة للجملة بمعرف مختلف
        movedItem = {
          ...originalItem,
          id: `answer-${originalItem.id}`,
          originalId: originalItem.id,
        };

        // إذا الوجهة هي البنك نفسه، لا تعمل شيء
        if (isDestBank) {
          itemState.wordBank = sourceList;
          current[itemId] = itemState;
          return current;
        }

        destList.splice(destination.index, 0, movedItem);

        itemState.wordBank = sourceList;
        itemState.arrangedWords = destList;
      } else {
        // داخل الجملة نفسها: إعادة ترتيب
        [movedItem] = sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, movedItem);

        if (isDestBank) {
          itemState.wordBank = destList;
        } else {
          itemState.arrangedWords = destList;
        }

        itemState.arrangedWords = sourceList;
      }

      current[itemId] = itemState;
      return current;
    });
  };

  const checkAnswers = () => {
    if (checked || locked) return;
    const allCompleted = exerciseData.every((item) => {
      return (
        userAnswers[item.id].arrangedWords.length > 0 &&
        userAnswers[item.id].selectedOption !== null
      );
    });

    if (!allCompleted) {
      ValidationAlert.info("Please complete all answers!");
      return;
    }

    let correctCount = 0;
    const totalItems = exerciseData.length * 2;

    exerciseData.forEach((item) => {
      const userAns = userAnswers[item.id];
      const builtQuestion = buildQuestionFromWords(userAns.arrangedWords);

      if (builtQuestion.toLowerCase() === item.correctQuestion.toLowerCase()) {
        correctCount++;
      }

      if (userAns.selectedOption === item.correctOption) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === totalItems) {
      ValidationAlert.success(`Score: ${correctCount}/${totalItems}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${totalItems}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${totalItems}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};

    exerciseData.forEach((item) => {
      answers[item.id] = {
        arrangedWords: item.correctQuestion.split(" ").map((word, index) => ({
          id: `answer-${item.id}-${index}`,
          text: word,
          originalId: `${item.id}-${word}-${index}`, // إذا بدك تحتفظي بالربط
        })),
        wordBank: item.scrambled
          .split("/")
          .map((w) => w.trim())
          .filter(Boolean)
          .map((word, index) => ({
            id: `${item.id}-${word}-${index}`,
            text: word,
            isUsed: true,
          })),
        selectedOption: item.correctOption,
      };
    });

    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };
  const handleTryAgain = () => {
    setUserAnswers(createInitialState());
    setChecked(false);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall mb-10"  style={{gap:"30px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">D</span> Unscramble, look, write, and
            answer.
          </h1>
       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
          {exerciseData.map((item) => {
            const builtQuestion = buildQuestionFromWords(
              userAnswers[item.id].arrangedWords,
            );
            const questionCorrect =
              builtQuestion.toLowerCase() ===
              item.correctQuestion.toLowerCase();

            return (
              <div key={item.id} className="flex flex-col gap-4 relative w-[80%]">
                <div className="flex items-start gap-3">
                  <span className="text-blue-700 font-bold text-xl mt-[20px]">
                    {item.id}
                  </span>

                  <div className="flex flex-col gap-3 w-full">
                    
                    <Droppable
                      droppableId={`bank-${item.id}`}
                      direction="horizontal"
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[56px] w-full rounded-lg p-3 flex flex-wrap justify-between"
                        >
                          {userAnswers[item.id].wordBank.map((word, index) => (
                            <Draggable
                              key={word.id}
                              draggableId={word.id}
                              index={index}
                              isDragDisabled={locked || word.isUsed} // ✅ updated
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`WB-word-bank
                                    ${
                                      word.isUsed
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white cursor-grab"
                                    }`}
                                  style={provided.draggableProps.style}
                                >
                                  {word.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Droppable
                      droppableId={`answer-${item.id}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[56px] w-full border-2 rounded-lg p-3 flex flex-wrap gap-2 bg-white
                          ${
                            checked
                              ? questionCorrect
                                ? "border-gray-400"
                                : "border-red-400"
                              : "border-gray-300"
                          }`}
                        >
                          {userAnswers[item.id].arrangedWords.map(
                            (word, index) => (
                              <Draggable
                                key={word.id}
                                draggableId={word.id}
                                index={index}
                                isDragDisabled={locked}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => {
                                      if (locked) return;

                                      setUserAnswers((prev) => {
                                        const current = { ...prev };
                                        const itemState = {
                                          ...current[item.id],
                                        };

                                        itemState.arrangedWords =
                                          itemState.arrangedWords.filter(
                                            (w) => w.id !== word.id,
                                          );

                                        itemState.wordBank =
                                          itemState.wordBank.map((w) =>
                                            w.id === word.originalId
                                              ? { ...w, isUsed: false }
                                              : w,
                                          );

                                        current[item.id] = itemState;
                                        return current;
                                      });
                                    }}
                                    className="rounded-md text-[18px]cursor-pointer hover:text-red-500 transition"
                                    style={provided.draggableProps.style}
                                  >
                                    {word.text}
                                  </div>
                                )}
                              </Draggable>
                            ),
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {checked && (
                      <span className="text-lg">
                        {questionCorrect ? (
                          ""
                        ) : (
                          <span className="absolute top-16 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                            ✕
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-2 justify-between">
                  <div className="flex flex-col gap-2">
                    {item.options.map((option) => {
                      const isSelected =
                        userAnswers[item.id].selectedOption === option;
                      const isCorrectOption = option === item.correctOption;
                      const isWrongOption =
                        checked && isSelected && !isCorrectOption;
                      return (
                        <div
                          key={option}
                          onClick={() => handleOptionClick(item.id, option)}
                          className={`
    relative
    cursor-pointer px-4 py-1 rounded-full border-2 transition-all text-lg

    ${
      isSelected
        ? isWrongOption
          ? "border-red-500 bg-red-50"
          : "border-gray-500 bg-green-50"
        : "border-transparent hover:bg-gray-50"
    }
  `}
                        >
                          {option}
                          {isWrongOption && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center">
                    <img
                      src={item.image}
                      alt="exercise"
                      className="object-contain"
                       style={{height:"90px",width:"100px"}}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
 </div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit2_Page10_Q2;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit3_Page17_Q2 = () => {
  const data = [
    { scrambled: "aekt a tpoho", answer: "take a photo" },
    { scrambled: "kema a chasdiwn", answer: "make a sandwich" },
    { scrambled: "deri a ekib", answer: "ride a bike" },
    { scrambled: "lyf a tiek", answer: "fly a kite" },
    { scrambled: "chneb", answer: "bench" },
    { scrambled: "lyap eht murd", answer: "play the drum" },
  ];

  const buildInitialInputs = () =>
    data.map((item) =>
      item.answer
        .split(" ")
        .map((word) => Array.from({ length: word.length }, () => null)),
    );

  const [inputs, setInputs] = useState(buildInitialInputs());
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrong, setWrong] = useState(data.map(() => false));

  const isLetterUsed = (rowIndex, letterId) => {
    return inputs[rowIndex].some((wordArr) =>
      wordArr.some((slot) => slot?.id === letterId),
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;

    const [rowIndexStr, sourceWordIndexStr, charIndexStr, char] =
      draggableId.split("__");

    const rowIndex = Number(rowIndexStr);
    const sourceWordIndex = Number(sourceWordIndexStr);

    const [destRowStr, destWordStr, destCharStr] =
      destination.droppableId.split("__");

    const destRowIndex = Number(destRowStr);
    const destWordIndex = Number(destWordStr);
    const destCharIndex = Number(destCharStr);

    // منع السحب بين الأسطر
    // ❌ منع السحب بين الأسطر
    if (rowIndex !== destRowIndex) return;

    // ❌ منع السحب بين الكلمات داخل نفس السطر
    if (sourceWordIndex !== destWordIndex) return;

    setInputs((prev) => {
      const updated = prev.map((row) => row.map((word) => [...word]));

      // إزالة نفس الحرف "بنفس الـ id" من أي خانة قديمة
      updated[rowIndex] = updated[rowIndex].map((wordArr) =>
        wordArr.map((slot) => (slot?.id === draggableId ? null : slot)),
      );

      // إذا الخانة فيها حرف قديم، شيله واستبدله
      updated[destRowIndex][destWordIndex][destCharIndex] = {
        id: draggableId,
        char,
      };

      return updated;
    });

    setWrong(data.map(() => false));
  };

  const getRowUserAnswer = (rowIndex) =>
    inputs[rowIndex]
      .map((word) => word.map((slot) => slot?.char || "").join(""))
      .join(" ")
      .trim();

  const checkAnswers = () => {
    if (showAnswer) return;

    const hasEmpty = inputs.some((row) =>
      row.some((word) => word.some((slot) => slot === null)),
    );

    if (hasEmpty) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    let correct = 0;

    const wrongStatus = data.map((item, i) => {
      const userAnswer = getRowUserAnswer(i).toLowerCase();
      const isCorrect = userAnswer === item.answer.toLowerCase();
      if (isCorrect) correct++;
      return !isCorrect;
    });

    setWrong(wrongStatus);

    const total = data.length;
    const msg = `Score: ${correct} / ${total}`;

    if (correct === total) {
      ValidationAlert.success(msg);
    } else if (correct === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  const reset = () => {
    setInputs(buildInitialInputs());
    setWrong(data.map(() => false));
    setShowAnswer(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall" style={{ marginBottom: "60px",gap:"30px" }}>
          <div className="page8-content">
            <header className="WB-header-title-page8">
              <span className="WB-ex-A">F</span>
              Unscramble and write.
            </header>
          </div>
          <div className="flex flex-col gap-5">
            {data.map((item, i) => {
              const scrambledWords = item.scrambled.split(" ");
              const answerWords = item.answer.split(" ");

              return (
                <div
                  className="border-2 border-gray-300 p-5 rounded-lg"
                  key={i}
                  style={{ marginBottom: "14px", width: "100%" }}
                >
                  <div className="scrambled-wb-unit3-p17-q2">
                    <div className="text-[22px]">
                      <span
                        className="text-[22px] text-blue-900"
                        style={{ fontWeight: "600", marginRight: "8px" }}
                      >
                        {i + 1}.
                      </span>
                      {item.scrambled}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        // marginTop: "10px",
                      }}
                    >
                      {scrambledWords.map((word, wordIndex) => (
                        <Droppable
                          key={`bank-${i}-${wordIndex}`}
                          droppableId={`bank__${i}__${wordIndex}__0`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                display: "flex",
                                gap: "6px",
                                padding: "8px",
                                // border: "2px dashed #ccc",
                                borderRadius: "10px",
                                minHeight: "42px",
                                alignItems: "center",
                              }}
                            >
                              {word.split("").map((char, charIndex) => {
                                const letterId = `${i}__${wordIndex}__${charIndex}__${char}`;
                                const used =
                                  isLetterUsed(i, letterId) || showAnswer;

                                return (
                                  <Draggable
                                    key={letterId}
                                    draggableId={letterId}
                                    index={charIndex}
                                    isDragDisabled={used}
                                  >
                                    {(provided) => (
                                      <span
                                        ref={provided.innerRef}
                                        {...(!used
                                          ? provided.draggableProps
                                          : {})}
                                        {...(!used
                                          ? provided.dragHandleProps
                                          : {})}
                                          className="WB-word-bank"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          // border: "2px solid #2c5287",
                                          // borderRadius: "8px",
                                          // background: "white",
                                          // fontWeight: "bold",
                                          textTransform: "lowercase",
                                          opacity: used ? 0.35 : 1,
                                          cursor: used ? "not-allowed" : "grab",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        {char}
                                      </span>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </div>

                  <div style={{ position: "relative"}}>
                    <div
                      // className="border-b-2 border-gray-500"
                      style={{
                        minHeight: "56px",
                        display: "flex",
                        alignItems: "center",
                        gap: "25px",
                        flexWrap: "wrap",
                        padding: "8px 10px",
                      }}
                    >
                      {(showAnswer ? answerWords : inputs[i]).map(
                        (wordValue, wordIndex) => {
                          const targetLength = answerWords[wordIndex].length;

                          return (
                            <div
                              key={`answer-word-${i}-${wordIndex}`}
                              style={{
                                display: "flex",
                                flexDirection: "column", // ⭐ مهم
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <div className="flex gap-3">
                                {Array.from({ length: targetLength }).map(
                                  (_, charIndex) => (
                                    <Droppable
                                      key={`blank-${i}-${wordIndex}-${charIndex}`}
                                      droppableId={`${i}__${wordIndex}__${charIndex}`}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          style={{
                                            width: "34px",
                                            height: "40px",
                                            borderBottom: "2px solid",
                                            borderColor: snapshot.isDraggingOver
                                              ? "#60a5fa"
                                              : "#9ca3af",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            background: snapshot.isDraggingOver
                                              ? "#eff6ff"
                                              : "transparent",
                                          }}
                                        >
                                          <span
                                            onClick={() => {
                                              if (showAnswer) return;

                                              setInputs((prev) => {
                                                const updated = prev.map(
                                                  (row) =>
                                                    row.map((word) => [
                                                      ...word,
                                                    ]),
                                                );

                                                // امسح الحرف (يرجع للبانك تلقائي لأنه used=false)
                                                updated[i][wordIndex][
                                                  charIndex
                                                ] = null;

                                                return updated;
                                              });
                                            }}
                                            style={{
                                              cursor: showAnswer
                                                ? "default"
                                                : "pointer",
                                            }}
                                            className="text-black hover:text-red-500"
                                          >
                                            {showAnswer
                                              ? answerWords[wordIndex][
                                                  charIndex
                                                ]
                                              : inputs[i][wordIndex][charIndex]
                                                  ?.char || ""}
                                          </span>
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  ),
                                )}
                              </div>
                              {/* ⭐ الكلمة المجمعة */}
                              <div
                                style={{
                                  minHeight: "40px",
                                  fontSize: "22px",
                                  fontWeight: "600",
                                  color: "#1e3a8a",
                                  borderBottom: "2px solid gray",
                                  textAlign:"center",
                                  width:"100%"
                                }}
                              >
                                <span>
                                  {showAnswer
                                    ? answerWords[wordIndex]
                                    : inputs[i][wordIndex]
                                        .map((slot) => slot?.char || "")
                                        .join("")}
                                </span>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {wrong[i] && (
                      <div className="wrong-icon-wb-unit1-p3-q1">✕</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={() => {
              setShowAnswer(true);
              setWrong(data.map(() => false));
            }}
          >
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit3_Page17_Q2;

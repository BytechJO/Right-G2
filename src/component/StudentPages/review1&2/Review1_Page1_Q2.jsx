import React, { useState } from "react";
import img1 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page 16/Ex B 5.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review1_Page1_Q2.css";

// ── بيانات الأسئلة ──────────────────────────────────────────────
// scrambled = نفس حروف correctWord بس مبعثرة (anagram)
const questions = [
  {
    img: img1,
    prefix: "I’m Stella’s",
    suffix: ".",
    correctWord: "uncle",
    scrambled: "lecun",
  },
  {
    img: img2,
    prefix: "She’s Stella’s",
    suffix: ".",
    correctWord: "sister",
    scrambled: "restis",
  },
  {
    img: img3,
    prefix: "He’s Stella’s",
    suffix: ".",
    correctWord: "father",
    scrambled: "hatref",
  },
  {
    img: img4,
    prefix: "I’m Stella’s",
    suffix: ".",
    correctWord: "cousin",
    scrambled: "sinuoc",
  },
  {
    img: img5,
    prefix: "She’s Stella’s",
    suffix: ".",
    correctWord: "aunt",
    scrambled: "taun",
  },
];

// ── هوية كل حرف بالليتر بانك: ثابتة وما بتتغير ──────────────────
const lettersByQuestion = questions.map((q, qi) =>
  q.scrambled.split("").map((_, li) => `q${qi}-l${li}`),
);

// ── helpers لتحويل id الحرف لـ qi/li والرجوع للحرف نفسه ──────────
const parseLetterId = (id) => {
  const m = id.match(/^q(\d+)-l(\d+)$/);
  return { qi: Number(m[1]), li: Number(m[2]) };
};

const getChar = (id) => {
  if (!id) return "";
  const { qi, li } = parseLetterId(id);
  return questions[qi].scrambled[li];
};

const initialSlots = () =>
  questions.map((q) => Array(q.correctWord.length).fill(null));

// ── ترتيب الحروف الصحيحة بترتيب الكلمة الهدف (لزر Show Answer) ──
const buildCorrectSlots = (qi) => {
  const q = questions[qi];
  const remaining = q.scrambled
    .split("")
    .map((ch, li) => ({ id: `q${qi}-l${li}`, ch }));

  return q.correctWord.split("").map((targetChar) => {
    const idx = remaining.findIndex(
      (r) => r.ch.toLowerCase() === targetChar.toLowerCase(),
    );
    if (idx === -1) return null;
    const found = remaining[idx];
    remaining.splice(idx, 1);
    return found.id;
  });
};

const Review1_Page1_Q2 = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [locked, setLocked] = useState(false);

  // ── سحب حرف من البانك لخانة ──
  const onDragEnd = (result) => {
    if (locked) return;
    const { draggableId, destination } = result;
    if (!destination) return;

    // الإفلات برجوع للبانك مش مسموح بالسحب — الرجوع بيكون بالكبس على الخانة بس
    if (!destination.droppableId.startsWith("slot-")) return;

    const { qi } = parseLetterId(draggableId);
    const destSlotIndex = Number(destination.droppableId.split("-")[2]);

    setSlots((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[qi][destSlotIndex] = draggableId;
      return copy;
    });

    setWrongSlots([]);
  };

  // ── كبسة على الخانة: ترجع الحرف لمكانه بالليتر بانك ──
  const handleSlotClick = (qi, li) => {
    if (locked) return;
    if (!slots[qi][li]) return;

    setSlots((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[qi][li] = null;
      return copy;
    });

    setWrongSlots([]);
  };

  // ── تشييك الإجابات ──
  const checkAnswers = () => {
    if (locked) return;

    for (let qi = 0; qi < questions.length; qi++) {
      if (slots[qi].some((v) => v === null)) {
        ValidationAlert.info(
          "Oops!",
          "Please complete all the words before checking.",
        );
        return;
      }
    }

    let wrong = [];
    let score = 0;

    questions.forEach((q, qi) => {
      const assembled = slots[qi].map((id) => getChar(id)).join("");
      if (assembled.toLowerCase() === q.correctWord.toLowerCase()) {
        score++;
      } else {
        slots[qi].forEach((id, li) => {
          if (getChar(id).toLowerCase() !== q.correctWord[li].toLowerCase()) {
            wrong.push(`${qi}-${li}`);
          }
        });
      }
    });

    setWrongSlots(wrong);
    setLocked(true);

    const total = questions.length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const showAnswers = () => {
    setSlots(questions.map((_, qi) => buildCorrectSlots(qi)));
    setWrongSlots([]);
    setLocked(true);
  };

  const reset = () => {
    setSlots(initialSlots());
    setWrongSlots([]);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ gap: "20px" }}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>B</span>Drag and drop the
            letters to unscramble the word.
          </h5>

          <div className="CB-review1-p1-q2-content" style={{ gap: "26px" }}>
            {questions.map((q, qi) => {
              const usedIds = slots[qi];

              return (
                <div
                  key={qi}
                  className="CB-unit2-p6-q2-row"
                  style={{ alignItems: "flex-start", gap: "16px" }}
                >
                  <div className="CB-unit2-p6-q2-left">
                    <span className="CB-unit2-p6-q2-index">{qi + 1}</span>
                    <img src={q.img} alt="" className="CB-unit2-p6-q2-img" />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      minWidth: 0,
                    }}
                  >
                    {/* الجملة مع الخانات الفاضية */}
                    <div
                      className="CB-unit2-p6-q2-sentence"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <span className="CB-unit2-p6-q2-text">{q.prefix}</span>

                      <div style={{ display: "flex", gap: "4px" }}>
                        {Array.from({ length: q.correctWord.length }).map(
                          (_, li) => {
                            const letterId = usedIds[li];
                            const isWrong = wrongSlots.includes(`${qi}-${li}`);
                            const isFilled = Boolean(letterId);

                            return (
                              <Droppable
                                key={li}
                                droppableId={`slot-${qi}-${li}`}
                                type={`q${qi}`}
                                isDropDisabled={locked}
                              >
                                {(provided, snapshot) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    onClick={() => handleSlotClick(qi, li)}
                                    style={{
                                      position: "relative",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "34px",
                                      height: "38px",
                                      borderBottom: isWrong
                                        ? "2px solid #ef4444"
                                        : snapshot.isDraggingOver
                                          ? "2px dashed #f39b42"
                                          : "2px solid #888",
                                      background: isWrong
                                        ? "#fee2e2"
                                        : "#fafafa",
                                      fontSize: "18px",
                                      fontWeight: 600,
                                      textTransform: "lowercase",
                                      cursor:
                                        isFilled && !locked
                                          ? "pointer"
                                          : "default",
                                      userSelect: "none",
                                    }}
                                  >
                                    {getChar(letterId)}
                                    {provided.placeholder}

                                    {isWrong && (
                                      <span
                                        style={{
                                          position: "absolute",
                                          top: -8,
                                          right: -8,
                                          width: "16px",
                                          height: "16px",
                                          borderRadius: "50%",
                                          background: "#ef4444",
                                          color: "#fff",
                                          fontSize: "10px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "1px solid white",
                                        }}
                                      >
                                        ✕
                                      </span>
                                    )}
                                  </span>
                                )}
                              </Droppable>
                            );
                          },
                        )}
                      </div>

                      <span className="CB-unit2-p6-q2-text">{q.suffix}</span>
                    </div>

                    {/* بنك الحروف الخاص بهاد السؤال — ثابت دايمًا، بس بيصير الحرف Disabled لما يُستخدم */}
                    <Droppable
                      droppableId={`bank-${qi}`}
                      type={`q${qi}`}
                      direction="horizontal"
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            minHeight: "38px",
                          }}
                        >
                          {lettersByQuestion[qi].map((id, idx) => {
                            const used = usedIds.includes(id);

                            return (
                              <Draggable
                                key={id}
                                draggableId={id}
                                index={idx}
                                isDragDisabled={locked || used}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <span
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "34px",
                                      height: "38px",
                                      border: used
                                        ? "1.5px dashed #ccc"
                                        : "1.5px solid #ccc",
                                      borderRadius: "6px",
                                      background: used ? "#ececec" : "white",
                                      opacity:
                                        used && !dragSnapshot.isDragging
                                          ? 0.4
                                          : 1,
                                      fontSize: "18px",
                                      fontWeight: 600,
                                      textTransform: "lowercase",
                                      cursor: used
                                        ? "not-allowed"
                                        : locked
                                          ? "default"
                                          : "grab",
                                      userSelect: "none",
                                      ...dragProvided.draggableProps.style,
                                    }}
                                  >
                                    {getChar(id)}
                                  </span>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
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
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
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

export default Review1_Page1_Q2;
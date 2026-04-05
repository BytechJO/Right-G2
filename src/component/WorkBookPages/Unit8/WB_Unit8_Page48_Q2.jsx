import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import imgJohn from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 1.svg";
import imgBike from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 2.svg";
import imgMomAunt from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 3.svg";
import imgDress from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 4.svg";
import imgDad from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 5.svg";
import imgTie from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 6.svg";
import imgGrandpa from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 7.svg";
import imgGlasses from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 8.svg";
import imgSarahJack from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 9.svg";
import imgDollRobot from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 10.svg";
import imgHelenStella from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 11.svg";
import imgDresses from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex I 12.svg";


const CORRECT_ANSWERS = {
  q1: "chip1",
  q2: "chip2",
  q3: "chip3",
  q4: "chip4",
  q5: "chip5",
  q6: "chip6",
};

const QUESTIONS = [
  {
    key: "q1",
    personImg: imgJohn,
    itemImg: imgBike,
    prefix: "John",
    suffix: "",
  },
  {
    key: "q2",
    personImg: imgMomAunt,
    itemImg: imgDress,
    prefix: "Mom and my aunt",
    suffix: "",
  },
  {
    key: "q3",
    personImg: imgDad,
    itemImg: imgTie,
    prefix: "Dad",
    suffix: "",
  },
  {
    key: "q4",
    personImg: imgGrandpa,
    itemImg: imgGlasses,
    prefix: "Grandpa has",
    suffix: "",
  },
  {
    key: "q5",
    personImg: imgSarahJack,
    itemImg: imgDollRobot,
    prefix: "Sarah and Jack",
    suffix: "",
  },
  {
    key: "q6",
    personImg: imgHelenStella,
    itemImg: imgDresses,
    prefix: "Helen and Stella",
    suffix: "",
  },
];

const ALL_CHIPS = [
  { id: "chip1", label: "has a bike" },
  { id: "chip2", label: "have a dress" },
  { id: "chip3", label: "has a tie" },
  { id: "chip4", label: "glasses" },
  { id: "chip5", label: "have a doll and a robot" },
  { id: "chip6", label: "have dresses" },
];

const SHUFFLED_CHIPS = [...ALL_CHIPS].sort(() => Math.random() - 0.5);

const INITIAL_DROPS = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
};

const WB_Unit8_Page48_Q2 = () => {
  const [drops, setDrops] = useState({ ...INITIAL_DROPS });
  const [dragOver, setDragOver] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const draggingChip = useRef(null);

  const usedChips = new Set(Object.values(drops).filter(Boolean));
  const availableChips = SHUFFLED_CHIPS.filter((c) => !usedChips.has(c.id));

  const onChipDragStart = (e, chipId) => {
    draggingChip.current = chipId;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDropZoneDragOver = (e, qKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(qKey);
  };

  const onDropZoneDragLeave = () => setDragOver(null);

  const onDropZoneDrop = (e, qKey) => {
    e.preventDefault();
    setDragOver(null);
    const chipId = draggingChip.current;
    if (!chipId) return;

    setDrops((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === chipId) next[k] = null;
      });
      next[qKey] = chipId;
      return next;
    });

    draggingChip.current = null;
    setShowResults(false);
  };

  const onDropZoneChipDragStart = (e, chipId, qKey) => {
    draggingChip.current = chipId;
    e.dataTransfer.effectAllowed = "move";
  };

  const onPoolDrop = (e) => {
    e.preventDefault();
    const chipId = draggingChip.current;
    if (!chipId) return;

    setDrops((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === chipId) next[k] = null;
      });
      return next;
    });

    draggingChip.current = null;
    setShowResults(false);
  };

  const onPoolDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const checkAnswers = () => {
    const allKeys = Object.keys(INITIAL_DROPS);
    const unanswered = allKeys.filter((k) => !drops[k]);

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    let score = 0;
    allKeys.forEach((k) => {
      if (drops[k] === CORRECT_ANSWERS[k]) score++;
    });

    const total = allKeys.length;
    const msg = `Score: ${score} / ${total}`;

    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);

    setShowResults(true);
  };

  const handleReset = () => {
    setDrops({ ...INITIAL_DROPS });
    setShowResults(false);
  };

  const handleShowAnswer = () => {
    setDrops({ ...CORRECT_ANSWERS });
    setShowResults(true);
  };

  const getDropZoneStyle = (qKey) => {
    const chipId = drops[qKey];
    const isOver = dragOver === qKey;

    return {
      minWidth: 160,
      minHeight: 32,
      borderBottom: "2px dashed #3b82f6",
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 6px",
      transition: "border-color 0.2s, background 0.2s",
      background: isOver ? "#eff6ff" : "transparent",
      cursor: chipId ? "grab" : "default",
      position: "relative",
    };
  };

  const getChipStyle = (chipId, inZone = false, qKey = null) => {
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: 6,
      fontSize: 18,
      fontWeight: 600,
      cursor: "grab",
      userSelect: "none",
      whiteSpace: "nowrap",
      border: "1.5px solid #3b82f6",
      color: "#2563eb",
      background: "#eff6ff",
      transition: "all 0.2s",
    };
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">I</span>Look and write.
        </h1>

        {/* Chips pool */}
        <div
          onDrop={onPoolDrop}
          onDragOver={onPoolDragOver}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: "10px 14px",
            marginBottom: 24,
            minHeight: 48,
            border: "1.5px dashed #d1d5db",
            borderRadius: 10,
            background: "#f9fafb",
          }}
        >
          {availableChips.length === 0 && (
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Drag the world</span>
          )}

          {availableChips.map((chip) => (
            <span
              key={chip.id}
              draggable
              onDragStart={(e) => onChipDragStart(e, chip.id)}
              style={getChipStyle(chip.id)}
            >
              {chip.label}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2" style={{ minWidth: 64 }}>
            {QUESTIONS.map((q) => (
              <div
                key={q.key}
                className="flex items-center justify-center"
                style={{ height: 56 }}
              >
                <img
                  src={q.personImg}
                  alt="person"
                  className="object-contain"
                  style={{ maxWidth: 90, maxHeight: 90 }}
                />
              </div>
            ))}
          </div>

          <div
            className="flex flex-col items-center gap-2"
            style={{ minWidth: 12 }}
          >
            {QUESTIONS.map((q) => (
              <div
                key={q.key}
                style={{ height: 56 }}
                className="flex items-center"
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "2px solid #aaa",
                    display: "inline-block",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2" style={{ minWidth: 64 }}>
            {QUESTIONS.map((q) => (
              <div
                key={q.key}
                className="flex items-center justify-center"
                style={{ height: 56 }}
              >
                <img
                  src={q.itemImg}
                  alt="item"
                  className="object-contain"
                  style={{ maxWidth: 90, maxHeight: 90 }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {QUESTIONS.map((q, idx) => {
              const droppedChipId = drops[q.key];
              const droppedChip = droppedChipId
                ? ALL_CHIPS.find((c) => c.id === droppedChipId)
                : null;

              const isWrong =
                showResults &&
                droppedChipId &&
                droppedChipId !== CORRECT_ANSWERS[q.key];

              return (
                <div
                  key={q.key}
                  className="flex items-center gap-2"
                  style={{ height: 56 }}
                >
                  <span
                    className="font-bold text-blue-900 text-lg"
                    style={{ minWidth: 18 }}
                  >
                    {idx + 1}
                  </span>

                  <span className="text-gray-700 font-semibold text-lg whitespace-nowrap">
                    {q.prefix}
                  </span>

                  <div
                    style={getDropZoneStyle(q.key)}
                    onDragOver={(e) => onDropZoneDragOver(e, q.key)}
                    onDragLeave={onDropZoneDragLeave}
                    onDrop={(e) => onDropZoneDrop(e, q.key)}
                  >
                    {droppedChip ? (
                      <span
                        draggable
                        onDragStart={(e) =>
                          onDropZoneChipDragStart(e, droppedChip.id, q.key)
                        }
                        // style={getChipStyle(droppedChip.id, true, q.key)}
                      >
                        {droppedChip.label}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#d1d5db",
                          fontSize: 12,
                          pointerEvents: "none",
                        }}
                      >
                        Drop here ...
                      </span>
                    )}

                    {isWrong && (
                      <div
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "red",
                          color: "#ffffff",
                          borderRadius: "9999px",
                          width: 25,
                          height: 25,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: "bold",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          border:"2px solid white"
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>

                  <span className="text-gray-700 font-semibold">.</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit8_Page48_Q2;
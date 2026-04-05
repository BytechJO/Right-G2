import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgClown from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex E 1_1.svg";

const VERB_CHIPS = [
  { id: "has", label: "has" },
  { id: "doesnt", label: "doesn't have" },
];

const QUESTIONS = [
  {
    key: "q1",
    hint: "big hat",
    correctVerb: "doesnt",
    restOfSentence: "a big hat",
  },
  {
    key: "q2",
    hint: "short tie",
    correctVerb: "has",
    restOfSentence: "a short tie",
  },
  {
    key: "q3",
    hint: "big shoes",
    correctVerb: "has",
    restOfSentence: "big shoes",
  },
  {
    key: "q4",
    hint: "small jacket",
    correctVerb: "doesnt",
    restOfSentence: "a small jacket",
  },
];

const INITIAL_DROPS = { q1: null, q2: null, q3: null, q4: null };

const WB_Unit8_Page46_Q2 = () => {
  const [drops, setDrops] = useState({ ...INITIAL_DROPS });
  const [dragOver, setDragOver] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const dragging = useRef(null);

  const getChipLabel = (id) =>
    VERB_CHIPS.find((c) => c.id === id)?.label ?? "";

  const onBankDragStart = (e, chipId) => {
    dragging.current = { chipId, fromZone: null };
    e.dataTransfer.effectAllowed = "copy";
  };

  const onZoneChipDragStart = (e, chipId, qKey) => {
    dragging.current = { chipId, fromZone: qKey };
    e.dataTransfer.effectAllowed = "move";
  };

  const onZoneDragOver = (e, qKey) => {
    e.preventDefault();
    setDragOver(qKey);
  };

  const onZoneDragLeave = () => setDragOver(null);

  const onZoneDrop = (e, qKey) => {
    e.preventDefault();
    setDragOver(null);
    if (!dragging.current) return;

    const { chipId, fromZone } = dragging.current;

    setDrops((prev) => {
      const next = { ...prev };
      if (fromZone) next[fromZone] = null;
      next[qKey] = chipId;
      return next;
    });

    dragging.current = null;
    setShowResults(false);
  };

  const onBankDrop = (e) => {
    e.preventDefault();
    if (!dragging.current?.fromZone) return;

    setDrops((prev) => ({
      ...prev,
      [dragging.current.fromZone]: null,
    }));

    dragging.current = null;
    setShowResults(false);
  };

  const checkAnswers = () => {
    const keys = Object.keys(INITIAL_DROPS);

    if (keys.some((k) => !drops[k])) {
      ValidationAlert.info();
      return;
    }

    let score = 0;
    keys.forEach((k) => {
      if (drops[k] === QUESTIONS.find((q) => q.key === k).correctVerb) score++;
    });

    const msg = `Score: ${score} / ${keys.length}`;

    if (score === keys.length) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);

    setShowResults(true);
  };

  const handleReset = () => {
    setDrops({ ...INITIAL_DROPS });
    setShowResults(false);
  };

  const handleShowAnswer = () => {
    const ans = {};
    QUESTIONS.forEach((q) => {
      ans[q.key] = q.correctVerb;
    });
    setDrops(ans);
    setShowResults(true);
  };

  const chipClasses = (id, qKey = null) => {
    const isCorrect =
      qKey && id === QUESTIONS.find((q) => q.key === qKey)?.correctVerb;
    const ok = showResults && qKey && isCorrect;
    const bad = showResults && qKey && !isCorrect;

    return [
      "inline-flex items-center px-3 py-0.5 rounded-md text-lg font-semibold",
      "cursor-grab select-none whitespace-nowrap transition-all duration-200",
     
    ].join(" ");
  };

  const zoneClasses = (qKey) => {
    const over = dragOver === qKey;

    return [
      "inline-flex items-center justify-center min-w-[110px] min-h-[30px] px-2",
      "border-b-2 border-dashed rounded-sm transition-all duration-200",
      over ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-transparent",
    ].join(" ");
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span>Look and write.
        </h1>

        {/* Verb bank */}
        <div
          className="flex items-center justify-center gap-3 px-4 py-2 mb-5 border border-gray-200 rounded-lg bg-gray-50"
          onDrop={onBankDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {VERB_CHIPS.map((chip) => (
            <span
              key={chip.id}
              draggable
              onDragStart={(e) => onBankDragStart(e, chip.id)}
              className={chipClasses(chip.id)}
            >
              {chip.label}
            </span>
          ))}
        </div>

        {/* Clown + questions */}
        <div className="flex items-start gap-10">
          <div className="min-w-[120px]">
            <img
              src={imgClown}
              alt="clown"
              className="max-w-90 max-h-50 object-contain"
            />
          </div>

          {/* Questions */}
          <div className="flex-1 flex flex-col gap-5">
            {QUESTIONS.map((q, idx) => {
              const isWrong =
                showResults &&
                drops[q.key] &&
                drops[q.key] !== q.correctVerb;

              return (
                <div key={q.key} className="flex items-center gap-3">
                  <span className="font-bold text-blue-900 text-lg max-w-4">
                    {idx + 1}
                  </span>

                  <div className="flex items-center flex-wrap gap-1 font-semibold text-lg text-gray-700">
                    <span>He</span>

                    {/* Drop zone */}
                    <div className="relative inline-block">
                      <div
                        className={zoneClasses(q.key)}
                        onDragOver={(e) => onZoneDragOver(e, q.key)}
                        onDragLeave={onZoneDragLeave}
                        onDrop={(e) => onZoneDrop(e, q.key)}
                      >
                        {drops[q.key] ? (
                          <span
                            draggable
                            onDragStart={(e) =>
                              onZoneChipDragStart(e, drops[q.key], q.key)
                            }
                            className={chipClasses(drops[q.key], q.key)}
                          >
                            {getChipLabel(drops[q.key])}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs font-normal">
                            ـــــ
                          </span>
                        )}
                      </div>

                      {/* ❌ Wrong Icon */}
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>

                    <span>{q.restOfSentence}.</span>
                  </div>

                  {/* Speech bubble */}
                  <div className="ml-auto relative inline-flex items-center px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 whitespace-nowrap">
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 max-w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-gray-300" />
                    <span className="absolute -left-[5px] top-1/2 -translate-y-1/2 max-w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[7px] border-r-white" />
                    {q.hint}
                  </div>
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

export default WB_Unit8_Page46_Q2;
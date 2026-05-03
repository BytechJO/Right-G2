import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import imgClown from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex E 1_1.svg";

const VERB_CHIPS = [
  { id: "has", label: "has" },
  { id: "doesnt", label: "doesn't have" },

 
];

const QUESTIONS = [
  { key: "q1", hint: "big hat", correctVerb: "doesnt", restOfSentence: "a big hat" },
  { key: "q2", hint: "short tie", correctVerb: "has", restOfSentence: "a short tie" },
  { key: "q3", hint: "big shoes", correctVerb: "has", restOfSentence: "big shoes" },
  { key: "q4", hint: "small jacket", correctVerb: "doesnt", restOfSentence: "a small jacket" },
];

const INITIAL_DROPS = { q1: "", q2: "", q3: "", q4: "" };

const WB_Unit8_Page46_Q2 = () => {
  const [drops, setDrops] = useState({ ...INITIAL_DROPS });
  const [showResults, setShowResults] = useState(false);

  const handleChange = (qKey, value) => {
    setDrops((prev) => ({
      ...prev,
      [qKey]: value,
    }));
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;

    const keys = Object.keys(drops);

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

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"120px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span> Look and write.
        </h1>

        <div className="flex items-start gap-10">
          {/* Image */}
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

                  <div className="flex items-center flex-wrap gap-2 font-semibold text-lg text-gray-700">
                    <span>He</span>

                    {/* 🔽 Dropdown */}
                    <div className="relative">
                      <select
                        value={drops[q.key]}
                        onChange={(e) =>
                          handleChange(q.key, e.target.value)
                        }
                        className={`px-2 py-1 border-b-2 bg-transparent outline-none
                          ${isWrong ? "border-red-500" : "border-gray-400"}`}
                      >
                        <option value="">----</option>
                        {VERB_CHIPS.map((chip) => (
                          <option key={chip.id} value={chip.id}>
                            {chip.label}
                          </option>
                        ))}
                      </select>

                      {/* ❌ Wrong icon */}
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-lg font-bold border-2 border-white shadow-lg">
                          ✕
                        </div>
                      )}
                    </div>

                    <span>{q.restOfSentence}.</span>
                  </div>

                  {/* Hint */}
                  <div className="ml-auto px-3 py-1 rounded-md border border-gray-300 bg-white text-lg font-medium text-gray-700">
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
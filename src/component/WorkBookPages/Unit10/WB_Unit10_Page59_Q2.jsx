import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgIceCream from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 9.svg";
import imgSwimming from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 10.svg";
import imgAtSchool from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 12.svg";
import imgAtPark from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 13.svg";
import imgBoyAvatar from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 11.svg";
import imgBoyAvatar2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 14.svg";

const WB_Unit10_Page59_Q2 = () => {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "", q4: "" });
  const [showResults, setShowResults] = useState(false);
  const CORRECT_E = {
    q1: "are eating",
    q2: "are swimming",
    q3: "are",
    q4: "are",
  };

  const OPTIONS = {
    q1: ["are eating", "is eating", "are playing"],
    q2: ["are swimming", "is swimming", "are running"],
    q3: ["are", "is", "am"],
    q4: ["are", "is", "am"],
  };

  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = Object.keys(CORRECT_E).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true); // 🔥 مهم

    let score = 0;
    Object.keys(CORRECT_E).forEach((id) => {
      if (answers[id] === CORRECT_E[id]) score++;
    });
    const total = Object.keys(CORRECT_E).length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({ q1: "", q2: "", q3: "", q4: "" });
    setShowResults(false)
  };

  const CustomSelect = ({ id }) => {
    const value = answers[id];

    return (
      <div className="relative inline-block mx-1">
        {/* ❌ Wrong Answer */}
        {showResults && value && value !== CORRECT_E[id] && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
            ✕
          </div>
        )}

        <select
          value={value}
          onChange={(e) => setAnswers({ ...answers, [id]: e.target.value })}
          disabled={showResults}
          className={`w-35 cursor-pointer p-1 border-b-2 bg-transparent focus:outline-none ${showResults && value && value !== CORRECT_E[id] && "border-red-500"}`}
        >
          <option value="">...</option>
          {OPTIONS[id].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span>Look and write. Read.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          <div className="hidden md:block absolute left-1/2 -bottom-58 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={imgBoyAvatar}
              alt="avatar"
              className="object-contain mt-20"
              style={{ height: "180px" }}
            />
            <img
              src={imgBoyAvatar2}
              alt="avatar"
              style={{ height: "180px" }}
              className="object-contain mt-20"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-600">1</span>
              <img
                src={imgIceCream}
                alt="ice cream"
                 className="object-cover"
                style={{height:"100px",width:"auto"}}
              />
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                They <CustomSelect id="q1" /> ice cream.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-end">
              <img
                src={imgSwimming}
                alt="swimming"
                className="object-cover"
                style={{height:"100px",width:"auto"}}

              />
              <span className="font-bold text-blue-600">2</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                They <CustomSelect id="q2" /> in the pool.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-600">3</span>
              <img
                src={imgAtSchool}
                alt="school"
                 className="object-cover"
                style={{height:"100px",width:"auto"}}
              />
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                We <CustomSelect id="q3" /> at school.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-end">
              <img
                src={imgAtPark}
                alt="park"
                 className="object-cover"
                style={{height:"100px",width:"auto"}}
              />
              <span className="font-bold text-blue-600">4</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                We <CustomSelect id="q4" /> at the park.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={() => {
              setAnswers(CORRECT_E);
                  setShowResults(true); // 🔥 مهم

            }}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit10_Page59_Q2;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgGirl from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 7.svg";
import imgBoy from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 8.svg";
// check
const WB_Unit10_Page58_Q2 = () => {
  const [answers, setAnswers] = useState({
    c1_1: "",
    c1_2: "",
    c1_3: "",
    c1_4: "",
    c1_5: "",
    c2_1: "",
    c2_2: "",
    c2_3: "",
    c2_4: "",
  });
  const [showResults, setShowResults] = useState(false);

  const COLORS = ["blue", "green", "yellow", "black", "red", "white", "pink"];

  const CORRECT_C = {
    c1_1: "blue",
    c1_2: "green",
    c1_3: "yellow",
    c1_4: "black",
    c1_5: "red",
    c2_1: "yellow",
    c2_2: "red",
    c2_3: "green",
    c2_4: "black",
  };

  const checkAnswers = () => {
    if(showResults)return
    const unanswered = Object.keys(CORRECT_C).filter((id) => !answers[id]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }
    setShowResults(true);
    let score = 0;
    Object.keys(CORRECT_C).forEach((id) => {
      if (answers[id] === CORRECT_C[id]) score++;
    });
    const total = Object.keys(CORRECT_C).length;
    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({
      c1_1: "",
      c1_2: "",
      c1_3: "",
      c1_4: "",
      c1_5: "",
      c2_1: "",
      c2_2: "",
      c2_3: "",
      c2_4: "",
    });
    setShowResults(false);
  };
  const COLOR_STYLES = {
    blue: "#2563eb",
    green: "#16a34a",
    yellow: "#eab308",
    black: "#000000",
    red: "#dc2626",
    white: "#9ca3af", // بدل الأبيض الرمادي عشان يبين
    pink: "#ec4899",
  };
  const ColorSelect = ({ id }) => {
    const value = answers[id];

    return (
      <div className="relative inline-block">
        {/* ❌ Wrong Answer */}
        {showResults && value && value !== CORRECT_C[id] && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
            ✕
          </div>
        )}

        <select
          value={value}
          onChange={(e) => setAnswers({ ...answers, [id]: e.target.value })}
          disabled={showResults}
          style={{
            color: value ? COLOR_STYLES[value] : "#999",
            fontWeight: "700",
          }}
          className={`mx-1 p-1 border-b-2 bg-transparent focus:outline-none transition-all ${
            showResults
              ? value === CORRECT_C[id]
                ? "border-gray-300"
                : "border-red-500"
              : "border-gray-300 focus:border-blue-400"
          }`}
        >
          <option value="">color</option>
          {COLORS.map((c) => (
            <option
              key={c}
              value={c}
              style={{
                color: COLOR_STYLES[c],
                fontWeight: "700",
              }}
            >
              {c}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"55px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Read, look, and write.
        </h1>

        <div className="space-y-4">
          {/* الفقرة الأولى - البنت */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={imgGirl}
              alt="girl"
              className="object-contain"
              style={{height:"200px",width:"auto"}}

            />
            <div className="flex-1 text-xl leading-loose text-gray-700 w-[90%]">
              <span className="font-bold text-blue-900 mr-2">1</span>
              She is wearing a <ColorSelect id="c1_1" /> T-shirt, a{" "}
              <ColorSelect id="c1_2" /> hat,
              <ColorSelect id="c1_3" /> socks, and <ColorSelect id="c1_4" />{" "}
              shoes. She is carrying some <ColorSelect id="c1_5" /> flowers.
            </div>
          </div>

          {/* الفقرة الثانية - الولد */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-xl leading-loose text-gray-700">
              <span className="font-bold text-blue-900 mr-2">2</span>
              He is wearing a <ColorSelect id="c2_1" /> T-shirt, a{" "}
              <ColorSelect id="c2_2" /> cap,
              <ColorSelect id="c2_3" /> socks and <ColorSelect id="c2_4" />{" "}
              shoes.
            </div>
            <img
              src={imgBoy}
              alt="boy"
              className="object-contain"
              style={{height:"200px",width:"120px"}}
            />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={() => {
              setAnswers(CORRECT_C);
              setShowResults(true);
            }}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit10_Page58_Q2;

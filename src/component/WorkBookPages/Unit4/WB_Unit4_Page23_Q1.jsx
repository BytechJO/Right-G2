import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { FaDownload } from "react-icons/fa6";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex E 4.svg";

const activityData = [
  { id: "e1", item: "teddy bears", img: img1, isPlural: true },
  { id: "e2", item: "trains", img: img2, isPlural: true },
  { id: "e3", item: "tennis rackets", img: img3, isPlural: true },
  { id: "e4", item: "a basketball", img: img4, isPlural: false },
];

const WB_Unit4_Page23_Q1 = () => {
  const [choices, setChoices] = useState({});
  const captureRef = useRef(null);
 const [showResults, setShowResults] = useState(false);
  const handleChoice = (itemId, mood) => {
    if(showResults)return
    setChoices((prev) => ({ ...prev, [itemId]: mood }));
  };

  const handleStartAgain = () => {
    setChoices({});
    setShowResults(false)
  };
const checkAnswers = () => {
  if (showResults) return;

  // ✅ تحقق إنو كل الأسئلة متجاوبة
  const allAnswered = activityData.every(
    (item) => choices[item.id]
  );

  if (!allAnswered) {
    ValidationAlert.info("Please answer all questions first.");
    return;
  }

  // ✅ إذا كله معبّي
  ValidationAlert.success("Good Job!!");
  setShowResults(true);
};

  const handledownload = async () => {
    const element = captureRef.current;

    const dataUrl = await toPng(element);

    const link = document.createElement("a");
    link.download = "activity.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div ref={captureRef}>
      <div className="main-container-component">
        <div className="div-forall">
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">E</span>What do you want? Circle and write
            "Yes, I do." or "No, I don't."
          </h1>

          <div className="space-y-6">
            {activityData.map((item, index) => {
              const currentChoice = choices[item.id];
              let answerText = "";
              if (currentChoice === "happy") answerText = "Yes, I do.";
              if (currentChoice === "sad") answerText = "No, I don't.";

              return (
                <div key={item.id} className="flex items-center gap-4">
                  <span className="font-bold text-blue-600 text-xl">{index + 1}</span>
                  <p className="text-xl">Do you want {item.item}?</p>
                  <img
                    src={item.img}
                    alt={item.item}
                    className="max-w-16 max-h-16 object-contain"
                  />

                  {/* الوجوه القابلة للنقر */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChoice(item.id, "happy")}
                      className={`text-3xl transition-transform transform ${currentChoice === "happy" ? "scale-125" : "opacity-50 hover:opacity-100"}`}
                    >
                      🙂
                    </button>
                    <button
                      onClick={() => handleChoice(item.id, "sad")}
                      className={`text-3xl transition-transform transform ${currentChoice === "sad" ? "scale-125" : "opacity-50 hover:opacity-100"}`}
                    >
                      ☹️
                    </button>
                  </div>

                  {/* مربع الحوار */}
                  <div className="flex-1 h-12 px-4 flex items-center bg-gray-100 rounded-full border border-gray-300 relative">
                    <p className="text-xl font-medium text-gray-700">
                      {answerText}
                    </p>
                    {/* شكل ذيل مربع الحوار */}
                    <div className="absolute left-0 -ml-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-300"></div>
                    <div className="absolute left-0 -ml-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="action-buttons-container">
            <button onClick={handleStartAgain} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={handledownload}
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
            >
              <FaDownload />
            </button>
            <button onClick={checkAnswers} className="check-button2">
              Finish ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit4_Page23_Q1;

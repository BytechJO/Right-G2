import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert"; // تأكد من صحة المسار في مشروعك
import Button from "../Button"; // تأكد من صحة المسار في مشروعك

// استيراد الصور (تأكد من تغيير المسارات لتناسب مشروعك)
import imgA from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 1.svg";
import imgB from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 2.svg";
import imgC from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 3.svg";
import imgD from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 4.svg";
import imgE from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 5.svg";
import imgF from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 6.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const exerciseFData = [
  { id: 1, sentence: "She isn't playing chess with her friend.", correct: "e" },
  { id: 2, sentence: "I'm sending an e-mail to my friend.", correct: "f" },
  { id: 3, sentence: "I'm cooking dinner for my family.", correct: "a" },
  { id: 4, sentence: "He isn't listening to the radio.", correct: "b" },
  { id: 5, sentence: "They aren't playing soccer.", correct: "d" },
  { id: 6, sentence: "We are looking at the hens.", correct: "c" },
];

const imagesData = [
  { id: "a", src: imgA, check: true },
  { id: "b", src: imgB, check: false },
  { id: "c", src: imgC, check: true },
  { id: "d", src: imgD, check: false },
  { id: "e", src: imgE, check: false },
  { id: "f", src: imgF, check: true },
];

const WB_Unit9_Page53_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
  });
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSelect = (id, value) => {
    if (locked || checked) return;
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const checkAnswers = () => {
    if (locked || checked) return;

    // ✅ أول شي نتحقق إذا في فراغات
    const unanswered = Object.values(userAnswers).filter((val) => !val);

    if (unanswered.length > 0) {
      ValidationAlert.info("Please fill all answers first!");
      return;
    }

    let correctCount = 0;
    exerciseFData.forEach((item) => {
      if (userAnswers[item.id] === item.correct) correctCount++;
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === exerciseFData.length) {
      ValidationAlert.success(`Score: ${correctCount}/${exerciseFData.length}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${exerciseFData.length}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${exerciseFData.length}`);
    }
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseFData.forEach((item) => (correctAnswers[item.id] = item.correct));
    setUserAnswers(correctAnswers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" });
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span>Read and look. Match pictures with
          sentences.
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sentences with Select */}
          <div className="flex-1 flex flex-col gap-2">
            {exerciseFData.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center w-full justify-between gap-4 text-lg"
              >
                <div className="flex items-center gap-4 text-lg">
                  <div className="relative">
                    <select
                      value={userAnswers[item.id]}
                      onChange={(e) => handleSelect(item.id, e.target.value)}
                      disabled={locked}
                      className={`w-12 h-10 border-b-2 text-lg border-gray-400 bg-transparent text-center font-bold text-blue-900 focus:outline-none appearance-none cursor-pointer
                                       
                                        ${checked && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? " border-red-500" : ""}
                                    `}
                    >
                      <option value=""></option>
                      {["a", "b", "c", "d", "e", "f"].map((letter) => (
                        <option key={letter} value={letter}>
                          {letter}
                        </option>
                      ))}
                    </select>
                    {checked && userAnswers[item.id] !== item.correct && (
                      <span className="absolute -right-2 top-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                        ✕
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-blue-900 w-4">{item.id}</span>
                  <span className="text-gray-800 font-medium">
                    {item.sentence}
                  </span>
                </div>

                <div
                  key={imagesData[i].id}
                  className="relative overflow-hidden"
                >
                  <img
                    src={imagesData[i].src}
                    alt={imagesData[i].id}
                    className="object-cover"
                    style={{ height: "90px", width: "auto" }}
                  />
                  
    
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit9_Page53_Q2;

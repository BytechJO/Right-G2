import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 6.svg";

import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const WB_Unit2_Page12_Q1 = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({
    sentence1: "",
    sentence2: "",
    sentence3: "",
    sentence4: "",
    sentence5: "",
    sentence6: "",
  });

  const correctAnswers = {
    sentence1: "Those",
    sentence2: "These",
    sentence3: "Those",
    sentence4: "These",
    sentence5: "Those",
    sentence6: "Those",
  };

  const handleShowAnswer = () => setAnswers(correctAnswers);
  const handleStartAgain = () => {
    setAnswers({
      sentence1: "",
      sentence2: "",
      sentence3: "",
      sentence4: "",
      sentence5: "",
      sentence6: "",
    });
    setShowAlert(false);
    setChecked(false);
  };

  const checkAnswers = () => {
    const allFilled = Object.values(answers).every(
      (answer) => answer.trim() !== "",
    );

    if (!allFilled) {
      ValidationAlert.warning("Please fill in all answers!");
      return; // نوقف التنفيذ إذا هناك input فارغ
    }

    let correct = 0;
    const total = 6;

    if (answers.sentence1 === correctAnswers.sentence1) correct++;
    if (answers.sentence2 === correctAnswers.sentence2) correct++;
    if (answers.sentence3 === correctAnswers.sentence3) correct++;
    if (answers.sentence4 === correctAnswers.sentence4) correct++;
    if (answers.sentence5 === correctAnswers.sentence5) correct++;
    if (answers.sentence6 === correctAnswers.sentence6) correct++;

    setScore({ correct, total });
    setChecked(true);
    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  const handleAnswerChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };
  const isWrong = (key) => {
    return answers[key] && answers[key] !== correctAnswers[key];
  };
  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span> Look and write.
        </h1>
        <div className="family-completion-activity" dir="ltr">
          <div className="sentences ">
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">1.</span>
              <img src={img1} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800 curesor-pointer">
                  <select
                    value={answers.sentence1}
                    onChange={(e) =>
                      handleAnswerChange("sentence1", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded b-2"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence1") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are ducks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">2.</span>
              <img src={img2} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800">
                  <select
                    value={answers.sentence2}
                    onChange={(e) =>
                      handleAnswerChange("sentence2", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence2") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are flowers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">3.</span>
              <img src={img3} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800">
                  <select
                    value={answers.sentence3}
                    onChange={(e) =>
                      handleAnswerChange("sentence3", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence3") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are butterflies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">4.</span>
              <img src={img4} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800">
                  <select
                    value={answers.sentence4}
                    onChange={(e) =>
                      handleAnswerChange("sentence4", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence4") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are birds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">5.</span>
              <img src={img5} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800">
                  <select
                    value={answers.sentence5}
                    onChange={(e) =>
                      handleAnswerChange("sentence5", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence5") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are rabbits.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl ">
              <span className="font-semibold text-blue-600 mr-2">6.</span>
              <img src={img6} className="max-w-24 max-h-24 object-contain" />
              <div className="flex-1">
                <p className="relative text-xl text-gray-800">
                  <select
                    value={answers.sentence6}
                    onChange={(e) =>
                      handleAnswerChange("sentence6", e.target.value)
                    }
                    className="mx-3 p-2 w-28 text-center text-lg rounded"
                  >
                    <option value="" disabled>
                      _______________
                    </option>
                    <option value="These">These</option>
                    <option value="Those">Those</option>
                  </select>
                  {/* ❌ علامة الخطأ */}
                  {checked && isWrong("sentence6") && (
                    <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      ✕
                    </div>
                  )}
                  are dogs.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
          {showAlert && (
            <ValidationAlert
              correct={score.correct}
              total={score.total}
              onClose={() => setShowAlert(false)}
            />
          )}
        </div>{" "}
      </div>
    </div>
  );
};

export default WB_Unit2_Page12_Q1;

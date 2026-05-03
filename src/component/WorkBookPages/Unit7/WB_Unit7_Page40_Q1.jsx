import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 46.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 47.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 48.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 45.svg";
const WB_Unit7_Page40_Q1 = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState({
    sentence1: "",
    sentence2: "",
    sentence3: "",
  });

  const correctAnswers = {
    sentence1: "Wednesday",
    sentence2: "Monday",
    sentence3: "Friday",
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({ sentence1: "", sentence2: "", sentence3: "" });
    setShowAlert(false);
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const values = Object.values(answers);

    const allEmpty = values.every((answer) => !answer || answer.trim() === "");
    const allFilled = values.every((answer) => answer && answer.trim() !== "");

    if (allEmpty) {
      ValidationAlert.info("Please fill in the answers first!");
      return;
    }

    if (!allFilled) {
      ValidationAlert.info("Please complete all answers!");
      return;
    }

    let correct = 0;
    const total = 3;

    if (answers.sentence1 === "Wednesday") correct++;
    if (answers.sentence2 === "Monday") correct++;
    if (answers.sentence3 === "Friday") correct++;

    setScore({ correct, total });
    setShowResults(true);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    }
  };

  const handleAnswerChange = (field, value) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const isWrongAnswer = (field) => {
    if (!showResults) return false;
    if (!answers[field]) return false;
    return answers[field] !== correctAnswers[field];
  };

  const getSelectClass = (field) => {
    if (!showResults) {
      return "mx-3 p-2 w-100 text-center text-lg border-b-2 border-gray-400 cursor-pointer";
    }

    const isCorrect = answers[field] === correctAnswers[field];

    return isCorrect
      ? "mx-3 p-2 w-100 text-center text-lg border-2 border-gray-500 bg-white rounded-lg cursor-pointer"
      : "mx-3 p-2 w-100 text-center text-lg border-2 border-red-500 bg-white rounded-lg cursor-pointer";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Look, read and write.
        </h1>

        <div className="max-w-4xl mx-auto" dir="ltr">
          <div className="flex w-full">
            <div className="sentences">
              <div className="flex items-center gap-4 p-5">
                <span className="font-semibold text-blue-900 text-xl mr-2">1.</span>
                <img src={img1} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    what day is it today?
                  </p>
                  <p className="text-xl text-gray-800 curesor-pointer">
                    it is
                    <span className="relative inline-block">
                      <select
                        value={answers.sentence1}
                        onChange={(e) =>
                          handleAnswerChange("sentence1", e.target.value)
                        }
                        disabled={showResults}
                        className={getSelectClass("sentence1")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence1") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl">
                <span className="font-semibold text-blue-900 text-xl mr-2">2.</span>
                <img src={img2} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    what day is it today?
                  </p>
                  <p className="text-xl text-gray-800">
                    It is
                    <span className="relative inline-block">
                      <select
                        value={answers.sentence2}
                        onChange={(e) =>
                          handleAnswerChange("sentence2", e.target.value)
                        }
                        disabled={showResults}
                        className={getSelectClass("sentence2")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence2") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl">
                <span className="font-semibold text-blue-900 text-xl mr-2">3.</span>
                <img src={img3} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    what day is it today?
                  </p>
                  <div className="text-xl text-gray-800 text-nowrap flex items-center">
                  <span className="text-xl text-gray-800 text-nowrap">  It is</span>
                    <span className="relative inline-block">
                      <select
                        value={answers.sentence3}
                        onChange={(e) =>
                          handleAnswerChange("sentence3", e.target.value)
                        }
                        disabled={showResults}
                        className={getSelectClass("sentence3")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence3") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={img4}
              className="object-contain"
              style={{ height: "500px", width: "auto" }}
            />
          </div>
          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page40_Q1;

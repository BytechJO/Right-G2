import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 1.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 3.svg";
import sound from "../../../assets/audio/WorkBook/cd1pg8instruction-adult-lady_6uG66wZc.mp3";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

// ⭐ Select بدل DropBox
const SelectBox = ({ id, value, isWrong, onChange, showAnswer }) => {
  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <select
        value={value || ""}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={showAnswer}
        className="WB-unit1-p8-q3-input"
        style={{
          fontSize: "20px",
          fontWeight: "600",
          padding: "5px",
          margin: "0 5px",
        }}
      >
        <option value="">__</option>
        <option value="r">r</option>
        <option value="l">l</option>
      </select>

      {isWrong && <div className="wrong-icon-unit1-page8-q3">✕</div>}
    </div>
  );
};

const WB_Unit1_Page8_Q3 = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [wrongAnswers, setWrongAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  const [answers, setAnswers] = useState({
    sentence1a: "",
    sentence1b: "",
    sentence2: "",
    sentence3: "",
  });

  const correctAnswers = {
    sentence1a: "r",
    sentence1b: "r",
    sentence2: "l",
    sentence3: "l",
  };

  const captions = [
    {
      start: 0.479,
      end: 7.259,
      text: "Page 8. Phonics exercise C. Listen, write, and read the sentences.",
    },
    {
      start: 8.42,
      end: 12.0,
      text: "1, look, there's a rabbit on the road.",
    },
    {
      start: 12.94,
      end: 16.0,
      text: "2, Larry has long legs.",
    },
    {
      start: 16.74,
      end: 19.68,
      text: "3, there is a lamp on the table.",
    },
  ];

  // ⭐ تغيير القيمة
  const handleChange = (field, value) => {
    if (showAnswer) return;

    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));

    setWrongAnswers((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setAnswers(correctAnswers);
  };

  const handleStartAgain = () => {
    setAnswers({
      sentence1a: "",
      sentence1b: "",
      sentence2: "",
      sentence3: "",
    });
    setWrongAnswers({});
    setShowAnswer(false);
    setShowAlert(false);
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    const allFilled = Object.values(answers).every((a) => a !== "");

    if (!allFilled) {
      ValidationAlert.info("Please fill in all answers!");
      return;
    }

    let correct = 0;
    const total = 4;

    const newWrongAnswers = {
      sentence1a: answers.sentence1a !== correctAnswers.sentence1a,
      sentence1b: answers.sentence1b !== correctAnswers.sentence1b,
      sentence2: answers.sentence2 !== correctAnswers.sentence2,
      sentence3: answers.sentence3 !== correctAnswers.sentence3,
    };

    if (!newWrongAnswers.sentence1a) correct++;
    if (!newWrongAnswers.sentence1b) correct++;
    if (!newWrongAnswers.sentence2) correct++;
    if (!newWrongAnswers.sentence3) correct++;

    setWrongAnswers(newWrongAnswers);
    setScore({ correct, total });
    setShowAnswer(true);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct > 0) {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span> Listen. Write and read the
          sentences.
        </h1>
        <div className="flex flex-col gap-2">
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={7.25}
        />

        <div className="family-completion-activity p-2">
          <div className="flex items-start gap-8">
            <div className="sentences flex-1">
              {/* Sentence 1 */}
              <div className="flex w-full gap-10 items-center">
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">1.</span>
                  Look there's a
                  <SelectBox
                    id="sentence1a"
                    value={answers.sentence1a}
                    isWrong={wrongAnswers.sentence1a}
                    onChange={handleChange}
                    showAnswer={showAnswer}
                  />
                  abbit on the
                  <SelectBox
                    id="sentence1b"
                    value={answers.sentence1b}
                    isWrong={wrongAnswers.sentence1b}
                    onChange={handleChange}
                    showAnswer={showAnswer}
                  />
                  oad.
                </p>
                <img
                  src={img1}
                  alt=""
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
              {/* Sentence 2 */}
              <div className="flex w-full gap-10 items-center">
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">2.</span>
                  Larry has long
                  <SelectBox
                    id="sentence2"
                    value={answers.sentence2}
                    isWrong={wrongAnswers.sentence2}
                    onChange={handleChange}
                    showAnswer={showAnswer}
                  />
                  egs.
                </p>
                <img
                  src={img2}
                  alt=""
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
              <div className="flex w-full gap-10 items-center">
                {/* Sentence 3 */}
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">3.</span>
                  There is a
                  <SelectBox
                    id="sentence3"
                    value={answers.sentence3}
                    isWrong={wrongAnswers.sentence3}
                    onChange={handleChange}
                    showAnswer={showAnswer}
                  />
                  amp on the table.
                </p>
                <img
                  src={img3}
                  alt=""
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
            </div>
          </div>

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

export default WB_Unit1_Page8_Q3;

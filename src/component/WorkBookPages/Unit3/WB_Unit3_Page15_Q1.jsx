import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 13.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 14.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 15.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 16.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page15_Q1.css";
import Button from "../Button";
const rows = [
  {
    id: 1,
    number: 1,
    text: "It can’t swim.",
    wordKey: "swim",
    imageKey: "img1",
    img: img1,
    imgHeight: "100px",
  },
  {
    id: 2,
    number: 2,
    text: "He can play the drum.",
    wordKey: "drum",
    imageKey: "img2",
    img: img2,
    imgHeight: "100px",
  },
  {
    id: 3,
    number: 3,
    text: "He can’t ride a bike.",
    wordKey: "bike",
    imageKey: "img3",
    img: img3,
    imgHeight: "100px",
  },
  {
    id: 4,
    number: 4,
    text: "It can climb the tree.",
    wordKey: "tree",
    imageKey: "img4",
    img: img4,
    imgHeight: "100px",
  },
];

const correctMatches = [
  { word: "swim", image: "img4" },
  { word: "drum", image: "img3" },
  { word: "bike", image: "img1" },
  { word: "tree", image: "img2" },
];

const WB_Unit3_Page15_Q1 = () => {
  const [lines, setLines] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [locked, setLocked] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  const getDotPosition = (selector) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const el = document.querySelector(selector);

    if (!el) return { x: 0, y: 0 };

    const dotRect = el.getBoundingClientRect();

    return {
      x: dotRect.left - rect.left + dotRect.width / 2,
      y: dotRect.top - rect.top + dotRect.height / 2,
    };
  };

  const resetState = () => {
    setLines([]);
    setWrongWords([]);
    setFirstDot(null);
    setShowAnswer(false);
    setLocked(false);
  };

  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return;

    const word = e.currentTarget.dataset.word;
    const { x, y } = getDotPosition(`[data-word="${word}"]`);

    setSelectedWord(word); // ✅ تحديد الجملة

    setFirstDot({
      word,
      x,
      y,
    });
  };

  const handleEndDotClick = (e) => {
    if (showAnswer || locked || !firstDot) return;

    const image = e.currentTarget.dataset.image;
    const { x, y } = getDotPosition(`[data-image="${image}"]`);

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: x,
      y2: y,
      word: firstDot.word,
      image,
    };

    setLines((prev) => {
      const withoutSameWord = prev.filter(
        (line) => line.word !== firstDot.word,
      );

      const withoutSameImage = withoutSameWord.filter(
        (line) => line.image !== image,
      );

      return [...withoutSameImage, newLine];
    });

    setSelectedImage(image); // ✅ تحديد الصورة

    // ✅ بعد الربط امسحي التحديد
    setTimeout(() => {
      setSelectedWord(null);
      setSelectedImage(null);
    }, 100);

    setFirstDot(null);
  };
  const handleCheckAnswers = () => {
    if (showAnswer || locked) return;

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let correctCount = 0;
    const wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair) => pair.word === line.word && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount += 1;
      } else {
        wrong.push(line.word);
      }
    });

    setWrongWords(wrong);
    setLocked(true);

    const total = correctMatches.length;
    const scoreMessage = `Score: ${correctCount} / ${total}`;

    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const handleShowAnswer = () => {
    const finalLines = correctMatches.map((match) => {
      const start = getDotPosition(`[data-word="${match.word}"]`);
      const end = getDotPosition(`[data-image="${match.image}"]`);

      return {
        ...match,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      };
    });

    setLines(finalLines);
    setWrongWords([]);
    setFirstDot(null);
    setShowAnswer(true);
    setLocked(true);
  };

  const isWordWrong = (wordKey) => wrongWords.includes(wordKey);

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"30px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Read, look, and match.
        </h1>

        <div className="WB-unit2-page15-q1-matching-area" ref={containerRef}>
          {rows.map((row) => (
            <div key={row.id} className="WB-unit2-page15-q1-row">
              <div className="WB-unit2-page15-q1-word-side">
                <span className="WB-unit2-page15-q1-number">{row.number}</span>

                <span
                  className={`WB-unit2-page15-q1-word-text ${
                    selectedWord === row.wordKey
                      ? "text-red-600 underline"
                      : ""
                  } ${
                    locked || showAnswer
                      ? "WB-unit2-page15-q1-disabled-hover"
                      : ""
                  }`}
                  onClick={() =>
                    !locked &&
                    !showAnswer &&
                    document
                      .querySelector(`[data-word="${row.wordKey}"]`)
                      ?.click()
                  }
                >
                  {row.text}
                </span>

                {isWordWrong(row.wordKey) && (
                  <span className="WB-unit2-page15-q1-error-mark">✕</span>
                )}

                <div className="WB-unit2-page15-q1-dot-wrapper">
                  <div
                    className={`WB-unit2-page15-q1-dot WB-unit2-page15-q1-start-dot ${
                      selectedWord === row.wordKey
                        ? "bg-red-600 scale-125 shadow-lg"
                        : ""
                    }`}
                    data-word={row.wordKey}
                    onClick={handleStartDotClick}
                  />
                </div>
              </div>

              <div className="WB-unit2-page15-q1-image-side">
                <div className="WB-unit2-page15-q1-dot-wrapper">
                  <div
                    className={`WB-unit2-page15-q1-dot WB-unit2-page15-q1-end-dot ${
                      selectedImage === row.imageKey
                        ? "bg-red-600 scale-125 shadow-lg"
                        : ""
                    }`}
                    data-image={row.imageKey}
                    onClick={handleEndDotClick}
                  />
                </div>

                <div className="WB-unit2-page15-q1-image-box">
                  <img
                    src={row.img}
                    className={`${
                      selectedImage === row.imageKey
                        ? "border-2 border-red-600 scale-95 shadow-lg"
                        : ""
                    } ${
                      locked || showAnswer
                        ? "WB-unit2-page15-q1-disabled-hover"
                        : ""
                    }`}
                    alt={row.wordKey}
                    onClick={() =>
                      !locked &&
                      !showAnswer &&
                      document
                        .querySelector(`[data-image="${row.imageKey}"]`)
                        ?.click()
                    }
                    style={{ height: "100px", width: "auto" }}
                  />
                </div>
              </div>
            </div>
          ))}

          <svg className="WB-unit2-page15-q1-lines-layer">
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="3"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={resetState}
          checkAnswers={handleCheckAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit3_Page15_Q1;

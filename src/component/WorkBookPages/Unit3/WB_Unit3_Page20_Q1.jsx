import React, { useState, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Ex A 6.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const grid = [
  ["j", "e", "a", "n", "s"],
  ["u", "r", "j", "a", "m"],
  ["i", "y", "o", "y", "o"],
  ["c", "y", "j", "e", "t"],
  ["e", "y", "a", "r", "n"],
];

const targetWords = {
  jeans: {
    id: "w1",
    coords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
  yoyo: {
    id: "w2",
    coords: [
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ],
  },
  juice: {
    id: "w3",
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ],
  }, // مثال لكلمة عمودية
  jet: {
    id: "w4",
    coords: [
      [3, 2],
      [3, 3],
      [3, 4],
    ],
  },
  yarn: {
    id: "w5",
    coords: [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
  },
  jam: {
    id: "w6",
    coords: [
      [1, 2],
      [1, 3],
      [1, 4],
    ],
  },
};

const writeList = [
  { id: "w1", word: "jeans", img: img1 },
  { id: "w2", word: "yoyo", img: img2 },
  { id: "w3", word: "juice", img: img3 },
  { id: "w4", word: "jet", img: img4 },
  { id: "w5", word: "yarn", img: img5 },
  { id: "w6", word: "jam", img: img6 },
];

const WB_Unit3_Page20_Q1 = () => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // دالة للتحقق مما إذا كانت الخلية جزءاً من كلمة تم العثور عليها
  const isCellFound = (row, col) => {
    return foundWords.some((word) =>
      targetWords[word].coords.some(
        (coord) => coord[0] === row && coord[1] === col,
      ),
    );
  };

  // دالة للتحقق مما إذا كانت الخلية محددة حالياً
  const isCellSelected = (row, col) => {
    return selectedCells.some((cell) => cell[0] === row && cell[1] === col);
  };

  // دالة عند النقر على خلية
  const handleCellClick = (row, col) => {
    setShowResults(false);
    const newSelectedCells = [...selectedCells, [row, col]];
    setSelectedCells(newSelectedCells);
  };

  // Hook للتحقق من الكلمات عند تغيير التحديد
  useEffect(() => {
    // تحويل إحداثيات الخلايا المحددة إلى سلسلة نصية لسهولة المقارنة
    const selectedCoordsString = JSON.stringify(selectedCells.sort());

    for (const word in targetWords) {
      const targetCoordsString = JSON.stringify(
        targetWords[word].coords.sort(),
      );
      if (selectedCoordsString === targetCoordsString) {
        if (!foundWords.includes(word)) {
          const newFoundWords = [...foundWords, word];
          setFoundWords(newFoundWords);
          // تعبئة حقل الكتابة تلقائياً
          setWrittenAnswers((prev) => ({
            ...prev,
            [targetWords[word].id]: word,
          }));
        }
        setSelectedCells([]); // إعادة تعيين التحديد بعد العثور على كلمة
        break;
      }
    }
  }, [selectedCells, foundWords]);

  const handleShowAnswer = () => {
    const allWords = Object.keys(targetWords);
    setFoundWords(allWords);
    const correctWrites = {};
    allWords.forEach((word) => {
      correctWrites[targetWords[word].id] = word;
    });
    setWrittenAnswers(correctWrites);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelectedCells([]);
    setFoundWords([]);
    setWrittenAnswers({});
    setShowResults(false);
  };
  const checkAnswers = () => {
    if(showResults)return
    const allFilled = writeList.every(
      (item) =>
        writtenAnswers[item.id] && writtenAnswers[item.id].trim() !== "",
    );

    if (!allFilled) {
      ValidationAlert.info("Please complete all the inputs first.");
      return;
    }

    setShowResults(true);
    let score = foundWords.length;

    if (score === writeList.length) {
      ValidationAlert.success(`Score: ${score} / ${writeList.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${writeList.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${writeList.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Look, read, and write. Circle the
          words.
        </h1>

        <div className="grid grid-cols-[1fr_1fr] gap-6">
          {/* شبكة الحروف */}
          <div className="grid grid-cols-5 gap-1 p-2 bg-gray-200 rounded-lg max-w-100 max-h-120">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`max-w-12 max-h-12 flex items-center justify-center text-2xl font-bold uppercase rounded-md cursor-pointer transition-all
                                ${
                                  isCellFound(rowIndex, colIndex)
                                    ? "bg-yellow-300 text-yellow-800"
                                    : isCellSelected(rowIndex, colIndex)
                                      ? "bg-blue-300"
                                      : "bg-white hover:bg-gray-100"
                                }`}
                >
                  {letter}
                </div>
              )),
            )}
          </div>

          <div className="space-y-2">
            {writeList.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3"
                style={{ justifyContent: "space-between" }}
              >
                <div className="flex gap-5">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                  <input
                    type="text"
                    value={writtenAnswers[item.id] || ""}
                    readOnly
                    className="max-w-full bg-transparent border-b-2 border-gray-300 focus:outline-none"
                  />
                </div>
                <img
                  src={item.img}
                  alt={item.word}
                  // className="max-w-10 max-h-10 object-contain"
                  style={{ height: "75px",width:"100px" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page20_Q1;

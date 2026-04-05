import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const colorsList = [
  { name: "Gray", value: "gray" },
  { name: "Green", value: "green" },
  { name: "Black", value: "black" },
  { name: "Yellow", value: "yellow" },
  { name: "White", value: "white" },
  { name: "Brown", value: "brown" },
  { name: "Red", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Blue", value: "blue" },
  { name: "Pink", value: "pink" },
  { name: "Purple", value: "purple" },
];

const correctAnswers = {
  peter: { pants: "gray", jacket: "green", shoes: "black" },
  joanna: { dress: "yellow", socks: "white", shoes: "brown" },
  mark: { shorts: "red", shirt: "white", hat: "orange" },
  susan: { skirt: "blue", shirt: "pink", glasses: "purple" },
};

const ReadAndColor = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [colors, setColors] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activePart, setActivePart] = useState(null);

  const handleColorPart = (person, part) => {
    // خزّني الجزء اللي انكبس
    setActivePart({ person, part });

    // افتحي الباليت
    setShowPalette(true);
    setColors((prev) => ({
      ...prev,
      [person]: {
        ...(prev[person] || {}),
        [part]: selectedColor,
      },
    }));
  };

  const isCorrect = (person, part) => {
    return colors[person]?.[part] === correctAnswers[person][part];
  };

  const checkAnswers = () => {
    let score = 0;
    let total = 0;

    Object.keys(correctAnswers).forEach((person) => {
      Object.keys(correctAnswers[person]).forEach((part) => {
        total++;
        if (isCorrect(person, part)) score++;
      });
    });

    setShowResults(true);

    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else ValidationAlert.warning(msg);
  };

  const handleStartAgain = () => {
    setColors({});
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">D</span> Read and color.{" "}
        </h1>
        {/* الشخصيات */}
        <div className="flex justify-around mt-6">
          {/* PETER */}
          <div className="text-center">
            <p>Peter</p>
            <svg width="80" height="120">
              <rect
                x="20"
                y="40"
                width="40"
                height="50"
                fill={colors.peter?.pants || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("peter", "pants")}
              />
              <rect
                x="20"
                y="10"
                width="40"
                height="30"
                fill={colors.peter?.jacket || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("peter", "jacket")}
              />
              <rect
                x="20"
                y="90"
                width="15"
                height="10"
                fill={colors.peter?.shoes || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("peter", "shoes")}
              />
            </svg>
          </div>

          {/* JOANNA */}
          <div className="text-center">
            <p>Joanna</p>
            <svg width="80" height="120">
              <rect
                x="20"
                y="30"
                width="40"
                height="60"
                fill={colors.joanna?.dress || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("joanna", "dress")}
              />
              <rect
                x="20"
                y="90"
                width="15"
                height="10"
                fill={colors.joanna?.shoes || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("joanna", "shoes")}
              />
            </svg>
          </div>

          {/* MARK */}
          <div className="text-center">
            <p>Mark</p>
            <svg width="80" height="120">
              <rect
                x="20"
                y="50"
                width="40"
                height="30"
                fill={colors.mark?.shorts || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("mark", "shorts")}
              />
              <rect
                x="20"
                y="20"
                width="40"
                height="30"
                fill={colors.mark?.shirt || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("mark", "shirt")}
              />
            </svg>
          </div>

          {/* SUSAN */}
          <div className="text-center">
            <p>Susan</p>
            <svg width="80" height="120">
              <rect
                x="20"
                y="50"
                width="40"
                height="40"
                fill={colors.susan?.skirt || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("susan", "skirt")}
              />
              <rect
                x="20"
                y="20"
                width="40"
                height="30"
                fill={colors.susan?.shirt || "#fff"}
                stroke="#000"
                onClick={() => handleColorPart("susan", "shirt")}
              />
            </svg>
          </div>
        </div>
        {/* النص */}
        <div className="mt-6 text-start text-lg">
          <p>Peter has gray pants and a green jacket. His shoes are black.</p>
          <p>Joanna has a yellow dress, white socks, and brown shoes.</p>
          <p>Mark has red shorts and a white shirt. His hat is orange.</p>
          <p>
            Susan has a blue skirt and a pink shirt. Her glasses are purple.
          </p>
        </div>
        {/* لوحة الألوان */}
        {showPalette && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {colorsList.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  if (!activePart) return;

                  const { person, part } = activePart;

                  setColors((prev) => ({
                    ...prev,
                    [person]: {
                      ...(prev[person] || {}),
                      [part]: c.value,
                    },
                  }));

                  setSelectedColor(c.value);
                  setShowPalette(false);
                  setActivePart(null); // مهم
                }}
                className={`w-8 h-8 rounded border ${
                  selectedColor === c.value ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}
        {/* الأزرار */}
        <div className="mt-6">
          <Button
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadAndColor;

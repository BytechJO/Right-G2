import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import find_img from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page 38/Ex E 1.svg";

/* ================= DATA ================= */

const items = [
  {
    key: "cake",
    label: "cake",
    area: { x1: 19.63, y1: 41.15, x2: 29.63, y2: 56.5385 },
  },
  {
    key: "rain",
    label: "rain",
    area: { x1: 31.44, y1: 50.73, x2: 45.88, y2: 57.46 },
  },
  {
    key: "paint",
    label: "paint",
    area: {
      x1: 61.793,
      y1: 9.04,
      x2: 91.48,
      y2: 85.19,
    },
  },
];

/* ================= COMPONENT ================= */

const Review4_Page2_Q2 = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [circles, setCircles] = useState({});
  const [checked, setChecked] = useState(false);
  const [wrongItems, setWrongItems] = useState([]);
  /* ================= IMAGE CLICK ================= */

  const handleImageClick = (e) => {
    if (!selectedItem || checked) return;

    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`x: ${x.toFixed(4)}, y: ${y.toFixed(4)}`);
    setCircles((prev) => ({
      ...prev,
      [selectedItem]: { x, y },
    }));
  };

  /* ================= CHECK ANSWER ================= */

  const handleCheck = () => {
    if (checked) return;
    if (Object.keys(circles).length < items.length) {
      ValidationAlert.info("Pay attention!", "Please circle all the words.");
      return;
    }

    let score = 0;
    let wrong = [];

    items.forEach((item) => {
      const p = circles[item.key];
      if (!p) {
        wrong.push(item.key);
        return;
      }

      if (
        p.x >= item.area.x1 &&
        p.x <= item.area.x2 &&
        p.y >= item.area.y1 &&
        p.y <= item.area.y2
      ) {
        score++;
      } else {
        wrong.push(item.key);
      }
    });

    setWrongItems(wrong); // 🔥 هون المهم
    setChecked(true);

    const color =
      score === items.length ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${score} / ${items.length}
      </span>
    </div>
  `;

    if (score === items.length) ValidationAlert.success(scoreMessage);
    else if (score === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);
  };
  /* ================= SHOW ANSWER ================= */

  const handleShowAnswer = () => {
    const correct = {};
    items.forEach((item) => {
      correct[item.key] = {
        x: (item.area.x1 + item.area.x2) / 2,
        y: (item.area.y1 + item.area.y2) / 2,
      };
    });

    setCircles(correct);
    setChecked(true);
  };

  /* ================= RESET ================= */

  const handleStartAgain = () => {
    setSelectedItem(null);
    setCircles({});
    setChecked(false);
  };

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h5 className="header-title-page8">
          <span style={{ marginRight: "20px" }}>E</span> Does it have{" "}
          <span style={{ color: "#2e3192" }}>long a</span>?Look and circle.
        </h5>

        {/* WORD BUTTONS */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {items.map((item) => (
            <div key={item.key} style={{ position: "relative" }}>
              {/* ❌ علامة X */}
              {checked && wrongItems.includes(item.key) && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    border: "1px solid white",
                    zIndex: 2,
                  }}
                >
                 ✕
                </span>
              )}

              <button
                onClick={() => setSelectedItem(item.key)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "12px",
                  background: "white",
                  border:
                    selectedItem === item.key
                      ? "2px solid #007bff"
                      : "1px solid #999",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE */}
      <div style={{ position: "relative", marginTop: "20px" }}>
        <img
          src={find_img}
          alt="classroom"
          style={{
            height: "50vh",
            width: "auto",
            cursor: selectedItem ? "crosshair" : "default",
            display: "block",
          }}
          onClick={handleImageClick}
        />

        {/* DRAW CIRCLES */}
        {Object.entries(circles).map(([key, point]) => (
          <div
            key={key}
            style={{
              position: "absolute",
              top: `${point.y}%`,
              left: `${point.x}%`,
              width: "9%",
              height: "10%",
              border: "3px solid red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={handleStartAgain}>
          Start Again ↻
        </button>

        <button className="show-answer-btn" onClick={handleShowAnswer}>
          Show Answer
        </button>

        <button className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Review4_Page2_Q2;

import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";

const Review10_Page2_Q2 = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [locked, setLocked] = useState(false);

  const images = [
    { id: 0, img: img1 },
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
  ];

  // ✅ toggle select
  const toggleSelect = (id) => {
    if (locked) return;

    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const correctAnswers = [0, 3];

  const checkAnswers = () => {
    if (locked) return;

    if (selectedImages.length === 0) {
      ValidationAlert.info("Please select at least one picture.");
      return;
    }

    let correct = 0;

    correctAnswers.forEach((id) => {
      if (selectedImages.includes(id)) correct++;
    });

    const total = correctAnswers.length;

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <b>Score: ${correct} / ${total}</b>
      </div>
    `;

    if (correct === total && selectedImages.length === total)
      ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setLocked(true);
  };

  // ✅ SHOW ANSWERS
  const showAnswers = () => {
    setSelectedImages(correctAnswers);
    setLocked(true);
  };

  // ✅ RESET
  const reset = () => {
    setSelectedImages([]);
    setLocked(false);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-[80%]">
        <h5 className="header-title-page8">
          <span className=" mr-4">F</span>
          Which pictures have<span style={{ color: "#2e3192" }}>long e</span> ?
          Circle.
        </h5>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {images.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              style={{
                cursor: "pointer",
                padding: "20px",
                borderRadius: "50%",
                border: selectedImages.includes(item.id)
                  ? "3px solid red"
                  : "3px solid transparent",
                transition: "0.2s",
                marginTop: "30px",
              }}
            >
              <img
                src={item.img}
                alt=""
                style={{
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>

        {/* ⭐ الأزرار (كما هي) */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review10_Page2_Q2;

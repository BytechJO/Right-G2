import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Ex F 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 91/Ex F 4.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_001_nest.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_002_feet.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_003_rest.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_004_eat.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_005_desk.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_006_egg.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_007_beg.mp3";
import clip7 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_008_meat.mp3";
import clip8 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_009_vet.mp3";
import clip9 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_010_seal.mp3";
import clip10 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_011_net.mp3";
import clip11 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_012_tea.mp3";
import clip12 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_013_pen.mp3";
import clip13 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_014_pet.mp3";
import clip14 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_015_ten.mp3";
const clips = {
  nest: clip0,
  feet: clip1,
  rest: clip2,
  eat: clip3,
  desk: clip4,
  egg: clip5,
  beg: clip6,
  meat: clip7,
  vet: clip8,
  seal: clip9,
  net: clip10,
  tea: clip11,
  pen: clip12,
  pet: clip13,
  ten: clip14,
};
const Review10_Page2_Q2 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = () => {
    const a = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    scopeRef.current?.querySelectorAll("audio").forEach((a) => {
      a.pause();
      try {
        a.currentTime = 0;
      } catch {
        /* media unavailable */
      }
    });
  };
  const listen = (key, text) => {
    const src = clips[normalizeAudioText(text)];
    if (!src) return;
    stopAudio();
    const a = new Audio(src);
    audioRef.current = a;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== a) return;
      a.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    a.onended = finish;
    a.onerror = fail;
    try {
      a.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (e) => {
      const a = audioRef.current;
      if (!a || e.target === a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      a.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const a = audioRef.current;
      audioRef.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
    };
  }, []);
  const badge = (key) =>
    playingKey === key && (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: "black",
          pointerEvents: "none",
          zIndex: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const activation = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) action();
    }
  };
  const activationUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const feedbackStyle = (selected, result) => ({
    ...(selected && result
      ? {
          borderColor: result === "correct" ? "#16a34a" : "#ef4444",
          boxShadow: result === "correct" ? "0 3px 0 #16a34a" : undefined,
        }
      : {}),
    ...(selected ? { backgroundColor: "#dbeafe" } : {}),
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);

  const images = [
    { id: 0, img: img1 },
    { id: 1, img: img2 },
    { id: 2, img: img3 },
    { id: 3, img: img4 },
  ];

  // ✅ toggle select
  const toggleSelect = (id) => {
    listen(`image-${id}`, ["eat", "desk", "pen", "seal"][id]);
    if (locked || results[id] === "correct") return;
    setResults((prev) => ({ ...prev, [id]: null }));
    setAnnouncement(`Picture ${id + 1} selected or removed.`);

    setSelectedImages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        if (prev.length >= 2) return prev; // ❌ يمنع اختيار أكثر من 2
        return [...prev, id];
      }
    });
  };
  const correctAnswers = [0, 3];

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    stopAudio();

    if (locked) return;

    if (selectedImages.length === 0) {
      ValidationAlert.info("Please select at least one picture.");
      setAnnouncement("Please select at least one picture.");
      return;
    }

    let correct = 0;

    correctAnswers.forEach((id) => {
      if (selectedImages.includes(id)) correct++;
    });

    const total = correctAnswers.length;

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size: 20px; text-align:center; margin-top: 8px;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correct} /${total}
        </span>
      </div>
    `;
    if (correct === total && selectedImages.length === total)
      (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setResults(
      Object.fromEntries(
        selectedImages.map((id) => [
          id,
          correctAnswers.includes(id) ? "correct" : "wrong",
        ]),
      ),
    );
    setLocked(correct === total);
    setAnnouncement(`Score ${correct} out of ${total}.`);
  };

  // ✅ SHOW ANSWERS
  const showAnswers = () => {
    stopAudio();
    setResults(Object.fromEntries(correctAnswers.map((id) => [id, "correct"])));
    setAnnouncement("All correct pictures shown and locked.");
    setSelectedImages(correctAnswers);
    setLocked(true);
  };

  // ✅ RESET
  const reset = () => {
    stopAudio();
    setResults({});
    setAnnouncement("Activity reset.");
    setSelectedImages([]);
    setLocked(false);
  };

  return (
    <div ref={scopeRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall gap-2">
        <div className="header-title-page8">
          <ExerciseHeader
            isReview={true}
            sectionLetter="F"
            title={"Which pictures have long e? Circle."}
            subTitle={
              "Read or listen carefully, then tap the option you would circle on the printed page."
            }
          />
        </div>

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
              role="button"
              tabIndex={0}
              aria-pressed={selectedImages.includes(item.id)}
              aria-disabled={locked || results[item.id] === "correct"}
              aria-label={
                [
                  "A girl holding chocolate.",
                  "A school desk and chair.",
                  "A red pen.",
                  "A seal.",
                ][item.id]
              }
              className=" focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
              onKeyDown={(e) => activation(e, () => toggleSelect(item.id))}
              onKeyUp={activationUp}
              onClick={() => toggleSelect(item.id)}
              style={{
                position: "relative", // مهم
                cursor: "pointer",
                padding: "20px",
                borderRadius: "50%",
                border: selectedImages.includes(item.id)
                  ? "3px solid red"
                  : "3px solid transparent",
                transition: "0.2s",
                marginTop: "30px",
                ...feedbackStyle(
                  selectedImages.includes(item.id),
                  results[item.id],
                ),
              }}
            >
              <img
                src={item.img}
                alt=""
                aria-hidden="true"
                style={{
                  height: "120px",
                  objectFit: "cover",
                }}
              />

              {badge(`image-${item.id}`)}
              {/* ❌ علامة الخطأ */}
              {results[item.id] === "wrong" &&
                selectedImages.includes(item.id) &&
                !correctAnswers.includes(item.id) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      width: "25px",
                      height: "25px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px",
                      border: "2px solid white",
                    }}
                  >
                    ✕
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* ⭐ الأزرار (كما هي) */}
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
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

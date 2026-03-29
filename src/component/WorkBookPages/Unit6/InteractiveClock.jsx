import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
const InteractiveClock = ({
  targetHour,
  targetMinute,
  label = "",
  onCorrect,
  size = 180,
  showFeedback = true,
  showDigitalTime = true,
  initialHour = 12,
  initialMinute = 0,
  showAnswerTrigger = 0,
  resetTrigger = 0,
}) => {
  const [handPosition, setHandPosition] = useState({
    hour: initialHour % 12,
    minute: initialMinute,
  });

  const [draggingHand, setDraggingHand] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const clockRef = useRef(null);

  const normalizedTargetHour = targetHour % 12;

  useEffect(() => {
    const isMatching =
      handPosition.hour === normalizedTargetHour &&
      handPosition.minute === targetMinute;

    setIsCorrect(isMatching);

    if (onCorrect) {
      onCorrect(isMatching);
    }
  }, [handPosition, normalizedTargetHour, targetMinute, onCorrect]);

  useEffect(() => {
    if (showAnswerTrigger === 0) return;

    setHandPosition({
      hour: targetHour % 12,
      minute: targetMinute,
    });
    setIsCorrect(true);
  }, [showAnswerTrigger, targetHour, targetMinute]);

  useEffect(() => {
    if (resetTrigger === 0) return;

    setHandPosition({
      hour: initialHour % 12,
      minute: initialMinute,
    });
    setIsCorrect(false);
  }, [resetTrigger, initialHour, initialMinute]);

  const handleHandMouseDown = (hand) => {
    setDraggingHand(hand);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!draggingHand || !clockRef.current) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      let clientX;
      let clientY;

      if ("touches" in e && e.touches?.length) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left - centerX;
      const y = clientY - rect.top - centerY;

      let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;

      if (draggingHand === "minute") {
        const minute = Math.round(angle / 6) % 60;
        setHandPosition((prev) => ({
          ...prev,
          minute,
        }));
      } else {
        const hour = Math.round(angle / 30) % 12;
        setHandPosition((prev) => ({
          ...prev,
          hour,
        }));
      }
    };

    const handleUp = () => {
      setDraggingHand(null);
    };

    if (draggingHand) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchend", handleUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchend", handleUp);
    };
  }, [draggingHand]);

  const minuteRotation = (handPosition.minute / 60) * 360;
  const hourRotation =
    ((handPosition.hour + handPosition.minute / 60) / 12) * 360;

  const formatTime = (hour, minute) => {
    if (hour == null || minute == null) return "--:--";

    const h = hour === 0 ? 12 : hour;
    const m = String(minute).padStart(2, "0");

    return `${h}:${m}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100 shadow-lg border-4 border-purple-300" />

        <svg
          ref={clockRef}
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full"
          style={{ userSelect: "none" }}
        >
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
            const angle = (idx * 30 - 90) * (Math.PI / 180);
            const x = 100 + 75 * Math.cos(angle);
            const y = 100 + 75 * Math.sin(angle);

            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-purple-700 font-bold"
                fontSize="16"
              >
                {num}
              </text>
            );
          })}

          <circle cx="100" cy="100" r="5" className="fill-purple-700" />

          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="#14B8A6"
            strokeWidth="5"
            strokeLinecap="round"
            style={{
              transform: `rotate(${minuteRotation}deg)`,
              transformOrigin: "100px 100px",
              cursor: "grab",
            }}
            onMouseDown={() => handleHandMouseDown("minute")}
            onTouchStart={() => handleHandMouseDown("minute")}
          />

          <line
            x1="100"
            y1="100"
            x2="100"
            y2="55"
            stroke="#A855F7"
            strokeWidth="7"
            strokeLinecap="round"
            style={{
              transform: `rotate(${hourRotation}deg)`,
              transformOrigin: "100px 100px",
              cursor: "grab",
            }}
            onMouseDown={() => handleHandMouseDown("hour")}
            onTouchStart={() => handleHandMouseDown("hour")}
          />
        </svg>

        {!isCorrect && showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
              <span className="text-white text-sm font-bold leading-none">
                ✕
              </span>
            </div>
          </div>
        )}
      </div>

      {showDigitalTime && (
        <div className="text-lg font-bold text-purple-700 flex gap-2 justify-center items-center">
          <div className="text-sm text-gray-500">Your time:</div>
          <div className="text-xl font-bold text-purple-700">
            {formatTime(handPosition.hour, handPosition.minute)}
          </div>
        </div>
      )}

      <div className="text-center text-gray-700 font-medium min-h-[48px]">
        {label}
      </div>
    </div>
  );
};

export default InteractiveClock;

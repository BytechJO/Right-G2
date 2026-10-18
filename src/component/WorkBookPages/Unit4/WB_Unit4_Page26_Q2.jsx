import React, { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex B 1.svg";

// بيانات التمرين
const scrambledWords = [
  {
    id: 1,
    scrambled: "yaM",
    correct: "May",
    letters: ["y", "a", "M"],
  },
  {
    id: 2,
    scrambled: "layp",
    correct: "play",
    letters: ["l", "a", "y", "p"],
  },
  {
    id: 3,
    scrambled: "tpani",
    correct: "paint",
    letters: ["t", "p", "a", "n", "i"],
  },
  {
    id: 4,
    scrambled: "nair",
    correct: "rain",
    letters: ["n", "a", "i", "r"],
  },
  {
    id: 5,
    scrambled: "keac",
    correct: "cake",
    letters: ["k", "e", "a", "c"],
  },
  {
    id: 6,
    scrambled: "kael",
    correct: "lake",
    letters: ["k", "a", "e", "l"],
  },
];
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
const WB_Unit4_Page26_Q2 = () => {
  const [userArrangements, setUserArrangements] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const rootRef = useRef(null),
    bankRefs = useRef({}),
    slotRefs = useRef({}),
    focusFrame = useRef(null);
  const locked = (id) => revealed || results[id] === "correct";
  const allCorrect = scrambledWords.every(
    (word) => results[word.id] === "correct",
  );
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      get()?.focus({
        preventScroll: true,
      });
    });
  };
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = allCorrect || revealed;
    button.style.cursor = button.disabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(button.disabled));
  }, [allCorrect, revealed]);
  const getArrangedWord = (wordId) => {
    const word = scrambledWords.find((w) => w.id === wordId);
    return (userArrangements[wordId] || [])
      .map((index) => word.letters[index] || "")
      .join("");
  };
  const isWordCorrect = (wordId) =>
    getArrangedWord(wordId) ===
    scrambledWords.find((w) => w.id === wordId).correct;
  const clearFeedback = (wordId) =>
    setResults((prev) => ({
      ...prev,
      [wordId]: null,
    }));
  const placeLetter = (wordId, letterIndex, position) => {
    const word = scrambledWords.find((w) => w.id === wordId);
    if (
      !word ||
      locked(wordId) ||
      !Number.isInteger(letterIndex) ||
      letterIndex < 0 ||
      letterIndex >= word.letters.length ||
      position < 0 ||
      position >= word.letters.length
    )
      return;
    cancelFocus();
    const next = Array.from(
      {
        length: word.letters.length,
      },
      (_, i) => userArrangements[wordId]?.[i],
    );
    next.forEach((value, i) => {
      if (value === letterIndex) next[i] = undefined;
    });
    next[position] = letterIndex;
    setUserArrangements((prev) => ({
      ...prev,
      [wordId]: next,
    }));
    clearFeedback(wordId);
    setPicked(null);
    setAnnouncement(
      word.letters[letterIndex] +
        " placed in word " +
        wordId +
        ", position " +
        (position + 1) +
        ".",
    );
    return next;
  };
  const handleLetterClick = (wordId, letter, letterIndex) => {
    if (
      locked(wordId) ||
      (userArrangements[wordId] || []).includes(letterIndex)
    )
      return;
    const word = scrambledWords.find((w) => w.id === wordId),
      position = word.letters.findIndex(
        (_, i) => userArrangements[wordId]?.[i] === undefined,
      );
    if (position !== -1) placeLetter(wordId, letterIndex, position);
  };
  const handleDeleteLetterAtPosition = (wordId, position) => {
    if (locked(wordId) || userArrangements[wordId]?.[position] === undefined)
      return;
    setUserArrangements((prev) => ({
      ...prev,
      [wordId]: (prev[wordId] || []).filter(
        (value, i) => i !== position && value !== undefined,
      ),
    }));
    clearFeedback(wordId);
    setAnnouncement("Letter returned to the bank for word " + wordId + ".");
  };
  const cancelSelection = () => {
    const source = picked;
    setPicked(null);
    setAnnouncement("Letter selection cancelled.");
    if (source)
      focus(() => bankRefs.current[source.wordId + "-" + source.letterIndex]);
  };
  const onBankKeyDown = (e, word, letterIndex) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (
      e.repeat ||
      locked(word.id) ||
      (results[word.id] !== "wrong" &&
        (userArrangements[word.id] || []).includes(letterIndex))
    )
      return;
    const position = word.letters.findIndex(
      (_, i) => userArrangements[word.id]?.[i] === undefined,
    );
    setPicked({
      wordId: word.id,
      letterIndex,
    });
    setAnnouncement(
      word.letters[letterIndex] +
        " selected. Choose a position in word " +
        word.id +
        ".",
    );
    focus(
      () => slotRefs.current[word.id + "-" + (position === -1 ? 0 : position)],
    );
  };
  const onSlotKeyDown = (e, word, position) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && results[word.id] === "wrong")
        handleDeleteLetterAtPosition(word.id, position);
      return;
    }
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat || locked(word.id)) return;
    if (picked) {
      if (picked.wordId !== word.id) return;
      const next = placeLetter(word.id, picked.letterIndex, position);
      if (next) {
        const available = word.letters.findIndex((_, i) => !next.includes(i));
        focus(
          () =>
            bankRefs.current[
              word.id +
                "-" +
                (available === -1 ? picked.letterIndex : available)
            ],
        );
      }
    } else handleDeleteLetterAtPosition(word.id, position);
  };
  const handleShowAnswer = () => {
    cancelFocus();
    setPicked(null);
    const correctArrangements = Object.fromEntries(
      scrambledWords.map((word) => {
        const used = new Set();
        return [
          word.id,
          Array.from(word.correct, (char) => {
            const index = word.letters.findIndex(
              (letter, i) => letter === char && !used.has(i),
            );
            used.add(index);
            return index;
          }),
        ];
      }),
    );
    setUserArrangements(correctArrangements);
    setResults(
      Object.fromEntries(scrambledWords.map((word) => [word.id, "correct"])),
    );
    setRevealed(true);
    setAnnouncement(
      "Correct words shown and locked. The story shows the same words.",
    );
  };
  const handleStartAgain = () => {
    cancelFocus();
    setPicked(null);
    setUserArrangements({});
    setResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All letters and story answers cleared.");
  };
  //.
  const checkAnswers = () => {
    if (allCorrect || revealed) return;
    cancelFocus();
    setPicked(null);
    if (
      scrambledWords.some((word) =>
        word.letters.some(
          (_, i) => userArrangements[word.id]?.[i] === undefined,
        ),
      )
    ) {
      setAnnouncement("Please complete all words first.");
      ValidationAlert.info("Please complete all words first.");
      return;
    }
    const next = Object.fromEntries(
      scrambledWords.map((word) => [
        word.id,
        results[word.id] === "correct" || isWordCorrect(word.id)
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (value) => value === "correct",
      ).length,
      total = scrambledWords.length,
      message = "Score: " + score + " / " + total;
    setAnnouncement(
      message + ". Correct words are locked. You can change incorrect words.",
    );
    if (score === total)
      rootRef.current
        ?.querySelector(".try-again-button:not(:disabled)")
        ?.focus({
          preventScroll: true,
        });
    ValidationAlert[score === total ? "success" : score ? "warning" : "error"](
      message,
    );
  };
  return (
    <div
      className="main-container-component"
      ref={rootRef}
      onKeyDown={(e) => {
        if (e.key === "Escape" && picked) {
          e.preventDefault();
          e.stopPropagation();
          cancelSelection();
        }
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div
        className="div-forall mbb-5"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title="Unscramble the words. Complete the story."
          subTitle={
            "Unscramble each long-a word first, then use the completed words to finish the story."
          }
        />
        <img
          src={placeholderImg}
          alt="A girl having a picnic on a blanket beside a pond."
          className="object-cover rounded-lg"
          style={{
            height: "90%",
            width: "93%",
          }}
        />

        {/* الصورة والفراغات */}
        <div className="space-y-4 mb-13">
          {/* عرض الحروف المبعثرة لكل كلمة */}
          <div className="space-y-3 p-4 rounded-lg grid grid-cols-3">
            {scrambledWords.map((word) => (
              <div key={word.id} className="space-y-2">
                {/* عرض الحروف المبعثرة */}
                <div className="flex gap-2 w-50">
                  {word.letters.map((letter, letterIndex) => {
                    const isSelected =
                      userArrangements[word.id]?.includes(letterIndex) &&
                      results[word.id] !== "wrong";
                    return (
                      <button
                        key={letterIndex}
                        onClick={() =>
                          handleLetterClick(word.id, letter, letterIndex)
                        }
                        type="button"
                        ref={(el) => {
                          bankRefs.current[word.id + "-" + letterIndex] = el;
                        }}
                        tabIndex={picked ? -1 : 0}
                        aria-disabled={isSelected || locked(word.id)}
                        aria-pressed={
                          picked?.wordId === word.id &&
                          picked.letterIndex === letterIndex
                        }
                        aria-label={
                          "Letter " +
                          letter +
                          " for word " +
                          word.id +
                          ". Press Enter or Space to choose it."
                        }
                        onKeyDown={(e) => onBankKeyDown(e, word, letterIndex)}
                        onKeyUp={release}
                        style={{
                          position: "relative",
                          ...(picked?.wordId === word.id &&
                          picked.letterIndex === letterIndex
                            ? {
                                outline: "3px solid #2563eb",
                                outlineOffset: 2,
                                backgroundColor: "#dbeafe",
                              }
                            : {}),
                        }}
                        className={`${focusClass} WB-word-bank
                        ${isSelected ? "bg-gray-300 text-gray-500 line-through cursor-not-allowed" : "bg-blue-100 text-blue-600 border-2 border-blue-400 hover:bg-blue-200"}`}
                        // style={{flexWrap:"nowrap"}}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                {/* إنبوتات لترتيب الحروف */}
                <div className="flex items-center gap-3 w-full">
                  <div
                    style={{
                      borderBottomColor:
                        results[word.id] === "correct"
                          ? "#16a34a"
                          : results[word.id] === "wrong"
                            ? "#ef4444"
                            : undefined,
                    }}
                    className="flex gap-1 bg-white border-2 border-gray-300 rounded-lg p-2"
                  >
                    {Array.from({
                      length: word.correct.length,
                    }).map((_, idx) => {
                      const letterIndex = userArrangements[word.id]?.[idx];
                      const letter =
                        letterIndex !== undefined
                          ? word.letters[letterIndex]
                          : "";
                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            handleDeleteLetterAtPosition(word.id, idx)
                          }
                          type="button"
                          ref={(el) => {
                            slotRefs.current[word.id + "-" + idx] = el;
                          }}
                          tabIndex={
                            picked &&
                            (picked.wordId !== word.id || locked(word.id))
                              ? -1
                              : 0
                          }
                          aria-disabled={locked(word.id)}
                          aria-label={
                            "Word " +
                            word.id +
                            ", position " +
                            (idx + 1) +
                            ": " +
                            (letter || "Empty") +
                            (locked(word.id) ? ". Correct and locked." : "")
                          }
                          onKeyDown={(e) => onSlotKeyDown(e, word, idx)}
                          onKeyUp={release}
                          style={{
                            borderBottomColor:
                              results[word.id] === "correct"
                                ? "#16a34a"
                                : results[word.id] === "wrong"
                                  ? "#ef4444"
                                  : undefined,
                          }}
                          className={`${focusClass} w-8 h-8 border-2 border-gray-400 rounded-lg flex items-center justify-center font-bold text-lg bg-gray-50 transition-all ${letter ? "cursor-pointer hover:bg-red-100 hover:border-red-500 hover:text-red-600" : "cursor-default"}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-2xl leading-relaxed">
            <Blank
              id={1}
              value={getArrangedWord(1)}
              isCorrect={isWordCorrect(1)}
              showResults={Boolean(results[1])}
            />{" "}
            likes to
            <Blank
              id={2}
              value={getArrangedWord(2)}
              isCorrect={isWordCorrect(2)}
              showResults={Boolean(results[2])}
            />{" "}
            and
            <Blank
              id={3}
              value={getArrangedWord(3)}
              isCorrect={isWordCorrect(3)}
              showResults={Boolean(results[3])}
            />{" "}
            in the
            <Blank
              id={4}
              value={getArrangedWord(4)}
              isCorrect={isWordCorrect(4)}
              showResults={Boolean(results[4])}
            />
            . She also likes to eat
            <Blank
              id={5}
              value={getArrangedWord(5)}
              isCorrect={isWordCorrect(5)}
              showResults={Boolean(results[5])}
            />{" "}
            near the
            <Blank
              id={6}
              value={getArrangedWord(6)}
              isCorrect={isWordCorrect(6)}
              showResults={Boolean(results[6])}
            />
            .
          </p>
        </div>

        {/* أزرار التحكم */}
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

// مكون مساعد للفراغ
// eslint-disable-next-line react-refresh/only-export-components -- Keep the read-only story display local.
const Blank = ({ id, value, isCorrect, showResults }) => {
  let borderClass = "border-gray-400";
  if (showResults) {
    borderClass = isCorrect ? "border-green-600" : "border-red-500";
  }
  return (
    <span
      aria-label={"Story word " + id + ": " + (value || "Empty")}
      className={`relative inline-block w-28 text-center mx-2 border-b-2 text-2xl transition-all ${borderClass}`}
    >
      {value || <span className="text-transparent">.</span>}
      {/* ❌ Wrong Icon */}
      {showResults && value && !isCorrect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </span>
  );
};
export default WB_Unit4_Page26_Q2;

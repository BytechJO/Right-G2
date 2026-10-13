import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/P 73_1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Ex F 4.svg";
import tubeSound from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_005_tube.mp3";
import tuneSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_005_tune.mp3";
import sueSound from "../../../assets/audio/ClassBook/U 8/Page 73 - G/Item_002_Sue.mp3";
import juneSound from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_002_June.mp3";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

const images = [
  { id: 0, img: img1, alt: "A girl wearing a yellow apron over a pink dress." },
  { id: 1, img: img2, alt: "A calendar headed JUNE." },
  { id: 2, img: img3, alt: "A white squeeze container with a grey cap." },
  { id: 3, img: img4, alt: "Red musical notes and a treble clef." },
];
const sentences = [
  {
    id: 0,
    word: ["t", "", "b", ""],
    letters: ["a", "u", "e"],
    answer: ["t", "u", "b", "e"],
    audio: tubeSound,
  },
  {
    id: 1,
    word: ["t", "", "n", ""],
    letters: ["a", "u", "e"],
    answer: ["t", "u", "n", "e"],
    audio: tuneSound,
  },
  {
    id: 2,
    word: ["s", "", ""],
    letters: ["u", "n", "e"],
    answer: ["s", "u", "e"],
    audio: sueSound,
  },
  {
    id: 3,
    word: ["j", "", "n", ""],
    letters: ["i", "e", "u"],
    answer: ["j", "u", "n", "e"],
    audio: juneSound,
  },
];
const correct = { 0: 2, 1: 3, 2: 0, 3: 1 };
const blanks = sentences.flatMap((s) =>
  s.word.flatMap((char, index) =>
    char === "" ? [{ id: `blank-${s.id}-${index}`, sentId: s.id, index }] : [],
  ),
);
const sensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};
const arrows = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const Review8_Page2_Q2 = () => {
  const [matches, setMatches] = useState({});
  const [filledLetters, setFilledLetters] = useState({});
  const [matchResults, setMatchResults] = useState({});
  const [letterResults, setLetterResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [source, setSource] = useState(null);
  const [hover, setHover] = useState(null);
  const [pickedLetter, setPickedLetter] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [, setGeometryVersion] = useState(0);
  const imageRefs = useRef([]),
    sentenceRefs = useRef([]);
  const imageDots = useRef([]),
    sentenceDots = useRef([]);
  const bankRefs = useRef({}),
    blankRefs = useRef({});
  const containerRef = useRef(null),
    audioRef = useRef(null),
    focusFrame = useRef(null);
  const suppressFocusAudio = useRef(false);
  const imageLocked = (id) => revealed || matchResults[id] === "correct";
  const wordLocked = (id) =>
    revealed ||
    Object.entries(matches).some(
      ([img, word]) => word === id && matchResults[img] === "correct",
    );
  const blankLocked = (id) => revealed || letterResults[id] === "correct";
  const allDone =
    images.every((img) => matchResults[img.id] === "correct") &&
    blanks.every((blank) => letterResults[blank.id] === "correct");
  const wordFor = (id) =>
    sentences[id].word
      .map((char, index) => char || filledLetters[id]?.[index] || "_")
      .join("");
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusSafely = (getElement) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocusAudio.current = true;
      try {
        getElement()?.focus();
      } finally {
        suppressFocusAudio.current = false;
      }
    });
  };
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSound = (sentId, key) => {
    stopAudio();
    const audio = new Audio(sentences[sentId].audio);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  useEffect(() => {
    const update = () => setGeometryVersion((value) => value + 1);
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (containerRef.current) observer?.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    setGeometryVersion((value) => value + 1);
  }, [matches, filledLetters]);

  const clearPending = () => {
    cancelFocus();
    setSource(null);
    setHover(null);
    setPickedLetter(null);
  };
  const endpointLocked = (type, id) =>
    type === "image" ? imageLocked(id) : wordLocked(id);
  const selectEndpoint = (type, id, keyboard = false) => {
    if (type === "word") playSound(id, `word-${id}`);
    if (endpointLocked(type, id)) {
      setAnnouncement("This match is correct and locked.");
      return;
    }
    cancelFocus();
    setPickedLetter(null);
    if (!source || source.type === type) {
      const cancelled = source?.type === type && source.id === id;
      setSource(cancelled ? null : { type, id });
      setHover(null);
      setAnnouncement(
        cancelled
          ? "Selection cancelled."
          : `${type === "image" ? "Picture" : "Word"} ${id + 1} selected. Choose the other endpoint.`,
      );
      if (keyboard && !cancelled) {
        const otherType = type === "image" ? "word" : "image";
        const candidate =
          images.find(
            (item) =>
              !endpointLocked(otherType, item.id) &&
              (otherType === "image"
                ? matches[item.id] === undefined
                : !Object.values(matches).includes(item.id)),
          ) || images.find((item) => !endpointLocked(otherType, item.id));
        if (candidate)
          focusSafely(
            () =>
              (otherType === "image" ? imageRefs : sentenceRefs).current[
                candidate.id
              ],
          );
      }
      return;
    }
    if (endpointLocked(source.type, source.id)) return;
    const img = type === "image" ? id : source.id,
      word = type === "word" ? id : source.id;
    const updated = { ...matches },
      affected = [img];
    for (const [key, value] of Object.entries(updated)) {
      if (value === word && Number(key) !== img) {
        if (imageLocked(Number(key))) return;
        delete updated[key];
        affected.push(Number(key));
      }
    }
    updated[img] = word;
    setMatches(updated);
    setMatchResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => !affected.includes(Number(key))),
      ),
    );
    clearPending();
    setAnnouncement(`Picture ${img + 1} connected to word ${word + 1}.`);
    if (keyboard) {
      const next =
        sentences.find(
          (s) =>
            !Object.entries(updated).some(
              ([key, value]) =>
                value === s.id && matchResults[key] === "correct",
            ) && !Object.values(updated).includes(s.id),
        ) || sentences.find((s) => !wordLocked(s.id));
      if (next) focusSafely(() => sentenceRefs.current[next.id]);
    }
  };
  const cancelSelection = (e) => {
    if (e.key !== "Escape" || (!source && !pickedLetter)) return;
    e.preventDefault();
    e.stopPropagation();
    const selected = source,
      letter = pickedLetter;
    clearPending();
    setAnnouncement("Selection cancelled.");
    focusSafely(() =>
      letter
        ? bankRefs.current[letter]
        : (selected.type === "image" ? imageRefs : sentenceRefs).current[
            selected.id
          ],
    );
  };
  const endpointProps = (type, id) => ({
    role: "button",
    tabIndex: source?.type === "image" && type === "image" ? -1 : 0,
    "aria-pressed": source?.type === type && source.id === id,
    "aria-disabled": endpointLocked(type, id),
    "data-endpoint": `${type}-${id}`,
    "aria-label":
      type === "image"
        ? `Picture ${id + 1}: ${images[id].alt}${imageLocked(id) ? ", correct match locked" : ""}`
        : `Word ${id + 1}: ${wordFor(id)}. Activate to hear and connect.${wordLocked(id) ? " Correct match locked." : ""}`,
    onClick: (e) => {
      e.stopPropagation();
      selectEndpoint(type, id);
    },
    onMouseEnter: () => {
      if (!endpointLocked(type, id)) setHover({ type, id });
    },
    onMouseLeave: () => setHover(null),
    onFocus: () => {
      if (!endpointLocked(type, id)) setHover({ type, id });
    },
    onBlur: () => setHover(null),
    onKeyDown: (e) => {
      cancelSelection(e);
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) selectEndpoint(type, id, true);
      } else if (arrows[e.key]) {
        e.preventDefault();
        e.stopPropagation();
        focusSafely(
          () =>
            (type === "image" ? imageRefs : sentenceRefs).current[
              (id + arrows[e.key] + images.length) % images.length
            ],
        );
      }
    },
    onKeyUp: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });

  const changeBlank = (blank, letter) => {
    if (blankLocked(blank.id)) return;
    setFilledLetters((prev) => ({
      ...prev,
      [blank.sentId]: sentences[blank.sentId].word.map((char, index) =>
        index === blank.index
          ? letter
          : char || prev[blank.sentId]?.[index] || "",
      ),
    }));
    setLetterResults((prev) => ({ ...prev, [blank.id]: null }));
  };
  const placeLetter = (tile, blankId, keyboard = false) => {
    const [sentId, letter, index] = tile.split("-");
    const blank = blanks.find((b) => b.id === blankId);
    // The original banks are reusable letter sources, including across words.
    if (
      !blank ||
      sentences[Number(sentId)]?.letters[Number(index)] !== letter ||
      blankLocked(blank.id)
    )
      return;
    changeBlank(blank, letter);
    clearPending();
    setAnnouncement(
      `${letter} placed in word ${blank.sentId + 1}, blank ${blank.index + 1}.`,
    );
    if (keyboard) focusSafely(() => bankRefs.current[tile]);
  };
  const chooseLetter = (tile, sentId) => {
    if (revealed || allDone) return;
    const target =
      blanks.find(
        (b) =>
          b.sentId === sentId &&
          !blankLocked(b.id) &&
          !filledLetters[b.sentId]?.[b.index],
      ) ||
      blanks.find((b) => b.sentId === sentId && !blankLocked(b.id)) ||
      blanks.find((b) => !blankLocked(b.id));
    if (!target) return;
    clearPending();
    setPickedLetter(tile);
    setAnnouncement(
      `${tile.split("-")[1]} selected. Choose a blank with Enter or Space.`,
    );
    focusSafely(() => blankRefs.current[target.id]);
  };
  const removeLetter = (blank, keyboard = false) => {
    if (blankLocked(blank.id) || !filledLetters[blank.sentId]?.[blank.index])
      return;
    const letter = filledLetters[blank.sentId][blank.index];
    changeBlank(blank, "");
    clearPending();
    setAnnouncement(`${letter} returned to the letter bank.`);
    if (keyboard) {
      const sent = sentences.find((s) => s.letters.includes(letter));
      focusSafely(
        () =>
          bankRefs.current[
            `${sent.id}-${letter}-${sent.letters.indexOf(letter)}`
          ],
      );
    }
  };
  const checkAnswers = () => {
    if (revealed || allDone) return;
    clearPending();
    stopAudio();
    if (Object.keys(matches).length !== images.length) {
      ValidationAlert.info("Please match all.");
      setAnnouncement("Please match all.");
      return;
    }
    const nextMatches = Object.fromEntries(
      images.map((img) => [
        img.id,
        matchResults[img.id] === "correct" ||
        correct[img.id] === matches[img.id]
          ? "correct"
          : "wrong",
      ]),
    );
    const nextLetters = Object.fromEntries(
      blanks.map((b) => [
        b.id,
        letterResults[b.id] === "correct" ||
        filledLetters[b.sentId]?.[b.index] ===
          sentences[b.sentId].answer[b.index]
          ? "correct"
          : "wrong",
      ]),
    );
    setMatchResults(nextMatches);
    setLetterResults(nextLetters);
    const score = images.filter(
      (img) =>
        nextMatches[img.id] === "correct" &&
        blanks
          .filter((b) => b.sentId === matches[img.id])
          .every((b) => nextLetters[b.id] === "correct"),
    ).length;
    const color =
      score === images.length ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;margin-top:8px;"><span style="color:${color};font-weight:bold;">Score: ${score} /${images.length} </span></div>`;
    if (score === images.length) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      `Score ${score} out of ${images.length}. Correct matches and letters are locked. Incorrect matches and letters can be changed.`,
    );
  };
  const showAnswers = () => {
    clearPending();
    stopAudio();
    setMatches({ ...correct });
    setFilledLetters(
      Object.fromEntries(sentences.map((s) => [s.id, [...s.answer]])),
    );
    setMatchResults(
      Object.fromEntries(images.map((img) => [img.id, "correct"])),
    );
    setLetterResults(Object.fromEntries(blanks.map((b) => [b.id, "correct"])));
    setRevealed(true);
    setAnnouncement("All correct matches and letters shown and locked.");
  };
  const reset = () => {
    clearPending();
    stopAudio();
    setMatches({});
    setFilledLetters({});
    setMatchResults({});
    setLetterResults({});
    setRevealed(false);
    setAnnouncement(
      "Activity reset. All matches, letters, and results cleared.",
    );
  };
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
          pointerEvents: "none",
          zIndex: 3,
          background: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const pathFor = (imgId, sentId) => {
    if (
      !containerRef.current ||
      !imageDots.current[imgId] ||
      !sentenceDots.current[sentId]
    )
      return null;
    const img = imageDots.current[imgId].getBoundingClientRect(),
      sent = sentenceDots.current[sentId].getBoundingClientRect(),
      root = containerRef.current.getBoundingClientRect();
    return `M ${img.left + img.width / 2 - root.left} ${img.top + img.height / 2 - root.top} L ${sent.left + sent.width / 2 - root.left} ${sent.top + sent.height / 2 - root.top}`;
  };
  const preview =
    source &&
    hover &&
    source.type !== hover.type &&
    !endpointLocked(source.type, source.id) &&
    !endpointLocked(hover.type, hover.id)
      ? {
          img: source.type === "image" ? source.id : hover.id,
          word: source.type === "word" ? source.id : hover.id,
        }
      : null;

  return (
    <DragDropContext
      onDragEnd={({ destination, draggableId }) => {
        if (destination) placeLetter(draggableId, destination.droppableId);
      }}
      onBeforeDragStart={clearPending}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div ref={containerRef} className="main-container-component relative">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <p id="r8p2q2-help" className="sr-only">
          Connect a picture and a word using Enter or Space on either endpoint.
          Arrows move between endpoints. Select a letter with Enter or Space,
          then place it in a blank. Activate a filled editable blank to return
          its letter. Delete or Backspace removes only incorrect letters. Escape
          cancels selection. Correct matches and letters are locked
          independently.
        </p>
        <div className="div-forall gap-10">
          <ExerciseHeader
            sectionLetter="F"
            title="Match and write."
            subTitle={
              "Start with one picture or phrase, then match it to the partner that means the same thing."
            }
            isReview={true}
          />
          <div className="flex flex-col items-center gap-25">
            <div className="grid grid-cols-4 w-full text-center">
              {images.map((img) => (
                <div
                  key={img.id}
                  {...endpointProps("image", img.id)}
                  ref={(el) => {
                    imageRefs.current[img.id] = el;
                  }}
                  className={`flex flex-col items-center gap-3 cursor-pointer${focusClass}`}
                  style={
                    source?.type === "image" && source.id === img.id
                      ? activeStyle
                      : undefined
                  }
                >
                  <div className="relative">
                    <div className="rounded-lg flex items-center justify-center">
                      <img
                        src={img.img}
                        alt={img.alt}
                        onLoad={() => setGeometryVersion((value) => value + 1)}
                        style={{
                          height: "130px",
                          width: "auto",
                          cursor: "pointer",
                          borderRadius: "10px",
                          transition: "0.2s",
                          boxShadow: imageLocked(img.id)
                            ? "0 0 0 2px #16a34a"
                            : undefined,
                        }}
                      />
                    </div>
                    {matchResults[img.id] === "wrong" && (
                      <div
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white"
                      >
                        ✕
                      </div>
                    )}
                  </div>
                  <div
                    aria-hidden="true"
                    ref={(el) => {
                      imageDots.current[img.id] = el;
                    }}
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: imageLocked(img.id)
                        ? "#16a34a"
                        : "#ef4444",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 w-full text-center">
              {sentences.map((sent) => (
                <div
                  key={sent.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => selectEndpoint("word", sent.id)}
                  onMouseEnter={() => {
                    if (!wordLocked(sent.id))
                      setHover({ type: "word", id: sent.id });
                  }}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="relative">
                    <span
                      {...endpointProps("word", sent.id)}
                      ref={(el) => {
                        sentenceRefs.current[sent.id] = el;
                        sentenceDots.current[sent.id] = el;
                      }}
                      className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-20${focusClass}`}
                      style={{
                        backgroundColor: wordLocked(sent.id)
                          ? "#16a34a"
                          : "#ef4444",
                        ...(source?.type === "word" && source.id === sent.id
                          ? activeStyle
                          : {}),
                      }}
                    />
                    <div
                      className="bg-[#e9d7c9] px-4 py-2 rounded-xl text-lg relative"
                      style={
                        playingKey === `word-${sent.id}` ||
                        (source?.type === "word" && source.id === sent.id) ||
                        (source?.type === "image" &&
                          hover?.type === "word" &&
                          hover.id === sent.id)
                          ? activeStyle
                          : wordLocked(sent.id)
                            ? { boxShadow: "0 0 0 2px #16a34a" }
                            : undefined
                      }
                    >
                      {badge(`word-${sent.id}`)}
                      {blanks.some(
                        (b) =>
                          b.sentId === sent.id &&
                          letterResults[b.id] === "wrong",
                      ) && (
                        <div
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow border-2 border-white z-20"
                        >
                          ✕
                        </div>
                      )}
                      <div className="flex gap-1 justify-center">
                        {sent.word.map((char, index) => {
                          if (char)
                            return (
                              <span
                                key={index}
                                className="w-6 h-8 text-center font-bold"
                              >
                                {char}
                              </span>
                            );
                          const blank = blanks.find(
                              (b) => b.sentId === sent.id && b.index === index,
                            ),
                            letter = filledLetters[sent.id]?.[index];
                          return (
                            <Droppable
                              key={index}
                              droppableId={blank.id}
                              isDropDisabled={blankLocked(blank.id)}
                            >
                              {(provided, snapshot) => (
                                <span
                                  ref={(el) => {
                                    provided.innerRef(el);
                                    blankRefs.current[blank.id] = el;
                                  }}
                                  {...provided.droppableProps}
                                  role="button"
                                  tabIndex={source ? -1 : 0}
                                  aria-disabled={blankLocked(blank.id)}
                                  aria-describedby="r8p2q2-help"
                                  data-blank={blank.id}
                                  aria-label={`Word ${sent.id + 1}, letter ${index + 1}: ${letter || "empty"}${blankLocked(blank.id) ? ", correct and locked" : letterResults[blank.id] === "wrong" ? ", incorrect" : ""}`}
                                  className={`w-6 h-8 border-b-2 text-center${focusClass}`}
                                  style={{
                                    borderColor: blankLocked(blank.id)
                                      ? "#16a34a"
                                      : letterResults[blank.id] === "wrong"
                                        ? "#ef4444"
                                        : undefined,
                                    ...(snapshot.isDraggingOver &&
                                    !blankLocked(blank.id)
                                      ? {
                                          outline: "2px dashed #2563eb",
                                          outlineOffset: 2,
                                          backgroundColor: "#dbeafe",
                                        }
                                      : {}),
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeLetter(blank);
                                  }}
                                  onKeyDown={(e) => {
                                    cancelSelection(e);
                                    if (activateKey(e)) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!e.repeat) {
                                        if (pickedLetter)
                                          placeLetter(
                                            pickedLetter,
                                            blank.id,
                                            true,
                                          );
                                        else removeLetter(blank, true);
                                      }
                                    }
                                    if (
                                      e.key === "Delete" ||
                                      e.key === "Backspace"
                                    ) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (
                                        !e.repeat &&
                                        letterResults[blank.id] === "wrong"
                                      )
                                        removeLetter(blank, true);
                                    }
                                  }}
                                  onKeyUp={(e) => {
                                    if (activateKey(e)) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                >
                                  {letter || "_"}
                                  {provided.placeholder}
                                </span>
                              )}
                            </Droppable>
                          );
                        })}
                      </div>
                      <Droppable
                        droppableId={`letters-${sent.id}`}
                        direction="horizontal"
                        isDropDisabled
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex gap-2 mt-2 justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {sent.letters.map((letter, index) => {
                              const tile = `${sent.id}-${letter}-${index}`;
                              return (
                                <Draggable
                                  key={tile}
                                  draggableId={tile}
                                  index={index}
                                  isDragDisabled={revealed || allDone}
                                >
                                  {(provided) => (
                                    <span
                                      ref={(el) => {
                                        provided.innerRef(el);
                                        bankRefs.current[tile] = el;
                                      }}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      role="button"
                                      tabIndex={source ? -1 : 0}
                                      aria-pressed={pickedLetter === tile}
                                      aria-disabled={revealed || allDone}
                                      data-tile={tile}
                                      aria-label={`Letter ${letter} from word bank ${sent.id + 1}`}
                                      aria-describedby="r8p2q2-help"
                                      className={`px-2 py-1 border rounded cursor-grab bg-yellow-200${focusClass}`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        ...(pickedLetter === tile
                                          ? activeStyle
                                          : {}),
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        cancelSelection(e);
                                        if (activateKey(e)) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (!e.repeat)
                                            chooseLetter(tile, sent.id);
                                        }
                                      }}
                                      onKeyUp={(e) => {
                                        if (activateKey(e)) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }
                                      }}
                                    >
                                      {letter}
                                    </span>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {Object.entries(matches).map(([img, word]) => (
            <path
              key={img}
              d={pathFor(img, word) || undefined}
              stroke={matchResults[img] === "correct" ? "#16a34a" : "#e53935"}
              strokeWidth="3"
              fill="none"
            />
          ))}
          {preview && (
            <path
              d={pathFor(preview.img, preview.word) || undefined}
              stroke="#2563eb"
              strokeWidth="3"
              strokeDasharray="6 4"
              fill="none"
            />
          )}
        </svg>
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
    </DragDropContext>
  );
};
export default Review8_Page2_Q2;

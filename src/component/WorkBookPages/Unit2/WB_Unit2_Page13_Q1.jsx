import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import thatAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_002_That.mp3";
import sunAudio from "../../../assets/audio/WorkBook/Unit 2/Page 9 - A/Item_002_sun.mp3";
import cloudsAudio from "../../../assets/audio/WorkBook/Unit 2/Page 11 - F/Item_003_clouds.mp3";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_001_are.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_002_horses.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_003_Those.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_004_black.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_005_small.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_006_This.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_007_rabbit.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_008_is.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_009_a.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_010_ducks.mp3";
import sound10 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - I/Item_011_These.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 4.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 5.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex I 6.svg";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}



const IMAGE_DESCRIPTIONS = {
  [img1]: "Black horses running with a child nearby.",
  [img2]: "A child kneeling beside a brown rabbit.",
  [img3]: "A child beside a pond with ducks.",
  [img4]: "A child pointing toward the sun.",
  [img5]: "White clouds in a blue sky."
};
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
function useExerciseAudio() {
  const rootRef = useRef(null),
    ownerRef = useRef(Symbol("workbook-exercise")),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const stopAudio = () => {
    tokenRef.current++;
    stopGlobalAudio(ownerRef.current);
    setPlayingKey(null);
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    rootRef.current?.querySelectorAll("audio").forEach(audio => audio.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    try {
      playGlobalAudio(src, {
        owner: ownerRef.current,
        onFinish: () => {
          if (tokenRef.current === token) setPlayingKey(null);
        }
      });
    } catch {
      stopAudio();
    }
  };
  useEffect(() => {
    const tokenState = tokenRef,
      owner = ownerRef.current;
    const onPlay = e => {
      if (e.target?.tagName !== "AUDIO") return;
      tokenRef.current++;
      stopGlobalAudio(ownerRef.current);
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokenState.current++;
      stopGlobalAudio(owner);
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio
  };
}



const SOUNDS = {
  "are": sound0,
  "horses": sound1,
  "those": sound2,
  "black": sound3,
  "small": sound4,
  "this": sound5,
  "rabbit": sound6,
  "is": sound7,
  "a": sound8,
  "ducks": sound9,
  "these": sound10,
  "that": thatAudio,
  "sun": sunAudio,
  "clouds": cloudsAudio
};
function useTokenOrder(questions, sounds) {
  const initial = Object.fromEntries(questions.map(q => [q.id, []]));
  const [inputs, setInputs] = useState(initial),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio(),
    bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    suppress = useRef(false);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = get => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      suppress.current = true;
      try {
        get()?.focus();
      } finally {
        suppress.current = false;
      }
    });
  };
  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);
  const locked = id => revealed || results[id] === "correct",
    tokens = q => q.scrambled.map((t, i) => typeof t === "string" ? {
      id: q.id + "-" + t + "-" + i,
      value: t
    } : t);
  const place = (id, tokenId, index) => {
    const q = questions.find(q => String(q.id) === String(id)),
      item = q && tokens(q).find(t => t.id === tokenId);
    if (!item || locked(id) || inputs[id].some(t => t.id === tokenId) || inputs[id].length >= tokens(q).length) return;
    const next = [...inputs[id]];
    next.splice(index ?? next.length, 0, item);
    setInputs(prev => ({
      ...prev,
      [id]: next
    }));
    setResults(prev => ({
      ...prev,
      [id]: null
    }));
    setPicked(null);
    setMessage(item.value + " placed.");
    return next;
  };
  const remove = (id, tokenId) => {
    if (locked(id)) return;
    setInputs(prev => ({
      ...prev,
      [id]: prev[id].filter(t => t.id !== tokenId)
    }));
    setResults(prev => ({
      ...prev,
      [id]: null
    }));
    setMessage("Item returned to the bank.");
  };
  const cancel = () => {
    if (picked) focus(() => bankRefs.current[picked.token]);
    setPicked(null);
    setMessage("Selection cancelled.");
  };
  const bankProps = (q, item, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || picked ? -1 : 0,
    "aria-pressed": picked?.token === item.id,
    "aria-disabled": locked(q.id) || inputs[q.id].some(t => t.id === item.id),
    "aria-label": item.value + ". Choose for question " + q.id,
    onClick: () => audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]),
    onFocus: e => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible")) audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]);
    },
    onKeyDown: e => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || locked(q.id) || inputs[q.id].some(t => t.id === item.id)) return;
      audio.playSound("bank-" + item.id, sounds[item.value.toLowerCase()]);
      setPicked({
        qid: q.id,
        token: item.id
      });
      setMessage(item.value + " chosen. Press Enter or Space in the answer field.");
      focus(() => slotRefs.current[q.id]);
    },
    onKeyUp: release
  });
  const slotProps = (q, snapshot, pendingMatch = false) => ({
    role: "button",
    tabIndex: pendingMatch || picked && picked.qid !== q.id ? -1 : 0,
    "aria-label": "Question " + q.id + " answer: " + (inputs[q.id].map(t => t.value).join(q.separator) || "Empty") + (locked(q.id) ? ". Correct and locked" : ""),
    "aria-disabled": locked(q.id),
    onClick: e => {
      if (e.target === e.currentTarget && !locked(q.id) && inputs[q.id].length) remove(q.id, inputs[q.id].at(-1).id);
    },
    onKeyDown: e => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && results[q.id] === "wrong" && inputs[q.id].length) remove(q.id, inputs[q.id].at(-1).id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || locked(q.id)) return;
      if (picked) {
        if (picked.qid !== q.id) return;
        const next = place(q.id, picked.token);
        if (next) {
          const token = tokens(q).find(t => !next.some(v => v.id === t.id));
          focus(() => bankRefs.current[token?.id || picked.token]);
        }
      } else if (inputs[q.id].length) remove(q.id, inputs[q.id].at(-1).id);
    },
    onKeyUp: release,
    style: {
      borderRadius: 0,
      position: "relative",
      ...(locked(q.id) ? {
        borderColor: "#16a34a",
        borderBottomColor: "#16a34a",
        boxShadow: "inset 0 0px #16a34a"
      } : results[q.id] === "wrong" ? {
        borderBottomColor: "#ef4444"
      } : {}),
      ...(snapshot?.isDraggingOver && !locked(q.id) ? {
        outline: "3px dashed #2563eb",
        outlineOffset: 2,
        backgroundColor: "#dbeafe"
      } : {})
    }
  });
  const evaluate = () => {
    cancelFocus();
    setPicked(null);
    audio.stopAudio();
    const next = Object.fromEntries(questions.map(q => [q.id, results[q.id] === "correct" || inputs[q.id].map(t => t.value).join(q.separator) === q.correctSentence ? "correct" : "wrong"]));
    setResults(next);
    return next;
  };
  const show = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    const solved = Object.fromEntries(questions.map(q => {
      const remaining = tokens(q);
      return [q.id, q.correctSentence.split(q.separator).map(value => {
        const index = remaining.findIndex(t => t.value === value);
        return remaining.splice(index, 1)[0];
      })];
    }));
    setInputs(solved);
    setResults(Object.fromEntries(questions.map(q => [q.id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    cancelFocus();
    audio.stopAudio();
    setPicked(null);
    setInputs(initial);
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  const reorder = (id, from, to) => {
    if (locked(id)) return;
    const next = [...inputs[id]],
      item = next.splice(from, 1)[0];
    if (!item) return;
    next.splice(to, 0, item);
    setInputs(p => ({
      ...p,
      [id]: next
    }));
    setResults(p => ({
      ...p,
      [id]: null
    }));
  };
  return {
    reorder,
    ...audio,
    bankRefs,
    slotRefs,
    inputs,
    results,
    revealed,
    picked,
    message,
    setMessage,
    tokens,
    locked,
    place,
    remove,
    bankProps,
    slotProps,
    evaluate,
    show,
    reset,
    dragStart,
    cancelFocus
  };
}

const WB_Unit2_Page13_Q1 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.disabled = true;
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.disabled = false;
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const exerciseSentences = [{
  id: "s1",
  scrambled: "are horses Those black",
  correct: "Those are black horses.",
  img: img1
}, {
  id: "s2",
  scrambled: "small This rabbit is a",
  correct: "This is a small rabbit.",
  img: img2
}, {
  id: "s3",
  scrambled: "ducks These are",
  correct: "These are ducks.",
  img: img3
}, {
  id: "s4",
  scrambled: "sun That the is",
  correct: "That is the sun.",
  img: img4
}, {
  id: "s5",
  scrambled: "white Those clouds are",
  correct: "Those are white clouds.",
  img: img5
}];

 const orderedQuestions = exerciseSentences.map(q => ({
  id: q.id,
  scrambled: q.scrambled.split(' '),
  correctSentence: q.correct.replace(/[.,!?]/g, ''),
  separator: ' '
}));
 const order = useTokenOrder(orderedQuestions, SOUNDS);const {
  rootRef,
  message,
  playingKey
} = order;
 const checkDisabled = order.revealed || orderedQuestions.every(
   question => order.results[question.id] === "correct",
 );
 useEffect(() => {
   const button = rootRef.current?.querySelector(".check-button2");
   if (!button) return;
   button.disabled = checkDisabled;
   button.style.cursor = checkDisabled ? "not-allowed" : "";
   button.setAttribute("aria-disabled", String(checkDisabled));
 }, [checkDisabled, rootRef]);
 const handleShowAnswer = order.show,
  handleStartAgain = order.reset;
 const checkAnswers = (checkEvent) => {
    if (checkDisabled) return;
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

  if (order.revealed) return;
  order.dragStart();
  order.stopAudio();
  if (Object.values(order.inputs).some(v => !v.length)) {
    ValidationAlert.info('Please answer all questions first!');
    order.setMessage('Please answer all questions first!');
    return;
  }
  const results = order.evaluate(),
    score = Object.values(results).filter(r => r === 'correct').length;
  const msg = 'Score: ' + score + '/5';
  order.setMessage(msg);
  (((score === 5 ? 'success' : score ? 'warning' : 'error') === "success") && completeCheck(checkEvent), showCheckFeedback(rootRef.current, score === 5 ? 'success' : score ? 'warning' : 'error', msg));
};

  return (
    <div className="main-container-component" ref={rootRef}><div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</div>
      <div className="div-forall"  style={{gap:"25px"}}>
        <ExerciseHeader isWorkbook sectionLetter="I" title={<>
          Look, unscramble, and write.
        </>} />

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div key={sentence.id} className="flex items-start gap-4 p-4">
              <span className="font-bold text-blue-900 text-xl">
                {index + 1}.
              </span>

          <div className="space-y-1 w-full">
 <div className="flex gap-2 rounded-lg min-h-[50px] items-center">
 <img src={sentence.img} className="object-contain" style={{height:'120px'}} alt={IMAGE_DESCRIPTIONS[sentence.img] || ""} />
 <div className="flex flex-col gap-5 w-full">
 <div className="flex gap-5 w-full">{order.tokens(orderedQuestions[index]).map(word=>{const used=order.inputs[sentence.id].some(t=>t.id===word.id);return <button key={word.id} {...order.bankProps(orderedQuestions[index],word)} ref={el=>{order.bankRefs.current[word.id]=el;}} disabled={used} onClick={()=>{order.playSound('bank-'+word.id,SOUNDS[word.value.toLowerCase()]);order.place(sentence.id,word.id);}} className={`WB-word-bank ${focusClass} ${used?'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50':'bg-white text-gray-800 border-gray-400 hover:bg-blue-100 hover:border-blue-500'}`} style={{position:'relative',borderRadius:8,...(order.picked?.token===word.id?{outline:'4px solid #2563eb',backgroundColor:'#dbeafe'}:{})}}>{word.value}{playingKey==='bank-'+word.id&&<SpeakerBadge/>}</button>;})}</div>
 <div className="relative"><div {...order.slotProps(orderedQuestions[index])} ref={el=>{order.slotRefs.current[sentence.id]=el;}} className={`flex flex-wrap gap-2 p-3 border-2 rounded-lg min-h-[60px] items-center ${focusClass} ${order.results[sentence.id]==='wrong'?'border-red-500':'border-gray-400'}`}>{order.inputs[sentence.id].map(word=><button key={word.id} tabIndex={-1} aria-disabled={order.locked(sentence.id)} onClick={e=>{e.stopPropagation();order.remove(sentence.id,word.id);}} className="px-1 py-1 cursor-pointer hover:text-red-500" title="Click to remove">{word.value}</button>)}</div>
 {order.results[sentence.id]==='wrong'&&<div className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">✕</div>}</div>
 </div></div></div>

            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            handleStartAgain={(checkEvent) => { resetCompletedCheck(); (handleStartAgain)(checkEvent); }}
            handleShowAnswer={handleShowAnswer} // ✅
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page13_Q1;

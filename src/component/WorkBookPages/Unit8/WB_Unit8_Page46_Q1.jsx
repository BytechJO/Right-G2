import { FaVolumeUp } from "react-icons/fa";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import paragraphAudio from "../../../assets/audio/WorkBook/Unit 8/Page 46  - D/Item_002_Peter_has_gray_pants_and_a_green_jacket._His_shoes_are_black._Joanna_has.mp3";
import ExerciseHeader from "../../ExerciseHeader";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

// ==================== صور الشخصيات الأساسية ====================
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1_1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Jwana.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 95.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 4.svg";

// ==================== صور الطبقات للشخصية الأولى (Peter) ====================
import imgLayer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 84.svg";
import imgLayer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1-3.svg";
import imgLayer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex D 1-1.svg";

// ==================== صور الطبقات للشخصية الثانية (Joanna) ====================
import img2Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Dress new_1.svg";
import img2Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Shoes.svg";
import img2Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Shoes 3.svg";
import img2Layer4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/socks.svg";
import img2Layer5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Socks 2.svg";

// ==================== صور الطبقات للشخصية الثالثة (Mark) ====================
import img3Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/mark-top.svg";
import img3Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/mark-short.svg";
import img3Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/hat.svg";

// ==================== صور الطبقات للشخصية الرابعة (Susan) ====================
import img4Layer1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/susan-top.svg";
import img4Layer2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Asset 110.svg";
import img4Layer3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/glass.svg";

// ==================== قائمة الألوان ====================
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget = root?.querySelector(".try-again-button:not(:disabled)") || root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({
      preventScroll: true
    });
  }
  ValidationAlert[kind](...messages);
}
const SpeakerBadge = () => <span aria-hidden="true" style={{
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
  boxShadow: "0 1px 3px rgba(0,0,0,.25)"
}}>
    <FaVolumeUp size={12} />
  </span>;
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
const activateColor = e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
};
const releaseColor = e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
const colorsList = [{
  name: "Gray",
  value: "#808080"
}, {
  name: "Green",
  value: "#00AA00"
}, {
  name: "Black",
  value: "#000000"
}, {
  name: "Yellow",
  value: "#FFFF00"
}, {
  name: "White",
  value: "#FFFFFF"
}, {
  name: "Brown",
  value: "#8B4513"
}, {
  name: "Red",
  value: "#FF0000"
}, {
  name: "Orange",
  value: "#FFA500"
}, {
  name: "Blue",
  value: "#0000FF"
}, {
  name: "Pink",
  value: "#FFC0CB"
}, {
  name: "Purple",
  value: "#800080"
}];

// ==================== الإجابات الصحيحة ====================
const correctAnswers = {
  peter: {
    pants: "#808080",
    jacket: "#00AA00",
    shoes: "#000000"
  },
  joanna: {
    dress: "#FFFF00",
    socks: "#FFFFFF",
    shoes: "#8B4513"
  },
  mark: {
    shorts: "#FF0000",
    hat: "#FFFFFF",
    shirt: "#FFA500"
  },
  susan: {
    skirt: "#0000FF",
    shirt: "#FFC0CB",
    glass: "#800080"
  }
};

// ==================== بيانات الشخصيات والطبقات ====================
const charactersData = {
  peter: {
    name: "Peter",
    baseImage: img1,
    layers: [{
      id: "pants",
      image: imgLayer1,
      label: "Pants",
      top: 140,
      left: 33,
      height: 47,
      width: 54
    }, {
      id: "jacket",
      image: imgLayer3,
      label: "Jacket",
      top: 57,
      left: 14,
      height: 40,
      width: 83
    }, {
      id: "shoes",
      image: imgLayer2,
      label: "Shoes",
      top: 267,
      left: 31,
      height: 12,
      width: 55
    }]
  },
  joanna: {
    name: "Joanna",
    baseImage: img2,
    layers: [{
      id: "dress",
      image: img2Layer1,
      label: "Dress",
      top: 62,
      left: 14,
      height: 61,
      width: 72
    }, {
      id: "Shoes1",
      image: img2Layer2,
      label: "Shoes1",
      top: 276,
      left: 65,
      height: 6,
      width: 26
    }, {
      id: "Shoes2",
      image: img2Layer3,
      label: "Shoes2",
      top: 272,
      left: 26,
      height: 8,
      width: 21
    }, {
      id: "sock1",
      image: img2Layer4,
      label: "sock1",
      top: 254,
      left: 31,
      height: 8,
      width: 17
    }, {
      id: "sock2",
      image: img2Layer5,
      label: "sock2",
      top: 259,
      left: 64,
      height: 8,
      width: 17
    }]
  },
  mark: {
    name: "Mark",
    baseImage: img3,
    layers: [{
      id: "shorts",
      image: img3Layer2,
      label: "Shorts",
      top: 141,
      left: 29,
      height: 28,
      width: 55
    }, {
      id: "hat",
      image: img3Layer1,
      label: "hat",
      top: 68,
      left: 14,
      height: 29,
      width: 75
    }, {
      id: "shirt",
      image: img3Layer3,
      label: "shirt",
      top: 4,
      left: 23,
      height: 16,
      width: 47
    }]
  },
  susan: {
    name: "Susan",
    baseImage: img4,
    layers: [{
      id: "shirt",
      image: img4Layer1,
      label: "Shirt",
      top: 67,
      left: 25,
      height: 28,
      width: 72
    }, {
      id: "skirt",
      image: img4Layer2,
      label: "Skirt",
      top: 138,
      left: 22,
      height: 29,
      width: 69
    }, {
      id: "glass",
      image: img4Layer3,
      label: "glass",
      top: 29,
      left: 55,
      height: 10,
      width: 34
    }]
  }
};

// ==================== دالة ذكية لتعديل SVG (تُنفذ مرة واحدة فقط) ====================
const prepareSvgForInstantColoring = svgContent => {
  if (!svgContent) return svgContent;
  let modified = svgContent;
  modified = modified.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  modified = modified.replace(/stroke="[^"]*"/g, 'stroke="#000000"');
  modified = modified.replace(/<style>[\s\S]*?<\/style>/g, styleTag => {
    return styleTag.replace(/fill:\s*[^;]*;?/g, "fill: currentColor;").replace(/stroke:\s*[^;]*;?/g, "stroke: #000000;");
  });
  return modified;
};

// ==================== مكوّن الطبقة الواحدة ====================
const ColorableLayer = ({
  layer,
  person,
  color,
  svgContent,
  onClick,
  isSelected,
  layerRefs,
  paletteOpen,
  locked
}) => {
  return <div className={`absolute cursor-pointer transition-colors duration-0 ${isSelected ? "ring-2 ring-blue-500 ring-offset-2 z-10" : "hover:opacity-80"}`} style={{
    top: `${layer.top}px`,
    left: `${layer.left}px`,
    width: `${layer.width}%`,
    height: `${layer.height}%`,
    color: color || "transparent"
  }} onClick={e => {
    if (locked) return;
    e.stopPropagation();
    onClick(person, layer.id, e.detail === 0);
  }} role="button" tabIndex={paletteOpen ? -1 : 0} aria-label={person + ", " + layer.id + (locked ? ". Correct and locked." : ". Choose a color")} aria-pressed={isSelected} onKeyDown={activateColor} onKeyUp={releaseColor} ref={el => {
    layerRefs.current[person + "-" + layer.id] = el;
  }} aria-disabled={locked}>
      {svgContent ? <div className="svg-wrapper w-full h-full" dangerouslySetInnerHTML={{
      __html: svgContent
    }} /> : <div className="text-center text-gray-400">...</div>}
    </div>;
};

// ==================== مكوّن الشخصية ====================
const Character = ({
  personKey,
  personData,
  colors,
  activePart,
  svgContents,
  onLayerClick,
  isWrong,
  layerRefs,
  isCorrect
}) => {
  const personColors = colors[personKey] || {};
  return <div className="flex flex-col items-center">
      <div className="relative inline-block bg-white rounded-lg overflow-visible shadow-sm mb-3" style={{
      height: "300px",
      width: "120px",
      ...(isCorrect ? {
        outline: "3px solid #16a34a",
        outlineOffset: 2
      } : {})
    }}>
        <img src={personData.baseImage} alt={personData.name} className="object-contain" style={{
        height: "300px",
        width: "120px"
      }} />
        {personData.layers.map(layer => <ColorableLayer paletteOpen={!!activePart} layerRefs={layerRefs} key={`${personKey}-${layer.id}`} layer={layer} person={personKey} color={personColors[layer.id]} svgContent={svgContents[`${personKey}-${layer.id}`]} onClick={onLayerClick} isSelected={activePart?.person === personKey && activePart?.part === layer.id} locked={isCorrect} />)}
      </div>
      <div className="relative">
        <p className="text-sm font-semibold text-gray-800">{personData.name}</p>

        {isWrong && <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
            ✕
          </div>}
      </div>
    </div>;
};

// ==================== المكوّن الرئيسي ====================
const ReadAndColor = () => {
  const {
    rootRef,
    playingKey,
    playSound,
    stopAudio
  } = useExerciseAudio();
  const focusPaletteRef = useRef(false);
  const layerRefs = useRef({});
  const [colors, setColors] = useState({});
  const [activePart, setActivePart] = useState(null);
  const [svgContents, setSvgContents] = useState({});
  const paletteRef = useRef(null);
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const lockedPeopleRef = useRef(new Set());
  const completionRef = useRef(false);
  const complete = Object.keys(charactersData).every(person => results[person] === 'correct');
  lockedPeopleRef.current = new Set(Object.keys(charactersData).filter(person => revealed || results[person] === 'correct'));
  completionRef.current = complete || revealed;
  useCheckButton(rootRef, complete || revealed);
  useEffect(() => {
    const loadAndPrepareSvgs = async () => {
      const svgMap = {};
      const layersToLoad = [];
      Object.entries(charactersData).forEach(([personKey, personData]) => {
        personData.layers.forEach(layer => {
          layersToLoad.push({
            key: `${personKey}-${layer.id}`,
            url: layer.image
          });
        });
      });
      const results = await Promise.all(layersToLoad.map(async item => {
        try {
          const response = await fetch(item.url);
          const text = await response.text();
          return {
            key: item.key,
            content: prepareSvgForInstantColoring(text)
          };
        } catch {
          return {
            key: item.key,
            content: null
          };
        }
      }));
      results.forEach(res => {
        svgMap[res.key] = res.content;
      });
      setSvgContents(svgMap);
    };
    loadAndPrepareSvgs();
  }, []);
  useEffect(() => {
    const handleClickOutside = event => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        setActivePart(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLayerClick = (person, part, keyboard = false) => {
    if (lockedPeopleRef.current.has(person)) return;
    focusPaletteRef.current = keyboard;
    setActivePart({
      person,
      part
    });
  };
  useLayoutEffect(() => {
    if (!activePart || lockedPeopleRef.current.has(activePart.person)) {
      focusPaletteRef.current = false;
      return;
    }
    if (!focusPaletteRef.current) return;
    focusPaletteRef.current = false;
    const palette = paletteRef.current;
    const selected = palette?.querySelector('button[aria-pressed="true"]');
    (selected || palette?.querySelector("button"))?.focus({
      preventScroll: true
    });
  }, [activePart, results, revealed]);
  const closePalette = () => {
    focusPaletteRef.current = false;
    setActivePart(null);
    if (activePart) layerRefs.current[activePart.person + "-" + activePart.part]?.focus({
      preventScroll: true
    });
  };
  const handleColorSelect = colorValue => {
    if (!activePart || lockedPeopleRef.current.has(activePart.person)) return;
    if (!activePart) return;
    const {
      person,
      part
    } = activePart;
    setColors(prev => ({
      ...prev,
      [person]: {
        ...(prev[person] || {}),
        [part]: colorValue
      }
    }));
    setActivePart(null);
    layerRefs.current[person + "-" + part]?.focus({
      preventScroll: true
    });
    setResults(prev => ({
      ...prev,
      [person]: null
    }));
  };
  const isAllColored = () => {
    for (const personKey in charactersData) {
      const personLayers = charactersData[personKey].layers;
      const userColors = colors[personKey] || {};
      for (const layer of personLayers) {
        if (!userColors[layer.id]) {
          return false;
        }
      }
    }
    return true;
  };
  const checkAnswers = () => {
    if (completionRef.current) return;
    stopAudio();
    focusPaletteRef.current = false;
    if (!isAllColored()) {
      ValidationAlert.info("Please color all parts before checking your answers.");
      return;
    }
    let score = 0;
    let total = 0;
    Object.keys(correctAnswers).forEach(person => {
      Object.keys(correctAnswers[person]).forEach(part => {
        total++;
        if (person === "joanna") {
          if (part === "shoes") {
            if (colors.joanna?.Shoes1 === correctAnswers.joanna.shoes && colors.joanna?.Shoes2 === correctAnswers.joanna.shoes) score++;
          } else if (part === "socks") {
            if (colors.joanna?.sock1 === correctAnswers.joanna.socks && colors.joanna?.sock2 === correctAnswers.joanna.socks) score++;
          } else if (colors[person]?.[part] === correctAnswers[person][part]) score++;
        } else if (colors[person]?.[part] === correctAnswers[person][part]) score++;
      });
    });
    const nextResults = Object.fromEntries(Object.keys(charactersData).map(person => [person, results[person] === 'correct' || !isPersonWrong(person) ? 'correct' : 'wrong']));
    lockedPeopleRef.current = new Set(Object.keys(nextResults).filter(person => nextResults[person] === 'correct'));
    completionRef.current = score === total;
    setResults(nextResults);
    setActivePart(null);
    const msg = `Score: ${score} / ${total}`;
    if (score === total) showCheckFeedback(rootRef.current, "success", msg);else if (score === 0) showCheckFeedback(rootRef.current, "error", msg);else showCheckFeedback(rootRef.current, "warning", msg);
  };
  const handleStartAgain = () => {
    stopAudio();
    focusPaletteRef.current = false;
    lockedPeopleRef.current = new Set();
    completionRef.current = false;
    setResults({});
    setRevealed(false);
    setColors({});
    setActivePart(null);
  };
  const isPersonWrong = person => {
    const userColors = colors[person] || {};
    const correct = correctAnswers[person];
    if (person === "joanna") {
      // shoes
      if (userColors.Shoes1 !== correct.shoes || userColors.Shoes2 !== correct.shoes) return true;

      // socks
      if (userColors.sock1 !== correct.socks || userColors.sock2 !== correct.socks) return true;

      // dress
      if (userColors.dress !== correct.dress) return true;
      return false;
    }
    if (person === "susan") {
      if (userColors.glass !== correct.glass) return true;
    }
    return Object.keys(correct).some(part => userColors[part] !== correct[part]);
  };
  // ==================== وظيفة إظهار الإجابات ====================
  const handleShowAnswers = () => {
    stopAudio();
    focusPaletteRef.current = false;
    const answersColors = {
      peter: {
        pants: correctAnswers.peter.pants,
        jacket: correctAnswers.peter.jacket,
        shoes: correctAnswers.peter.shoes
      },
      joanna: {
        dress: correctAnswers.joanna.dress,
        Shoes1: correctAnswers.joanna.shoes,
        Shoes2: correctAnswers.joanna.shoes,
        sock1: correctAnswers.joanna.socks,
        sock2: correctAnswers.joanna.socks
      },
      mark: {
        shorts: correctAnswers.mark.shorts,
        shirt: correctAnswers.mark.shirt,
        hat: correctAnswers.mark.hat
      },
      susan: {
        skirt: correctAnswers.susan.skirt,
        shirt: correctAnswers.susan.shirt,
        glass: correctAnswers.susan.glass // 👈 مهم جدًا
      }
    };
    setColors(answersColors);
    setActivePart(null);
    lockedPeopleRef.current = new Set(Object.keys(charactersData));
    completionRef.current = true;
    setResults(Object.fromEntries(Object.keys(charactersData).map(person => [person, 'correct'])));
    setRevealed(true);
  };
  //.
  return <div className="main-container-component relative" ref={rootRef}>
      <div className="div-forall" style={{
      gap: "15px"
    }}>
        <div>
          <ExerciseHeader isWorkbook sectionLetter="D" title="Read and color." subTitle={"Read one person's description completely, then color every clothing item to match it."} />
          <p className="text-sm text-gray-500 mb-6">
            💡 Click on any part to color it instantly
          </p>
        </div>

        <div>
          <div className="flex justify-around items-start gap-4 mb-8">
            {Object.entries(charactersData).map(([key, data]) => <Character layerRefs={layerRefs} key={key} personKey={key} personData={data} colors={colors} activePart={activePart} svgContents={svgContents} onLayerClick={handleLayerClick} isWrong={results[key] === "wrong"} isCorrect={revealed || results[key] === "correct"} />)}
          </div>

          {activePart && !lockedPeopleRef.current.has(activePart.person) && <div ref={paletteRef} className="absolute z-50 bg-white rounded-lg p-3 shadow-2xl border border-gray-200 animate-in" style={{
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "280px"
        }} role="group" aria-label="Choose a color" onKeyDown={e => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            closePalette();
          }
        }}>
              <p className="text-center text-xs font-bold mb-2 text-gray-600 uppercase tracking-wider">
                Select Color
              </p>
              <div className="grid grid-cols-4 gap-2">
                {colorsList.map(c => <button key={c.value} onClick={() => handleColorSelect(c.value)} className="w-10 h-10 rounded-full border-2 border-gray-100 hover:scale-110 transition-transform" style={{
              backgroundColor: c.value
            }} type="button" aria-label={c.name || c.value} onKeyDown={activateColor} onKeyUp={releaseColor} aria-pressed={colors[activePart.person]?.[activePart.part] === c.value} />)}
              </div>
            </div>}

          <div className="text-start text-[18px] leading-relaxed text-gray-700 mb-8 bg-gray-50 p-4 rounded-lg">
            <p role="button" tabIndex={activePart ? -1 : 0} aria-label="Hear the coloring instructions" onClick={() => playSound("paragraph", paragraphAudio)} onKeyDown={activateColor} onKeyUp={releaseColor} className="focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!" style={{
            position: "relative",
            borderRadius: 8,
            cursor: "pointer",
            ...(playingKey === "paragraph" ? {
              boxShadow: "0 0 0 3px #2563eb",
              backgroundColor: "#dbeafe"
            } : {})
          }}>
              Peter has gray pants and a green jacket. His shoes are black.
              Joanna has a yellow dress, white socks, and brown shoes. Mark has
              red shorts and a white shirt. His hat is orange. Susan has a blue
              skirt and a pink shirt. Her glasses are purple.
              {playingKey === "paragraph" && <SpeakerBadge />}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} handleShowAnswer={handleShowAnswers} // تمرير الوظيفة الجديدة للزر
        />
        </div>
      </div>

      <style>{`
        .svg-wrapper svg { width: 100%; height: 100%; object-fit: contain; }
        .animate-in { animation: fadeInZoom 0.15s ease-out forwards; }
        @keyframes fadeInZoom {
          from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>;
};
export default ReadAndColor;

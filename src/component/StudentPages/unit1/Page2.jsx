import React, { useRef ,useState ,useEffect} from "react";
import page2 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 2.png";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";

// غيّر المسارات حسب مكان الأصوات عندك
import unit1Audio from "../../../assets/audio/ClassBook/U 1/Page 2/Stella's Family.mp3";
import unit2Audio from "../../../assets/audio/ClassBook/U 1/Page 2/A Day at the Park.mp3";
import unit3Audio from "../../../assets/audio/ClassBook/U 1/Page 2/On a Picnic.mp3";
import unit4Audio from "../../../assets/audio/ClassBook/U 1/Page 2/Helen's Uncle Is a Photographer.mp3";
import unit5Audio from "../../../assets/audio/ClassBook/U 1/Page 2/Yummy... I Like It!.mp3";

const Page2 = ({ goToUnit }) => {
  const imgRef = useRef(null);
  const audioRef = useRef(null);

  const [playingUnit, setPlayingUnit] = useState(null);

  const clickableAreas = [
    {
      title: "Unit 1",
      startIndex: 4,
      audio: unit1Audio,
      top: "8.5%",
      left: "13%",
      width: "23%",
      height: "3%",
      arrowTop: "8.5%",
      arrowLeft: "36%",
    },
    {
      title: "Unit 2",
      startIndex: 10,
      audio: unit2Audio,

      top: "26.5%",
      left: "13%",
      width: "26%",
      height: "3%",

      arrowTop: "26.5%",
      arrowLeft: "39%",
    },
    {
      title: "Unit 3",
      startIndex: 22,
      audio: unit3Audio,

      top: "44%",
      left: "13%",
      width: "20%",
      height: "3%",

      arrowTop: "44%",
      arrowLeft: "33%",
    },
    {
      title: "Unit 4",
      startIndex: 28,
      audio: unit4Audio,

      top: "61%",
      left: "13%",
      width: "41%",
      height: "3%",

      arrowTop: "61%",
      arrowLeft: "54%",
    },
    {
      title: "Unit 5",
      startIndex: 40,
      audio: unit5Audio,

      top: "79%",
      left: "13%",
      width: "26%",
      height: "3%",

      arrowTop: "79%",
      arrowLeft: "39.5%",
    },
  ];

  const playUnitAudio = (area) => {
    // إذا في صوت شغال، وقفه أول
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(area.audio);

    audioRef.current = audio;
    setPlayingUnit(area.title);

    audio.play();

    audio.onended = () => {
      setPlayingUnit(null);
    };
  };

  const handleGoToUnit = (area) => {
    // وقف الصوت قبل الانتقال للوحدة
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingUnit(null);

    goToUnit(area.startIndex);
  };

  // لو طلع المستخدم من الصفحة، وقف الصوت
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className="page1-img-wrapper"
      ref={imgRef}
      style={{
        backgroundImage: `url(${page2})`,
        position: "relative",
      }}
    >
      {clickableAreas.map((area, index) => (
        <React.Fragment key={index}>
          {/* =========================
              UNIT AUDIO AREA
          ========================== */}
          <button
            type="button"
            onClick={() => playUnitAudio(area)}
            aria-label={`Play ${area.title} audio`}
            aria-pressed={playingUnit === area.title}
            className={`absolute cursor-pointer transition-all duration-150
              ${
                playingUnit === area.title
                  ? "ring-4 ring-green-500"
                  : "hover:ring-2 hover:ring-blue-400"
              }
            `}
            style={{
              top: area.top,
              left: area.left,
              width: area.width,
              height: area.height,
              background: "transparent",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {playingUnit === area.title && (
              <span
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: "0",
                  background: "#16a34a",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                🔊 Playing
              </span>
            )}
          </button>

          {/* =========================
              NAVIGATION ARROW
          ========================== */}
          <button
            type="button"
            onClick={() => handleGoToUnit(area)}
            aria-label={`Go to ${area.title}`}
            className="
    absolute z-20
    flex items-center justify-center
    p-0
    bg-transparent
    border-0
    cursor-pointer
    transition-all duration-150
    hover:scale-110
    active:scale-95
    rounded-full
    focus:outline-none
  "
            style={{
              top: area.arrowTop,
              left: area.arrowLeft,

              width: "18px",
              height: "18px",
              minWidth: "18px",
              minHeight: "18px",
              maxWidth: "18px",
              maxHeight: "18px",

              padding: 0,
            }}
          >
            <img
              src={arrowBtn}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Page2;
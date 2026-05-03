import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaDownload } from "react-icons/fa6";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page23/Ex F 6.svg";

const friendActivityData = [
  { id: "f1", item: "dolls", img: img1 },
  { id: "f2", item: "teddy bear", img: img2 },
  { id: "f3", item: "tennis rackets", img: img3 },
  { id: "f4", item: "soccer ball", img: img4 },
  { id: "f5", item: "computer", img: img5 },
  { id: "f6", item: "car", img: img6 },
];

const WB_Unit4_Page23_Q2 = () => {
  const [friendAnswers, setFriendAnswers] = useState({});
  const [askedItem, setAskedItem] = useState("");
  const [showResults, setShowResults] = useState(false);
  const captureRef = useRef(null);

  const handleCellClick = (itemId, friend) => {
    if (showResults) return;
    const cellId = `${itemId}-${friend}`;
    setFriendAnswers((prev) => {
      const currentAnswer = prev[cellId];
      if (currentAnswer === "Yes") return { ...prev, [cellId]: "No" };
      if (currentAnswer === "No") return { ...prev, [cellId]: undefined };
      return { ...prev, [cellId]: "Yes" };
    });
  };

  const handleStartAgain = () => {
    setFriendAnswers({});
    setAskedItem("");
    setShowResults(false);
  };
  const checkAnswers = () => {
    if (showResults) return;

    // ✅ تحقق من كل الخانات
    const allFilled = friendActivityData.every((item) => {
      const f1 = friendAnswers[`${item.id}-friend1`];
      const f2 = friendAnswers[`${item.id}-friend2`];

      return f1 && f2;
    });

    if (!allFilled) {
      ValidationAlert.info("Please answer all cells first.");
      return;
    }

    // ✅ إذا كله تمام
    ValidationAlert.success("Good Job!!");
    setShowResults(true);
  };

  const handledownload = async () => {
    const element = captureRef.current;

    const dataUrl = await toPng(element);

    const link = document.createElement("a");
    link.download = "activity.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div ref={captureRef}>
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"35px"}}>
          <h1 className="WB-header-title-page8">
            {" "}

            <span className="WB-ex-A">F</span>Ask your friend. Write "Yes" or
            "No."
          </h1>
      <div className="flex flex-col gap-5">
          <div className="mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2">
            <p className="text-lg font-medium">Do you want</p>
            <input
              type="text"
              value={askedItem}
              onChange={(e) => setAskedItem(e.target.value)}
              placeholder="a car"
              className="w-32 text-center bg-transparent border-b-2 border-gray-400 focus:border-blue-500 focus:outline-none text-lg font-semibold"
            />
            <p className="text-lg font-medium">?</p>
          </div>

          <table className="w-full border-collapse mb-20">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left text-lg">
                  Item
                </th>
                <th className="p-3 border border-gray-300 text-lg">friend 1</th>
                <th className="p-3 border border-gray-300 text-lg">friend 2</th>
              </tr>
            </thead>
            <tbody>
              {friendActivityData.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="p-3 border border-gray-300 flex items-center justify-between">
                    <span className="text-lg">{item.item}</span>
                    <img
                      src={item.img}
                      alt={item.item}
                      className="max-w-12 max-h-12"
                    />
                  </td>
                  <td
                    className="p-3 border border-gray-300 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCellClick(item.id, "friend1")}
                  >
                    <span
                      className={`text-xl font-bold ${friendAnswers[`${item.id}-friend1`] === "Yes" ? "text-green-600" : "text-red-600"}`}
                    >
                      {friendAnswers[`${item.id}-friend1`]}
                    </span>
                  </td>
                  <td
                    className="p-3 border border-gray-300 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCellClick(item.id, "friend2")}
                  >
                    <span
                      className={`text-xl font-bold ${friendAnswers[`${item.id}-friend2`] === "Yes" ? "text-green-600" : "text-red-600"}`}
                    >
                      {friendAnswers[`${item.id}-friend2`]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
</div>
          <div className="action-buttons-container">
            <button onClick={handleStartAgain} className="try-again-button">
              Start Again ↻
            </button>
            <button
              onClick={handledownload}
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
            >
              <FaDownload />
            </button>
            <button onClick={checkAnswers} className="check-button2">
              Finish ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit4_Page23_Q2;

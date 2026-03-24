import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import placeholderImg from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaDownload } from "react-icons/fa6";

const friendActivityData = [
  { id: "f1", item: "dolls", img: placeholderImg },
  { id: "f2", item: "teddy bear", img: placeholderImg },
  { id: "f3", item: "tennis rackets", img: placeholderImg },
  { id: "f4", item: "soccer ball", img: placeholderImg },
  { id: "f5", item: "computer", img: placeholderImg },
  { id: "f6", item: "car", img: placeholderImg },
];

const WB_Unit4_Page23_Q2 = () => {
  const [friendAnswers, setFriendAnswers] = useState({});
  const [askedItem, setAskedItem] = useState("");
  const captureRef = useRef(null);

  const handleCellClick = (itemId, friend) => {
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
  };

  const checkAnswers = () => {
    ValidationAlert.success("Good Job!!");
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
        <div className="div-forall" style={{ gap: "20px" }}>
          <h1 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">F</span>Ask your friend. Write "Yes" or
            "No."
          </h1>
        

        <div className="mb-8 p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2">
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

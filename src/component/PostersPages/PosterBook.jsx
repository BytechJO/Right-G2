// import { teacherPages } from "../BookData/teacherPages"; // عدّل المسار حسب مكان الملف
import { useState } from "react";
export default function PosterBook({ posters }) {
  const [currentPage, setCurrentPage] = useState(0);
console.log(posters);

  return (
    <div
      className="page1-img-wrapper-posters"
      style={{
        backgroundImage: `url(${posters})`,
      }}
    />
  );
}

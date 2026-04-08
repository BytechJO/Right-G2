// يستورد كل الصور داخل مجلد Right TB تلقائياً
const images = import.meta.glob(
  "../../assets/imgs/pages/Right InternationalTB/*.jpg",
  { eager: true }
);


export const teacherPages = Object.keys(images)
  .sort((a, b) => {
    const numA = Number(a.match(/(\d+)\.jpg$/)[1]);
    const numB = Number(b.match(/(\d+)\.jpg$/)[1]);
    return numA - numB;
  })
  .map((key) => images[key].default);



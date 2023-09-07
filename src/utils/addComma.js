const addComma = (x) => {
  // 分割小數點
  const numAry = x.toString().split(".");
  // 只取整數部分作正規化
  numAry[0] = numAry[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numAry.join(".");
};

export default addComma;

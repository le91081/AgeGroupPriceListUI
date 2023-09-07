// 想法是建立次數表來紀錄數字區間出現過的次數
// 次數 == 0 代表沒有出現過, 次數 >= 2 代表有重疊
// 例如 : [[0, 1], [1, 2], [1, 1], [3, 5], [8, 10]]
// 可記錄成下面次數表
// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
// 2, 3, 2, 1, 1, 1, 0, 0, 1, 1, 1
// 重疊區間 [[0, 2]], 未包含區間 [[6, 7]]
const getNumberIntervals = (intervals, start, end) => {
  const numMap = new Map();

  // 設置 start ~ end 的出現次數表，預設都為 0
  for (let i = start; i <= end; i++) {
    numMap.set(i, 0);
  }

  // 將所有數字區間出現過的次數更新在次數表上
  for (let interval of intervals) {
    for (let num = interval[0]; num <= interval[1]; num++) {
      numMap.set(num, numMap.get(num) + 1);
    }
  }

  let prevStartNum, startNum, endNum;
  let startFindNotInclude = false,
    startFindOverlap = false;
  const overlap = [],
    notInclude = [];

  // 檢查次數表上所有數字出現過的次數
  for (let i = start; i <= end; i++) {
    const times = numMap.get(i);

    // 次數 0 代表未包含
    if (times === 0) {
      // 如果從重疊的區間過度到未包含的區間時，要將先前重疊範圍的起始值記下來
      // 例如 : 2, 2, 2, 0, 0, 0，重疊區間為 [0, 2]，要將 0 先記錄下來
      // 以免過度時 startNum 被重置後遺失重疊的起始值
      if (startFindOverlap) {
        prevStartNum = startNum;
      }

      // 紀錄未包含的區間起始值
      if (!startFindNotInclude) {
        startFindNotInclude = true;
        startNum = i;
      }

      // 如果最後一個數字也不包含的話直接推入
      if (i === end) {
        notInclude.push([startNum, i]);
      }
    } else if (times !== 0 && startFindNotInclude) {
      // 如果數字過渡到其他非重疊的區間時，推入區間起始值, 結束值
      startFindNotInclude = false;
      endNum = i - 1;
      notInclude.push([startNum, endNum]);
    }

    // 次數 >= 2 代表有重疊，作法同上
    if (times >= 2) {
      if (!startFindOverlap) {
        startFindOverlap = true;
        startNum = i;
      }

      if (i === end) {
        overlap.push([startNum, i]);
      }
    } else if (times < 2 && startFindOverlap) {
      startFindOverlap = false;
      endNum = i - 1;
      // 如果 prevStartNum 有值，代表 startNum 已被改變，改用 prevStartNum 為起始值
      if (prevStartNum !== undefined) {
        overlap.push([prevStartNum, endNum]);
        prevStartNum = undefined;
      } else {
        overlap.push([startNum, endNum]);
      }
    }
  }

  return { overlap, notInclude };
};

export default getNumberIntervals;

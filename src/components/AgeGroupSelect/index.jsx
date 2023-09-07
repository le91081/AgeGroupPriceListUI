import React from "react";
import styles from "./index.module.css";

const SELECT_NAME = {
  START_OPTION: "startOption",
  END_OPTION: "endOption",
};

// 依照 start, end 設置 Select 中的起始與結束選項
const setOptions = (start, end) => {
  const options = [];
  for (let num = start; num <= end; num++) {
    options.push(
      <option value={num} key={num}>
        {num}
      </option>
    );
  }
  return options;
};

const AgeGroupSelect = ({ min, max, value, validate, onChange }) => {
  const [startOption, endOption] = value;

  const changeSelectHandler = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case SELECT_NAME.START_OPTION:
        onChange([parseInt(value), endOption]);
        break;
      case SELECT_NAME.END_OPTION:
        onChange([startOption, parseInt(value)]);
        break;
      default:
        break;
    }
  };

  // 設定起始與結束年齡的選項
  const startOptions = setOptions(min, endOption);
  const endOptions = setOptions(startOption, max);

  return (
    <div className={styles["age-group-select-container"]}>
      <div className={styles["age-group-select-title"]}>年齡</div>
      <div className={styles["age-group-select-wrapper"]}>
        <select
          name={SELECT_NAME.START_OPTION}
          value={startOption}
          onChange={changeSelectHandler}
        >
          {startOptions}
        </select>
        <span>~</span>
        <select
          name={SELECT_NAME.END_OPTION}
          value={endOption}
          onChange={changeSelectHandler}
        >
          {endOptions}
        </select>
      </div>
      {!validate.init && !validate.valid && (
        <div className={styles["age-group-select-warning"]}>
          {validate.reason}
        </div>
      )}
    </div>
  );
};

export default AgeGroupSelect;

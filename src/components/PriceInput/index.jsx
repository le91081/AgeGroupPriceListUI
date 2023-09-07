import React, { useEffect, useRef } from "react";
import addComma from "../../utils/addComma";
import { filterCharsInNumber, INPUT_NAME } from "../../utils/ageGroupPriceList";
import styles from "./index.module.css";

// 按鍵白名單
const VALID_KEYS = [
  ".",
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
];

const PriceInput = ({ onChange, onBlur, value, validate }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.value = value;
  }, [value]);

  const inputChangeHandler = (e) => {
    onChange(e.target.value);
  };

  const inputBlurHandler = (e) => {
    onBlur(value);
    // 本來是在 onChange 時直接加上 comma，
    // 但後來個人認為 onBlur 時再加上 comma 的體驗會比較好一點
    e.target.value = addComma(value);
  };

  const inputFocusHandler = (e) => {
    // focus 時將在數字上的 comma 過濾掉，個人認為輸入數字的體驗會比較好
    e.target.value = filterCharsInNumber(value);
  };

  const inputKeydownHandler = (e) => {
    const price = e.target.value;
    if (e.key === ".") {
      // 如果已經有小數點就禁止再次輸入
      if (price.includes(".")) {
        e.preventDefault();
      } else if (!price) {
        // 如果直接輸入小數點就以 0 開頭
        e.target.value = "0";
      }
    } else if (!VALID_KEYS.includes(e.key) && isNaN(Number(e.key))) {
      // 過濾數字以及白名單以外的輸入
      e.preventDefault();
    }
  };

  return (
    <div className={styles["price-input-container"]}>
      <div className={styles["price-input-title"]}>入住費用 (每人每晚)</div>
      <div className={styles["price-input-wrapper"]}>
        <label className={styles["prefix"]} htmlFor={INPUT_NAME.PRICE_INPUT}>
          TWD
        </label>
        <input
          type="text"
          ref={inputRef}
          id={INPUT_NAME.PRICE_INPUT}
          placeholder="請輸入費用"
          // value={addComma(value)}
          onBlur={inputBlurHandler}
          onFocus={inputFocusHandler}
          onChange={inputChangeHandler}
          onKeyDown={inputKeydownHandler}
        />
      </div>
      {/* 這邊設定的條件為新建立的輸入框在使用者尚未 focus 之前都不會顯示驗證錯誤提示 */}
      {!validate.init && !validate.valid && (
        <div className={styles["price-input-wraning"]}>{validate.reason}</div>
      )}
      <div className={styles["price-input-hint"]}>輸入 0 表示免費</div>
    </div>
  );
};

export default PriceInput;

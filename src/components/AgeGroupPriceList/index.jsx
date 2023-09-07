import React, { Fragment, useEffect, useReducer, useRef } from "react";
import PriceInput from "../PriceInput";
import AgeGroupSelect from "../AgeGroupSelect";
import ageGroupPriceReducer, { actionCreator, initialState } from "./reducer";
import styles from "./index.module.css";

import {
  MIN_AGE_GROUP,
  MAX_AGE_GROUP,
  filterCharsInNumber,
  createAgeGroupPriceItem,
} from "../../utils/ageGroupPriceList";

const {
  addAgeGroupPriceItem,
  removeAgeGroupPriceItem,
  changeAgeGroupPrice,
  checkAgeGroupPrice,
  changeAgeGroupSelect,
  checkAgeGroupSelect,
  setAgeGroupIntervals,
} = actionCreator();

const AgeGroupPrice = ({
  idx,
  ageGroupPriceItem,
  onRemove,
  onAgeGroupSelectChange,
  onPriceInputChange,
  onPriceInputBlur,
}) => {
  return (
    <div className={styles["age-group-price-item-container"]}>
      <div className={styles["age-group-price-item-header"]}>
        <span className={styles["age-group-price-item-title"]}>
          價格設定 - {idx + 1}
        </span>
        {idx > 0 && (
          <button
            className={`${styles["age-group-price-list-button"]} ${styles["remove"]}`}
            onClick={() => onRemove(ageGroupPriceItem.id)}
          >
            X 移除
          </button>
        )}
      </div>
      <div className={styles["age-group-price-item-wrapper"]}>
        <AgeGroupSelect
          min={MIN_AGE_GROUP}
          max={MAX_AGE_GROUP}
          value={ageGroupPriceItem.ageGroup.value}
          validate={ageGroupPriceItem.ageGroup.validate}
          onChange={(ageGroup) =>
            onAgeGroupSelectChange(ageGroup, ageGroupPriceItem.id)
          }
        />
        <PriceInput
          value={ageGroupPriceItem.price.value}
          validate={ageGroupPriceItem.price.validate}
          onChange={(price) => onPriceInputChange(price, ageGroupPriceItem.id)}
          onBlur={() => onPriceInputBlur(ageGroupPriceItem.id)}
        />
      </div>
    </div>
  );
};

const AgeGroupPriceList = ({ onChange }) => {
  const [state, dispatch] = useReducer(ageGroupPriceReducer, initialState);
  const { ageGroupPrices, ageGroupInterval } = state;
  const initRef = useRef(true);

  // 設置與驗證年齡重疊區間
  const setAndCheckInterval = () => {
    dispatch(setAgeGroupIntervals());
    dispatch(checkAgeGroupSelect());
  };

  // 新增 AgeGroupPrice 組件並設置、驗證年齡重疊區間
  const addAgeGroupAndSetInterval = (newPriceItem) => {
    dispatch(addAgeGroupPriceItem(newPriceItem));
    setAndCheckInterval();
  };

  // 點擊新增價格設定
  const addAgeGroupPriceItemHandler = () => {
    // 從 notInclude 中選出一個未重疊的年齡區間
    // 並設置為新 AgeGroupSelect 組件的預設值
    const ageGroup = ageGroupInterval.notInclude[0];
    const newPriceItem = createAgeGroupPriceItem(ageGroup);
    addAgeGroupAndSetInterval(newPriceItem);
  };

  // 點擊移除 AgeGroupPrice
  const removeAgeGroupPriceItemHandler = (id) => {
    dispatch(removeAgeGroupPriceItem(id));
    setAndCheckInterval();
  };

  const ageGroupSelectChangeHandler = (ageGroup, id) => {
    dispatch(changeAgeGroupSelect({ id, ageGroup }));
    setAndCheckInterval();
  };

  const priceInputChangeHandler = (price, id) => {
    dispatch(changeAgeGroupPrice({ id, price: filterCharsInNumber(price) }));
    dispatch(checkAgeGroupPrice({ id }));
  };

  const priceInputBlurHandler = (id) => {
    dispatch(checkAgeGroupPrice({ id }));
  };

  useEffect(() => {
    // 組件 mounted 後自動新增一個 AgeGroupSelect 組件
    const initialPriceItem = createAgeGroupPriceItem();
    addAgeGroupAndSetInterval(initialPriceItem);
    // eslint-disable-next-line
  }, []);

  // state 更新後執行 props 的 onChange
  useEffect(() => {
    // 初次渲染不執行
    if (initRef.current) {
      initRef.current = false;
      return;
    }

    // 可以用來判斷表單輸入是否都驗證成功
    // const isValid = ageGroupPrices.every((item) => {
    //   return item.ageGroup.validate.valid && item.price.validate.valid;
    // });
    // console.log('is form valid : ', isValid);

    const result = ageGroupPrices.map((item) => {
      // 如果 price 沒輸入值的話，這邊預設先給 null
      const price = parseInt(item.price.value);
      return {
        ageGroup: item.ageGroup.value,
        price: isNaN(price) ? null : price,
      };
    });

    onChange(result);
  }, [ageGroupPrices, onChange]);

  return (
    <div className={styles["age-group-price-list-container"]}>
      <ul className={styles["age-group-price-list-wrapper"]}>
        {ageGroupPrices.map((item, idx) => (
          <Fragment key={item.id}>
            {idx > 0 && <hr className={styles["age-group-price-divider"]} />}
            <li>
              <AgeGroupPrice
                idx={idx}
                ageGroupPriceItem={item}
                onRemove={removeAgeGroupPriceItemHandler}
                onAgeGroupSelectChange={ageGroupSelectChangeHandler}
                onPriceInputChange={priceInputChangeHandler}
                onPriceInputBlur={priceInputBlurHandler}
              />
            </li>
          </Fragment>
        ))}
      </ul>
      <button
        disabled={!ageGroupInterval.notInclude.length}
        className={`${styles["age-group-price-list-button"]} ${
          ageGroupInterval.notInclude.length
            ? styles["add"]
            : styles["add-disabled"]
        }`}
        onClick={addAgeGroupPriceItemHandler}
      >
        + 新增價格設定
      </button>
    </div>
  );
};

export default AgeGroupPriceList;

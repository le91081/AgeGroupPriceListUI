import { nanoid } from "nanoid";

export const MIN_AGE_GROUP = 0;
export const MAX_AGE_GROUP = 20;

export const ACTIONS = {
  ADD_AGE_GROUP_PRICE: "add_age_group_price_item",
  REMOVE_AGE_GROUP_PRICE: "remove_age_group_price_item",
  CHANGE_AGE_GROUP_PRICE_INPUT: "change_age_group_price_input",
  CHECK_AGE_GROUP_PRICE_INPUT: "check_age_group_price_input",
  CHANGE_AGE_GROUP_SELECT: "change_age_group_select",
  CHECK_AGE_GROUP_SELECT: "check_age_group_select",
  SET_AGE_GROUP_INTERVALS: "set_age_group_intervals",
};

export const INPUT_NAME = {
  PRICE_INPUT: "price_input",
};

export const INVALID_REASON = {
  EMPTY: "不可以為空白",
  OVERLAP: "年齡區間不可重疊",
};

// 建立 ageGroupPrice 物件
export const createAgeGroupPriceItem = (
  defaultAgeGroup = [MIN_AGE_GROUP, MAX_AGE_GROUP],
  defaultPrice = 0
) => {
  return {
    id: nanoid(),
    ageGroup: {
      value: defaultAgeGroup,
      validate: {
        valid: false,
        reason: "",
        init: true,
      },
    },
    price: {
      value: defaultPrice,
      validate: {
        valid: false,
        reason: "",
        init: true,
      },
    },
  };
};

// 過濾掉小數點與數字以外的字元
export const filterCharsInNumber = (price) => {
  return price.toString().replace(/[^.\d]/g, "");
};

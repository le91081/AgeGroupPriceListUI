import getNumberIntervals from "../../../utils/getNumberIntervals";
import {
  MIN_AGE_GROUP,
  MAX_AGE_GROUP,
  ACTIONS,
  INVALID_REASON,
} from "../../../utils/ageGroupPriceList";

export const actionCreator = () => {
  const addAgeGroupPriceItem = (payload) => {
    return { type: ACTIONS.ADD_AGE_GROUP_PRICE, payload };
  };

  const removeAgeGroupPriceItem = (payload) => {
    return { type: ACTIONS.REMOVE_AGE_GROUP_PRICE, payload };
  };

  const changeAgeGroupPrice = ({ id, price }) => {
    return {
      type: ACTIONS.CHANGE_AGE_GROUP_PRICE_INPUT,
      payload: { id, price },
    };
  };

  const checkAgeGroupPrice = ({ id, price }) => {
    return {
      type: ACTIONS.CHECK_AGE_GROUP_PRICE_INPUT,
      payload: { id, price },
    };
  };

  const changeAgeGroupSelect = ({ id, ageGroup }) => {
    return {
      type: ACTIONS.CHANGE_AGE_GROUP_SELECT,
      payload: { id, ageGroup },
    };
  };

  const checkAgeGroupSelect = () => {
    return {
      type: ACTIONS.CHECK_AGE_GROUP_SELECT,
    };
  };

  const setAgeGroupIntervals = () => {
    return {
      type: ACTIONS.SET_AGE_GROUP_INTERVALS,
    };
  };

  return {
    addAgeGroupPriceItem,
    removeAgeGroupPriceItem,
    changeAgeGroupPrice,
    checkAgeGroupPrice,
    changeAgeGroupSelect,
    checkAgeGroupSelect,
    setAgeGroupIntervals,
  };
};

export const initialState = {
  ageGroupPrices: [],
  ageGroupInterval: { overlap: [], notInclude: [] },
};

const ageGroupPriceReducer = (state, action) => {
  switch (action.type) {
    // 新增 AgeGroupPrice 物件
    case ACTIONS.ADD_AGE_GROUP_PRICE: {
      const newAgeGroupPrices = [...state.ageGroupPrices, action.payload];
      return { ...state, ageGroupPrices: newAgeGroupPrices };
    }

    // 移除 AgeGroupPrice 物件
    case ACTIONS.REMOVE_AGE_GROUP_PRICE: {
      const newAgeGroupPrices = state.ageGroupPrices.filter(
        (item) => item.id !== action.payload
      );
      return { ...state, ageGroupPrices: newAgeGroupPrices };
    }

    // 更改 PriceInput 的值
    case ACTIONS.CHANGE_AGE_GROUP_PRICE_INPUT: {
      const { id, price } = action.payload;
      const newAgeGroupPrices = state.ageGroupPrices.map((item) => {
        if (item.id === id) {
          return { ...item, price: { ...item.price, value: price } };
        } else {
          return item;
        }
      });
      return { ...state, ageGroupPrices: newAgeGroupPrices };
    }

    // 驗證 PriceInput 的值
    case ACTIONS.CHECK_AGE_GROUP_PRICE_INPUT: {
      const { id } = action.payload;
      const newAgeGroupPrices = state.ageGroupPrices.map((item) => {
        if (item.id === id) {
          // 驗證數值是否為空
          if (item.price.value === "") {
            return {
              ...item,
              price: {
                ...item.price,
                validate: {
                  valid: false,
                  reason: INVALID_REASON.EMPTY,
                },
              },
            };
          }

          return {
            ...item,
            price: {
              ...item.price,
              validate: {
                valid: true,
                reason: "",
              },
            },
          };
        } else {
          return item;
        }
      });
      return { ...state, ageGroupPrices: newAgeGroupPrices };
    }

    // 更改 AgeGroupSelect 的值
    case ACTIONS.CHANGE_AGE_GROUP_SELECT: {
      const { id, ageGroup } = action.payload;
      const newAgeGroupPrices = state.ageGroupPrices.map((item) => {
        if (item.id === id) {
          return { ...item, ageGroup: { ...item.ageGroup, value: ageGroup } };
        } else {
          return item;
        }
      });
      return {
        ...state,
        ageGroupPrices: newAgeGroupPrices,
      };
    }

    // 驗證 AgeGroupSelect 是否有重疊
    case ACTIONS.CHECK_AGE_GROUP_SELECT: {
      const overlaps = state.ageGroupInterval.overlap;
      const newAgeGroupPrices = state.ageGroupPrices.map((item) => {
        let isOverlap = false;
        for (const interval of overlaps) {
          const [startInterval, endInterval] = interval;
          const [startOption, endOption] = item.ageGroup.value;
          if (
            endOption - startInterval >= 0 &&
            endInterval - startOption >= 0
          ) {
            isOverlap = true;
            break;
          }
        }

        if (isOverlap) {
          return {
            ...item,
            ageGroup: {
              ...item.ageGroup,
              validate: {
                valid: false,
                reason: INVALID_REASON.OVERLAP,
              },
            },
          };
        } else {
          return {
            ...item,
            ageGroup: {
              ...item.ageGroup,
              validate: {
                valid: true,
                reason: "",
              },
            },
          };
        }
      });

      return {
        ...state,
        ageGroupPrices: newAgeGroupPrices,
      };
    }

    // 設置各 AgeGroupSelect 重疊與未包含的數字區間
    case ACTIONS.SET_AGE_GROUP_INTERVALS: {
      const ageGroups = state.ageGroupPrices.map((item) => item.ageGroup.value);
      return {
        ...state,
        ageGroupInterval: getNumberIntervals(
          ageGroups,
          MIN_AGE_GROUP,
          MAX_AGE_GROUP
        ),
      };
    }

    default:
      return state;
  }
};

export default ageGroupPriceReducer;

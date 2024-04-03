// reducer.js
import * as actionTypes from './actionTypes';

const initialState = {
  total: 0,
  selectedOrder: '',
  selectedSort: '',
  paginationModel: { page: 1, pageSize: 25 },
  isLoading: true,
  rows: [],
  lastError: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TOTAL:
      return { ...state, total: action.payload };
    case actionTypes.SET_ORDER:
      return { ...state, selectedOrder: action.payload };
    case actionTypes.SET_SORT:
      return { ...state, selectedSort: action.payload };
    case actionTypes.SET_PAGINATION_MODEL:
      return { ...state, paginationModel: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case actionTypes.SET_ROWS:
      return { ...state, rows: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, lastError: action.payload };
    default:
      return state;
  }
};

export default reducer;

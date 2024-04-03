import * as actionTypes from './actionTypes';

export const setTotal = (total) => ({
  type: actionTypes.SET_TOTAL,
  payload: total,
});

export const setOrder = (order) => ({
  type: actionTypes.SET_ORDER,
  payload: order,
});

export const setSort = (sort) => ({
  type: actionTypes.SET_SORT,
  payload: sort,
});

export const setPaginationModel = (paginationModel) => ({
  type: actionTypes.SET_PAGINATION_MODEL,
  payload: paginationModel,
});

export const setLoading = (isLoading) => ({
  type: actionTypes.SET_LOADING,
  payload: isLoading,
});

export const setRows = (rows) => ({
  type: actionTypes.SET_ROWS,
  payload: rows,
});

export const setError = (error) => ({
  type: actionTypes.SET_ERROR,
  payload: error,
});

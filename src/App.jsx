import { useState, useEffect } from 'react'
import './App.css'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTotal,
  setOrder,
  setSort,
  setPaginationModel,
  setLoading,
  setRows,
  setError,
} from './redux/actions.js';

export default function DataTable() {
  const dispatch = useDispatch();
  const {
    total,
    selectedOrder,
    selectedSort,
    paginationModel,
    isLoading,
    rows,
    lastError,
  } = useSelector((state) => state.data);

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'count', headerName: 'Count', width: 200 },
  ];

  const fetchNextPageData = () => {
    dispatch(setLoading(true));
    
    axios.get(`https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&page=${paginationModel.page}&pagesize=${paginationModel.pageSize}&order=${selectedOrder}&sort=${selectedSort}`)
      .then(response => {
        const newRows = response.data.items.map((element, index) => {
          return {id: index, name: element.name, count: element.count}
        })
        dispatch(setLoading(false))
        dispatch(setRows(newRows))
        dispatch(setError(null))
      })
      .catch(error => {
        dispatch(setLoading(false))
        dispatch(setError(error.message))
      });
  };

  const handlePageChange = (params) => {
    dispatch(setPaginationModel({page: params.page + 1, pageSize:  params.pageSize}))
  };

  useEffect(() => {
    fetchNextPageData()
  }, [paginationModel, selectedOrder, selectedSort])

  useEffect(() => {
    const totalURL = `https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&order=desc&sort=popular&filter=total`;
    axios.get(totalURL)
      .then(response => {
        dispatch(setTotal(response.data.total));
      })
      .then(() => {
        dispatch(setLoading(false))
        dispatch(setError(null))
        
      })
      .catch(error => {
        dispatch(setLoading(false))
        dispatch(setError(error.message))
      });
  }, [])

  const handleOrderChange = (event) => {
    dispatch(setOrder(event.target.value));
  }
  const handleSortChange = (event) => {
    dispatch(setSort(event.target.value));
  }

  const pageForTable = paginationModel.page - 1

  const selectStyle = {
    width: 150,
    height: 30,
    margin: '30px 10px 10px 10px',
    backgroundColor: '#B7E0A6',
    fontWeight: 600,
    borderRadius: '5px',
  };

  return (
    <div style={{ height: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <select value={selectedOrder} onChange={handleOrderChange} style={selectStyle}>
          <option value=''>Order</option>
          <option value='desc'>Descending</option>
          <option value='asc'>Ascending</option>
        </select>
        <select value={selectedSort} onChange={handleSortChange} style={selectStyle}>
          <option value=''>Sort</option>
          <option value='popular'>Popular</option>
          <option value='name'>Name</option>
        </select>
      </div>
      { total > 0 ?       
        <DataGrid
         rows={rows}
         columns={columns}
         pageSizeOptions={[5, 10, 25]}
         loading={isLoading}
         initialState={{pagination: {paginationModel: { pageSize: 25, page: 0 }}}}
         rowCount={total}
         paginationMode='server'
         paginationModel={{page: pageForTable, pageSize: paginationModel.pageSize}}
         onPaginationModelChange={handlePageChange}
         className="custom-data-grid"
         sx={{backgroundColor: 'white'}}
        /> : <p>Loading</p> }
        { lastError != null && 
          <p style={{ color: 'red' }}>Error occurred while fetching data: ${lastError}</p>
        }

    </div>
  );
}

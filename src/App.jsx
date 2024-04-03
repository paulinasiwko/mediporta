import { useState, useEffect } from 'react'
import './App.css'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'; // Import axios for making HTTP requests


export default function DataTable() {
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [paginationModel, setPaginationModel] = useState({page: 1, pageSize: 25})
  const [isLoading, setIsLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [lastError, setLastError] = useState(null)

  const columns = [
    { field: 'name', headerName: 'Name'},
    { field: 'count', headerName: 'Count' },
  ];

  const fetchNextPageData = () => {
    // Fetch additional data for the next page from your API
    setIsLoading(true)
    
    axios.get(`https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&page=${paginationModel.page}&pagesize=${paginationModel.pageSize}&order=${selectedOrder}&sort=${selectedSort}`)
      .then(response => {
        console.log('fetch probuje pobrac:', paginationModel)
        const newRows = response.data.items.map((element, index) => {
          return {id: index, name: element.name, count: element.count}
        })
        console.log(newRows)
        setIsLoading(false)
        setRows(newRows)
        setLastError(null)
      })
      .catch(error => {
        setIsLoading(false)
        setLastError(error.message)
      });
  };

  const handlePageChange = (params) => {
    console.log("Setting state to page:", params.page)
    setPaginationModel({page: params.page + 1, pageSize:  params.pageSize})
  };

  useEffect(() => {
    fetchNextPageData()
  }, [paginationModel])

  useEffect(() => {
    const totalURL = `https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&order=desc&sort=popular&filter=total`;
    axios.get(totalURL)
      .then(response => {
        setTotal(response.data.total);
      })
      .then(() => {
        setIsLoading(false)
        setLastError(null)
        
      })
      .catch(error => {
        setIsLoading(false)
        setLastError(error.message)
      });
  }, [])

  const handleOrderChange = (event) => {
    setSelectedOrder(event.target.value);
  }
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  }

  const pageForTable = paginationModel.page - 1
  console.log("table pass " + pageForTable)
  return (
    <div style={{ height: 400, width: '100%' }}>
      <select value={selectedOrder} onChange={handleOrderChange}>
        <option value=''>Order</option>
        <option value='desc'>desc</option>
        <option value='asc'>asc</option>
      </select>
      <select value={selectedSort} onChange={handleSortChange}>
        <option value=''>Sort</option>
        <option value='popular'>popular</option>
        <option value='name'>name</option>
      </select>
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
        /> : <p>Ładowanie</p> }
        { lastError != null && 
          <p>Error occurred while fetching data: ${lastError}</p>
        }

    </div>
  );
}




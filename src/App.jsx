import { useState, useEffect } from 'react'
import './App.css'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'; // Import axios for making HTTP requests


export default function DataTable() {
  const [total, setTotal] = useState(0);
  const [selectedPageSize, setSelectedPageSize] = useState(25); 
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [tableState, setTableState] = useState({rows: [], page: 1, isLoading: true})

  const columns = [
    { field: 'name', headerName: 'Name'},
    { field: 'count', headerName: 'Count' },
  ];

  const fetchNextPageData = (currentPage, currentPageSize) => {
    // Fetch additional data for the next page from your API
    setTableState((prev) => {return {rows: prev.rows, page: currentPage, isLoading: true}})
    setSelectedPageSize(p => currentPageSize);
    console.log('c: ', currentPage)

    axios.get(`https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&page=${currentPage}&pagesize=${currentPageSize}&order=${selectedOrder}&sort=${selectedSort}`)
      .then(response => {
        console.log('t:', tableState.page)
        const newRows = response.data.items.map((element, index) => {
          return {id: index, name: element.name, count: element.count}
        })
        setTableState((prev) => {return {rows: newRows, page: currentPage + 1, isLoading: false}});
      })
      .catch(error => {
        console.error('Error fetching next page data:', error);
        setTableState((prev) => {return {rows: prev.rows, page: prev.page, isLoading: false}})
      });
  };

  const handlePageChange = (params) => {
    fetchNextPageData(tableState.page, params.pageSize);
  };

  useEffect(() => {
    // Fetch initial data when component mounts
    fetchNextPageData(1, selectedPageSize);
  }, [selectedOrder, selectedSort]);

  useEffect(() => {
    const totalURL = `https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&order=desc&sort=popular&filter=total`;
    axios.get(totalURL)
      .then(response => {
        setTotal(response.data.total);
      })
      .then(() => {
        setTableState((prev) => {return {rows: prev.rows, page: prev.page, isLoading: false}})

      })
  }, [])

  const handleOrderChange = (event) => {
    setSelectedOrder(event.target.value);
  }
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  }

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
      {!tableState.isLoading ?       
      <DataGrid
        rows={tableState.rows}
        columns={columns}
        pageSize={selectedPageSize}
        pageSizeOptions={[5, 10, 25]}
        initialState={{pagination: {paginationModel: { pageSize: 25, page: 0 }}}}
        rowCount={total}
        paginationMode='server'
        onPaginationModelChange={handlePageChange}
      /> :
      <p>Ładowanie</p>
}
    </div>
  );
}




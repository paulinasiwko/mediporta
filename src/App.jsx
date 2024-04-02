import { useState, useEffect } from 'react'
import './App.css'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'; // Import axios for making HTTP requests


export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedPageSize, setSelectedPageSize] = useState(25); 
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { field: 'name', headerName: 'Name'},
    { field: 'count', headerName: 'Count' },
  ];

  const fetchNextPageData = (currentPage, currentPageSize) => {
    // Fetch additional data for the next page from your API
    setTableState((prev) => {return {rows: prev.rows, page: currentPage, isLoading: true}})
    setPage(p => currentPage);
    setSelectedPageSize(p => currentPageSize);
    console.log(currentPage)
    setIsLoading(prevLoading => true);

    axios.get(`https://api.stackexchange.com/2.3/tags?key=L44lhuKUbnH4H4FN4hrY6g((&site=stackoverflow&page=${currentPage}&pagesize=${currentPageSize}&order=${selectedOrder}&sort=${selectedSort}`)
      .then(response => {
        console.log(response)
        const newRows = response.data.items.map((element, index) => {
          return {id: index, name: element.name, count: element.count}
        })
        setTableState((prev) => {return {rows: newRows, page: prev.page + 1, isLoading: false}})
        setRows(p => newRows); // Append new data to the existing rows
        setPage(p => page + 1); // Update the page number
        setIsLoading(prevLoading => false);

      })
      .catch(error => {
        console.error('Error fetching next page data:', error);
        setIsLoading(prevLoading => false);
      });
  };

  const handlePageChange = (params) => {
    fetchNextPageData(params.page + 1, params.pageSize);
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
        setIsLoading(prevLoading => false);

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
      {!isLoading ?       
      <DataGrid
        rows={rows}
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




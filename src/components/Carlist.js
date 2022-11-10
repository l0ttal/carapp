import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import Button from '@mui/material/Button';

import Addcar from "./Addcar";
import Editcar from "./Editcar";
import { API_URL } from '../constants';

function Carlist() {
	const [cars, setCars] = useState([]);

	const [columnDefs] = useState([
		{
			field: 'brand',
			sortable: true,
			filter: true,
		},
		{
			field: 'model',
			sortable: true,
			filter: true,
		},
		{
			field: 'color',
			sortable: true,
			filter: true,
		},
		{
			field: 'fuel',
			sortable: true,
			filter: true,
		},
		{
			field: 'year',
			sortable: true,
			filter: true,
			width: 120,
		},
		{
			field: 'price',
			sortable: true,
			filter: true,
			width: 150,
		},
		{
			width: 120,
			cellRenderer: params => <Editcar data={params.data} updatecar={updatecar} />
		},
		{
			width: 120,
			cellRenderer: params =>
				<Button color="error" size="small" onClick={() => deleteCar(params.data)}>Delete</Button>
		},
	])

	useEffect(() => {
		getCars();
	}, []);

	const getCars = () => {
		fetch(API_URL)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					alert('Something went wrong');
				}
			})
			.then(data => setCars(data._embedded.cars))
			.catch(err => console.error(err))
	}

	const deleteCar = (data) => {
		if (window.confirm('Are you sure?')) {
			fetch(data._links.car.href, { method: 'DELETE' })
				.then(response => {
					if (response.ok) {
						getCars();
					} else {
						alert('Something went wrong with delete');
					}
				})
				.catch(err => console.error(err))
		}
	}

	const addcar = (car) => {
		fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(car),
		})
			.then(response => {
				if (response.ok) {
					getCars();
				} else {
					alert('Something went wrong with adding the car');
				}
			})
			.catch(err => console.error(err))
	}

	const updatecar = (car, url) => {
		fetch(url, {
			method: 'PUT',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(car),
		})
			.then(response => {
				if (response.ok) {
					getCars();
				} else {
					alert('Something went wrong with updating the car');
				}
			})
			.catch(err => console.error(err))
	}

	return (
		<>
			<Addcar addCar={addcar} />
			<div className="ag-theme-material" style={{ height: 620, width: '90%', margin: 'auto' }}>
				<AgGridReact rowData={cars}
					columnDefs={columnDefs}
					pagination={true}
					suppressCellFocus={true}
					paginationPageSize={10} />
			</div>
		</>
	)
}

export default Carlist;
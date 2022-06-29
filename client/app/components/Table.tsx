/* eslint-disable react/jsx-key */
import React from 'react';
import type {EndpointRequest} from '../types';
import {usePagination, useSortBy, useTable} from 'react-table';
import {GrStatusGoodSmall} from 'react-icons/gr';
import {AiOutlineArrowRight, AiOutlineArrowLeft, AiOutlineArrowUp, AiOutlineArrowDown} from 'react-icons/ai';
import clsx from 'clsx';
interface TableProps {
  items: EndpointRequest[]
}

function Table({items} : TableProps) {
	const data = React.useMemo(
		() => items,
		[items],
	);
	const columns = React.useMemo(
		() => [
			{
				Header: 'Status',
				accessor: 'status', // Accessor is the "key" in the data
			},
			{
				Header: 'Method',
				accessor: 'method',
			},
			{
				Header: 'Device',
				accessor: 'device',
			},
			{
				Header: 'Date',
				accessor: 'date',
			},
		],
		[],
	);

	const tableInstance = useTable({columns, data, initialState: {pageIndex: 0, pageSize: 5}}, useSortBy, usePagination);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		previousPage,
		pageOptions,
		nextPage,
		canNextPage,
		canPreviousPage,
		setPageSize,
		state: {pageIndex, pageSize},
	} = tableInstance;
	return (
		<div>
			<div className='mt-4 border rounded-lg'>
				<table className='w-full' {...getTableProps()}>
					<thead className='border-b-2'>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th className='font-normal p-3 ' {...column.getHeaderProps(column.getSortByToggleProps())}>
										<div className='select-none flex grow-0 justify-center items-center w-full'>
											{column.render('Header')}
											{column.isSorted
												? column.isSortedDesc ? <AiOutlineArrowDown/> : <AiOutlineArrowUp/> : '' }
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map(row => {
							prepareRow(row);
							return (
								<tr className='border' {...row.getRowProps()}>
									{row.cells.map(cell =>
										cell.column.Header === 'Status' ? (
											<td className='flex text-center font-semibold text-slate-600 flex-row justify-center items-center pt-2 pb-2' {...cell.getCellProps()}>
												<GrStatusGoodSmall className={clsx('mr-2', row.original.matching ? 'text-green-400' : 'text-red-400')}/>

												{cell.render('Cell')}
											</td>)
											: <td className='text-center font-semibold text-slate-600' {...cell.getCellProps()}>
												{cell.render('Cell')}
											</td>,
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
				<div className='flex items-center justify-end p-3 px-8'>
					<div className='mr-4'>
						<span className='mr-1'>
            Show
						</span>
						<select className='bg-white bg-clip-padding px-2 text-center py-1 bg-no-repeat transition ease-in-out appearance-none form-select border rounded       focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none' onChange={e => {
							setPageSize(Number(e.target.value));
						}} value={pageSize} name='pageSize'>
							{[5, 10, 15, 20].map(size =>
								<option className='flex text-center' key={size} value={size}>
									{size}
								</option>,
							)}
						</select>
					</div>
					<div className='flex items-center mr-4'>
						<button onClick={previousPage} className='mr-1' disabled={!canPreviousPage}><AiOutlineArrowLeft className={clsx(!canPreviousPage && 'text-gray-400')} /></button>
						<button onClick={nextPage} className='ml-1' disabled={!canNextPage}><AiOutlineArrowRight className={clsx(!canNextPage && 'text-gray-400')}/></button>
					</div>
					<span>Page {pageIndex + 1} of {pageOptions.length ? pageOptions.length : 1} </span>
				</div>
			</div>
		</div>
	);
}

export default Table;

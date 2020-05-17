import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import Actions from 'components/Actions';
import { getGoals } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const Goals = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalGoals, setTotalGoals] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		getGoals(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalGoals(result);
				additional.totalItemCount = pagination.totalRecord;
				additional.selectedPageSize = pagination.limit;
				additional.totalPage = pagination.totalPage;
				setPageInfo({ ...additional });
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(
						data.error_message,
						'Something went wrong',
						3000,
						null,
						null,
						''
					);
				}
			});
	}, [selectedPageSize, currentPage, searchText]);
	const onSearchKey = (event) => {
		setSearchtext(event.target.value);
	};
	const changePageSize = (value) => {
		setIsLoading(true);
		setSelectedPageSize(value);
	};
	const onChangePage = (value) => {
		setCurrentPage(value);
	};
	const DeleteDataLocal = (key) => {
		totalGoals.splice(key, 1);
		setTotalGoals([...totalGoals]);
	};
	const updateLocal = (value, key) => {
		totalGoals[key] = value;
		setTotalGoals([...totalGoals]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Goals'
				addShow
				Addname='+ Add New Goal'
				onClick={() => history.push('/add-goal')}
				changePageSize={changePageSize}
				selectedPageSize={selectedPageSize}
				totalItemCount={pageInfo.totalItemCount}
				startIndex={startIndex}
				endIndex={endIndex}
				onSearchKey={onSearchKey}
				orderOptions={pageInfo.orderOptions}
				pageSizes={pageInfo.pageSizes}
			/>
			<table className='table table-striped'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Category Name</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalGoals.map((goal, key) => (
						<>
							<tr key={key}>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-goal',
											state: { goal },
										}}
										className='d-flex'
									>
										{' '}
										{goal.name}
									</Link>
								</td>

								<td>{goal.category_name}</td>
								<td>
									<StatusUpdate
										table='goals'
										onUpdate={(data) => updateLocal(data, key)}
										data={goal}
									/>
								</td>
								<td>{convertDate(goal.created)}</td>
								<td>
									<Actions
										key={key}
										isView={false}
										isEdit={true}
										table='goals'
										view='Goal'
										onDelete={DeleteDataLocal}
										data={goal}
										editPath='/edit-goal'
										name='goal'
									/>
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default Goals;

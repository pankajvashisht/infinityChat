import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import Actions from 'components/Actions';
import ImagePreView from 'components/PerviewImage/ModalView';
import { getArticle } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const Articles = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalArticles, setTotalArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	const [viewImage, setViewImage] = useState(false);
	const [imagePath, setImagePath] = useState('');
	useEffect(() => {
		getArticle(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalArticles(result);
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
		totalArticles.splice(key, 1);
		setTotalArticles([...totalArticles]);
	};
	const updateLocal = (value, key) => {
		totalArticles[key] = value;
		setTotalArticles([...totalArticles]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Article'
				addShow
				Addname='+ Add New Articles'
				onClick={() => history.push('/add-article')}
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
						<th>Image</th>
						<th>Category Name</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalArticles.map((article, key) => (
						<>
							<tr key={key}>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-article',
											state: { article },
										}}
										className='d-flex'
									>
										{' '}
										{article.name}
									</Link>
								</td>
								<td>
									<img
										onClick={() => {
											setImagePath(article.image || '/assets/img/logo.jpeg');
											setViewImage(true);
										}}
										alt={article.name}
										src={article.image || '/assets/img/logo.jpeg'}
										className='list-thumbnail responsive border-0 card-img-left'
									/>
								</td>
								<td>{article.category_name}</td>
								<td>
									<StatusUpdate
										table='articles'
										onUpdate={(data) => updateLocal(data, key)}
										data={article}
									/>
								</td>
								<td>{convertDate(article.created)}</td>
								<td>
									<Actions
										key={key}
										isView={false}
										isEdit={true}
										table='articles'
										view='Article'
										onDelete={DeleteDataLocal}
										data={article}
										editPath='/edit-article'
										name='article'
									/>
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
			<ImagePreView
				imagePath={imagePath}
				showModel={viewImage}
				onClose={(value) => setViewImage(value)}
			/>
			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default Articles;

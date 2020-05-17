import React, { Fragment, useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import GradientWithRadialProgressCard from 'components/cards/GradientWithRadialProgressCard';
import { dashBoard } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
const DefaultDashboard = React.memo(() => {
	const [dashBoardData, setDashboardData] = useState({
		total_users: 0,
		total_categories: 0,
		total_articles: 0,
		total_goals: 0,
	});
	useEffect(() => {
		dashBoard()
			.then((res) => {
				const { data } = res;
				updateData(data.data);
			})
			.catch((err) => {
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
	}, []);
	const updateData = (data) => {
		setDashboardData({ ...data });
	};
	return (
		<Fragment>
			<Row>
				<Colxx xxs='12'>
					<h1>Dashboard</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row>
				<Colxx lg='12' md='12'>
					<Row>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/users'>
								<GradientWithRadialProgressCard
									icon='iconsminds-male'
									title={`${dashBoardData.total_users} Users`}
									detail=''
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/categories'>
								<GradientWithRadialProgressCard
									icon='simple-icon-direction'
									title={`${dashBoardData.total_categories} Categories`}
									detail={``}
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/articles'>
								<GradientWithRadialProgressCard
									icon='iconsminds-files'
									title={`${dashBoardData.total_articles} Articles`}
									detail={``}
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'></Colxx>
						<Colxx lg='4' xl='4' className='mb-4'>
							<NavLink to='/goals'>
								<GradientWithRadialProgressCard
									icon='simple-icon-clock'
									title={`${dashBoardData.total_goals} Goals`}
									detail={``}
								/>
							</NavLink>
						</Colxx>
						<Colxx lg='4' xl='4' className='mb-4'></Colxx>
					</Row>
				</Colxx>
			</Row>
		</Fragment>
	);
});
export default injectIntl(DefaultDashboard);

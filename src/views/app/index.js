import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Default = React.lazy(() => import(/* webpackChunkName: "dashboards" */ './dashboards/default'));
const Users = React.lazy(() => import(/* webpackChunkName: "users" */ './users'));
const Listener = React.lazy(() => import(/* webpackChunkName: "users" */ './listener'));
const Push = React.lazy(() => import(/* webpackChunkName: "add class" */ './push'));
const UserDetails = React.lazy(() => import(/* webpackChunkName: "user Details" */ './userDetails'));
const AppInformation = React.lazy(() => import(/* webpackChunkName: "app-info" */ './AppInformations'));
const AddUser = React.lazy(() => import(/* webpackChunkName: "add-shop" */ './Users/AddUser'));
const AddListener = React.lazy(() => import(/* webpackChunkName: "add-shop" */ './Listener/AddListener'));
const Profile = React.lazy(() => import(/* webpackChunkName: "add-shop" */ './profile'));
class App extends Component {
	render() {
		return (
			<AppLayout>
				<div className="dashboard-wrapper">
					<Suspense fallback={<div className="loading" />}>
						<Switch>
							<Redirect exact from={`/`} to={`/dashboards`} />
							<Route exact path={`/dashboards`} render={(props) => <Default {...props} />} />
							<Route path={`/users`} render={(props) => <Users {...props} />} />
							<Route path={`/listener`} render={(props) => <Listener {...props} />} />
							<Route path={`/push`} render={(props) => <Push {...props} />} />
							<Route path={`/user-details`} render={(props) => <UserDetails {...props} />} />
							<Route path={`/add-user`} component={AddUser} />} />
							<Route path={`/add-listener`} component={AddListener} />} />
							<Route path={`/profile`} component={Profile} />} />
							<Route path={`/app-information`} render={(props) => <AppInformation {...props} />} />
							<Redirect to="/error" />
						</Switch>
					</Suspense>
				</div>
			</AppLayout>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames } = menu;
	return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));

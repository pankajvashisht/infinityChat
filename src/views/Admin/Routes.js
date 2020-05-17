import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from 'layout/AppLayout';

const Default = React.lazy(() =>
	import(/* webpackChunkName: "dashboards" */ './dashboards/default')
);
const Users = React.lazy(() =>
	import(/* webpackChunkName: "users" */ './users')
);
const Push = React.lazy(() =>
	import(/* webpackChunkName: "add class" */ './push')
);
const UserDetails = React.lazy(() =>
	import(/* webpackChunkName: "user Details" */ './userDetails')
);
const AppInformation = React.lazy(() =>
	import(/* webpackChunkName: "app-info" */ './AppInformations')
);
const AddUser = React.lazy(() =>
	import(/* webpackChunkName: "add-users" */ './Users/AddUser')
);
const EditUser = React.lazy(() =>
	import(/* webpackChunkName: "edit-group" */ './Users/EditUser')
);
const AddCategory = React.lazy(() =>
	import(/* webpackChunkName: "add-category" */ './Category/AddCategory')
);
const EditCategory = React.lazy(() =>
	import(/* webpackChunkName: "edit-category" */ './Category/EditCategory')
);
const Category = React.lazy(() =>
	import(/* webpackChunkName: "category-listing" */ './Category')
);

const AddArticle = React.lazy(() =>
	import(/* webpackChunkName: "add-article" */ './Article/AddArticle')
);
const EditArticle = React.lazy(() =>
	import(/* webpackChunkName: "edit-article" */ './Article/EditArticle')
);
const Article = React.lazy(() =>
	import(/* webpackChunkName: "article-listing" */ './Article')
);

const AddGoal = React.lazy(() =>
	import(/* webpackChunkName: "add-goal" */ './Goals/AddGoal')
);
const EditGoal = React.lazy(() =>
	import(/* webpackChunkName: "edit-goal" */ './Goals/EditGoal')
);
const Goals = React.lazy(() =>
	import(/* webpackChunkName: "goal-listing" */ './Goals')
);
const Profile = React.lazy(() =>
	import(/* webpackChunkName: "admin-profile" */ './profile')
);
class App extends Component {
	render() {
		return (
			<AppLayout>
				<div className='dashboard-wrapper'>
					<Suspense fallback={<div className='loading' />}>
						<Switch>
							<Redirect exact from={`/`} to={`/dashboards`} />
							<Route
								exact
								path='/dashboards'
								render={(props) => <Default {...props} />}
							/>
							<Route path='/users' render={(props) => <Users {...props} />} />
							<Route path='/push' render={(props) => <Push {...props} />} />
							<Route
								path={`/user-details`}
								render={(props) => <UserDetails {...props} />}
							/>
							<Route path='/add-user' component={AddUser} />} />
							<Route path='/edit-user' component={EditUser} />} />
							<Route path='/add-category' component={AddCategory} />} />
							<Route path='/edit-category' component={EditCategory} />} />
							<Route path='/categories' component={Category} />} />
							<Route path='/add-article' component={AddArticle} />} />
							<Route path='/edit-article' component={EditArticle} />} />
							<Route path='/articles' component={Article} />} />
							<Route path='/add-goal' component={AddGoal} />} />
							<Route path='/edit-goal' component={EditGoal} />} />
							<Route path='/goals' component={Goals} />} />
							<Route path='/profile' component={Profile} />} />
							<Route
								path='/app-information'
								render={(props) => <AppInformation {...props} />}
							/>
							<Redirect to='/error' />
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

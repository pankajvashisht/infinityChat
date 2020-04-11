import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { addGroup } from 'Apis/admin';
import { initialState } from './Constants';
import AddGroupFORM from 'containers/Group';
import Loading from 'components/Loading';
import { NotificationManager } from 'components/common/react-notifications';
const AddGroup = React.memo(() => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const [userForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const addGroups = (event) => {
		event.preventDefault();
		setIsLoading(true);
		addGroup(userForm)
			.then(() => {
				setRedirect(true);
				NotificationManager.success(
					'Private Group add successfully',
					'Success',
					3000,
					null,
					null,
					''
				);
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
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleInput = (key, value) => {
		dispatch({ key, value });
	};

	if (redirect) {
		return <Redirect to='/private-groups' />;
	}
	return (
		<Fragment>
			<Row>
				<Colxx xxs='12'>
					<h1>Add Group</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Add Group</CardTitle>
							<Loading loading={loading} />
							<AddGroupFORM
								onSubmit={addGroups}
								handleInput={handleInput}
								userForm={userForm}
								loading={loading}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddGroup;

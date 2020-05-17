import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { addGoals } from 'Apis/admin';
import { initialState } from './Constants';
import Goals from 'containers/forms/Goals';
import { NotificationManager } from 'components/common/react-notifications';
const AddGoal = React.memo(({ history }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const [goalForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addNewGoal = (event) => {
		event.preventDefault();
		setIsLoading(true);
		addGoals(goalForm)
			.then(() => {
				history.push('/goals');
				NotificationManager.success(
					'Goals added successfully',
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
	return (
		<Fragment>
			<Row>
				<Colxx xxs='12'>
					<h1>Add Goal</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Add Goal</CardTitle>
							<Goals
								onSubmit={addNewGoal}
								loading={loading}
								goalForm={goalForm}
								handleInput={handleInput}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddGoal;

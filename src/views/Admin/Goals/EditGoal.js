import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { editGoals } from 'Apis/admin';
import Goals from 'containers/forms/Goals';
import { NotificationManager } from 'components/common/react-notifications';
const EditGoal = React.memo(({ history, location }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const initialState = { ...location.state.goal };
	const [goalForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const updateGoal = (event) => {
		event.preventDefault();
		setIsLoading(true);
		editGoals(goalForm)
			.then(() => {
				history.push('/goals');
				NotificationManager.success(
					'Goal Edit successfully',
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
					<h1>Edit Goal ({goalForm.name})</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Edit Goal</CardTitle>
							<Goals
								onSubmit={updateGoal}
								loading={loading}
								isEdit
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

export default EditGoal;

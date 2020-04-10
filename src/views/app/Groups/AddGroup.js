import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import {
	Row,
	Card,
	CardBody,
	Input,
	CardTitle,
	FormGroup,
	Label,
	Button,
	Form,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { addGroup } from '../../../Apis/admin';
import { initialState } from './Constants';
import { NotificationManager } from '../../../components/common/react-notifications';
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
							<Form onSubmit={addGroups}>
								<FormGroup row>
									<Colxx sm={6}>
										<FormGroup>
											<Label for='exampleEmailGrid'>Name</Label>
											<Input
												type='text'
												required={true}
												value={userForm.name}
												onChange={({ target }) =>
													handleInput('name', target.value)
												}
												name='name'
												placeholder='Name'
											/>
										</FormGroup>
									</Colxx>
									<Colxx sm={6}>
										<FormGroup>
											<Label for='examplePasswordGrid'>Group Image</Label>
											<Input
												type='file'
												onChange={({ target }) =>
													handleInput('profile', target.files[0])
												}
												name='profile'
												placeholder=''
											/>
										</FormGroup>
									</Colxx>
									<Colxx sm={12}>
										<FormGroup>
											<Label for='examplePasswordGrid'>Description</Label>
											<Input
												type='teaxtarea'
												onChange={({ target: { value } }) =>
													handleInput('descriptions', value)
												}
												name='descriptions'
												placeholder='descriptions'
											/>
										</FormGroup>
									</Colxx>
								</FormGroup>

								<Button
									disabled={loading}
									type='submit'
									className={`btn-shadow btn-multiple-state ${
										loading ? 'show-spinner' : ''
									}`}
									color='primary'
								>
									Save
								</Button>
							</Form>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddGroup;

import React, { useState } from 'react';
import propTypes from 'prop-types';
import PerviewImage from 'components/PerviewImage';
import { Colxx } from 'components/common/CustomBootstrap';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
const UserForm = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	userForm,
}) => {
	const [viweImage, setViewImage] = useState('');
	return (
		<>
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Name</Label>
							<Input
								type='text'
								required={true}
								value={userForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Password</Label>
							<Input
								type='password'
								required={isEdit ? false : true}
								value={userForm.password}
								onChange={({ target }) => handleInput('password', target.value)}
								name='password'
								placeholder='Password'
							/>
						</FormGroup>
					</Colxx>

					<Colxx sm={6}>
						<FormGroup>
							<Label for='examplePasswordGrid'>Email</Label>
							<Input
								type='email'
								required={true}
								value={userForm.email}
								onChange={({ target }) => handleInput('email', target.value)}
								name='email'
								placeholder='Email'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='examplePasswordGrid'>Phone</Label>
							<Input
								type='number'
								required={true}
								value={userForm.phone}
								onChange={({ target }) => handleInput('phone', target.value)}
								name='phone'
								placeholder='Phone'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='examplePasswordGrid'>Profile</Label>
							<Input
								type='file'
								onChange={({ target }) => {
									handleInput('profile', target.files[0]);
									setViewImage(URL.createObjectURL(target.files[0]));
								}}
								name='profile'
								placeholder=''
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<PerviewImage imageUrl={viweImage} />
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
		</>
	);
};
UserForm.prototype = {
	onSubmit: propTypes.func.isRequired,
	userForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default UserForm;

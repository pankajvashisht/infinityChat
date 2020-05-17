import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import ReactQuill from 'react-quill';
import PerviewImage from 'components/PerviewImage';
import { Colxx } from 'components/common/CustomBootstrap';
import Loading from 'components/Loading';
import Select from 'components/Select';
import { getCategory } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import 'react-quill/dist/quill.snow.css';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
const quillModules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image'],
		['clean'],
	],
};
const AddArticle = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	ArticleForm,
}) => {
	const [viweImage, setViewImage] = useState(isEdit ? ArticleForm.image : '');
	const [category, setCategory] = useState([]);
	useEffect(() => {
		getCategory(1, 100, '')
			.then((res) => {
				const { data } = res;
				const { result } = data.data;
				updateArray(result);
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

	const updateArray = (result) => {
		const categories = result.map((value) => {
			return {
				key: value.id,
				name: value.name,
			};
		});
		setCategory(categories);
	};
	return (
		<>
			<Loading loading={loading} />
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Name</Label>
							<Input
								type='text'
								required={true}
								value={ArticleForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Select Category</Label>
							<Select
								required={true}
								selected={ArticleForm.category_id}
								options={category}
								onChange={({ target }) =>
									handleInput('category_id', target.value)
								}
								name='category_id'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='examplePasswordGrid'>Image</Label>
							<Input
								className='form-control'
								type='file'
								onChange={({ target }) => {
									handleInput('image', target.files[0]);
									setViewImage(URL.createObjectURL(target.files[0]));
								}}
								name='profile'
								required={isEdit ? false : true}
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<PerviewImage imageUrl={viweImage} />
					</Colxx>
					<Colxx sm={12}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Description</Label>
							<ReactQuill
								toolbar={quillModules}
								value={ArticleForm.description || ''}
								onChange={(value) => handleInput('description', value)}
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
					{isEdit ? 'Update' : 'Save'}
				</Button>
			</Form>
		</>
	);
};
AddArticle.prototype = {
	onSubmit: propTypes.func.isRequired,
	ArticleForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default AddArticle;

import axios from '../utils/handleAxios';

export const Adminlogin = ({ email, password }) => {
	return axios.post(`/login`, {
		email,
		password,
	});
};

export const dashBoard = () => {
	return axios.get(`/dashboard`);
};
export const users = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/users/${page}/${limit}?q=${q}`);
};

export const privateGroup = (type, page = 1, limit = 10, q = undefined) => {
	return axios.get(`/groups/${page}/${limit}?q=${q}&group_type=${type}`);
};

export const sendPush = (data) => {
	return axios.post(`/send-push`, data);
};
export const appInfo = () => {
	return axios.get(`/appInfo`);
};
export const updateAppInfo = (data) => {
	return axios.put(`/appInfo`, data);
};
export const addUser = (data) => {
	const form = new FormData();
	form.append('name', data.name);
	form.append('email', data.email);
	form.append('password', data.password);
	form.append('profile', data.profile);
	form.append('phone', data.phone);
	form.append('status', 1);
	return axios.post(`/users`, form);
};

export const editGroup = (data) => {
	const form = new FormData();
	form.append('id', data.id);
	form.append('name', data.name);
	form.append('image', data.profile);
	form.append('descriptions', data.descriptions);
	return axios.post(`/groups`, form);
};

export const editUserData = (data) => {
	const form = new FormData();
	form.append('id', data.id);
	form.append('name', data.name);
	form.append('email', data.email);
	form.append('password', data.password);
	form.append('profile', data.profile);
	form.append('phone', data.phone);
	return axios.put(`/edit-user`, form);
};

export const addGroup = (data) => {
	const form = new FormData();
	form.append('name', data.name);
	form.append('image', data.profile);
	form.append('descriptions', data.descriptions);
	form.append('group_type', 1);
	form.append('status', 1);
	return axios.post(`/groups`, form);
};

export const updateProfile = (data) => {
	const form = new FormData();
	form.append('first_name', data.first_name);
	form.append('last_name', data.last_name);
	form.append('password', data.password);
	form.append('email', data.email);
	form.append('token', data.token);
	form.append('profile', data.image);
	form.append('id', data.id);
	return axios.post(`/admin-profile`, form);
};

export const updateUser = (data) => {
	return axios.put(`/users?`, data);
};

export const deleteUser = (data) => {
	return axios.delete(
		`/users`,
		{ data },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);
};

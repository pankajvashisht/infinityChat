import axios from '../utils/handleAxios';

export const Adminlogin = ({ email, password }) => {
	return axios.post(`/login`, {
		email,
		password
	});
};

export const dashBoard = () => {
	return axios.get(`/dashboard`);
};
export const users = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/users/${page}/${limit}?q=${q}`);
};

export const listener = (page = 1, limit = 10, q = undefined) => {
	return axios.get(`/listener/${page}/${limit}?q=${q}`);
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
	form.append('profile', data.profile);
	form.append('description', data.description);
	form.append('status', 1);
	form.append('user_type', data.user_type);
	return axios.post(`/users`, form);
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
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
};

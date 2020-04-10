import React from 'react';
import PropTypes from 'prop-types';
import { updateUser } from '../Apis/admin';

const StatusUpdate = ({ table, data, onUpdate, updateKey = 'status', statusMessage }) => {
	console.log(updateKey, data[updateKey]);
	const statusCheck = (status) => {
		return status === 1 ? 'badge badge-pill badge-success' : 'badge badge-pill badge-danger';
	};
	const text = (status) => {
		return statusMessage[status];
	};

	const updateStatus = () => {
		if (data[updateKey]) {
			data[updateKey] = 0;
		} else {
			data[updateKey] = 1;
		}
		updateUser({ table, [updateKey]: data[updateKey], id: data.id })
			.then((info) => {
				onUpdate(data);
			})
			.catch((err) => {});
	};

	return (
		<span style={{ cursor: 'pointer' }} onClick={updateStatus} className={statusCheck(data[updateKey])}>
			{text(data[updateKey])}
		</span>
	);
};

StatusUpdate.propTypes = {
	table: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	statusMessage: PropTypes.object
};

StatusUpdate.defaultProps = {
	type: 'button',
	disabled: null,
	classes: 'badge badge-success',
	statusMessage: {
		1: 'Active',
		0: 'Deactive'
	}
};

export default StatusUpdate;

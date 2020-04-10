import React, { Fragment, useState } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import StatusUpdate from '../../components/UpdateStatus'
const UserDetails = (props) => {
	const statusMessage = {
		1: 'Approved',
		0: 'Rejected'
	};
	const [ userDetails, setUserDetails ] = useState({ ...props.location.state.post });
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h1 style={{ paddingTop: '31px' }}> User Details </h1>
				</CardHeader>
			</Card>
			<CardBody>
				<div>
					<b> Name </b> : {userDetails.name}
				</div>
				<hr />

				<div>
					<b> Email </b> : {userDetails.email}
				</div>
				<hr />
				<div>
					<b> Description </b> : {userDetails.description}
				</div>
				{userDetails.profile && (
					<>
						<hr />
						<div>
						<b> Profile </b> : <img className="img-doc" height="50" width="50" src={userDetails.profile} alt="check" />
						</div>
					</>
				)}
				<hr />
				{userDetails.document && (
					<>
						<div>
							<b> Approved </b> : -  &nbsp;
						<StatusUpdate statusMessage={statusMessage} table="users"
											table="users"
											onUpdate={(data) => setUserDetails({...userDetails, ...data})}
											data={userDetails}	
											updateKey="doucment_request"/>
					</div>
					<hr />
					<div>
						<b> View Doucment </b> : <img className="img-doc" src={userDetails.document} alt="check" />
						</div>
						</>
				)}
			</CardBody>
		</Fragment>
	);
};

export default UserDetails;

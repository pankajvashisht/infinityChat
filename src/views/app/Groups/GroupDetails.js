import React, { Fragment, useState } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
const GroupDetails = (props) => {
	const [postDetail] = useState({
		...props.location.state.post,
	});
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h1 style={{ paddingTop: '31px' }}> Group Details </h1>
				</CardHeader>
			</Card>
			<CardBody>
				<div>
					<b> Name </b> : {postDetail.name}
				</div>
				<hr />
				<div>
					<b> Description </b> : {postDetail.description}
				</div>
				{postDetail.image && (
					<>
						<hr />
						<div>
							<b> Group Image </b> :{' '}
							<img
								className='img-doc'
								height='50'
								width='50'
								src={postDetail.image}
								alt='check'
							/>
						</div>
					</>
				)}
				<hr />
			</CardBody>
		</Fragment>
	);
};

export default GroupDetails;

const { vaildation } = require('../../utils/DataValidation');
const app = require('../../libary/CommanMethod');
module.exports = async (Request, res, next) => {
	const requried = {
		name: Request.body.name,
		email: Request.body.email,
		user_type: Request.body.user_type,
		password: Request.body.password,
		checkexist: 1
	};
	const non_required = {
		device_type: Request.body.device_type,
		device_token: Request.body.device_token,
		description: Request.body.description,
		authorization_key: app.createToken(),
		otp: 1111 //app.randomNumber(),
	};
	try {
		Request.RequestData = await vaildation(requried, non_required);
		next();
	} catch (err) {
		return app.error(res, err);
	}
};

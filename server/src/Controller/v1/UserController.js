const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const { lang } = require('../../../config');
const DB = new Db();

class UserController extends ApiController {
	constructor() {
		super();
		this.addUser = this.addUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
	}

	async addUser(Request) {
		const { RequestData } = Request;
		if (Request.files && Request.files.profile) {
			RequestData.profile = await app.upload_pic_with_await(Request.files.profile);
		}
		if (Request.files && Request.files.document) {
			RequestData.document = await app.upload_pic_with_await(Request.files.document);
		}
		await DB.save('users', RequestData);
		RequestData.lang = Request.lang;
		setTimeout(() => {
			this.mails(RequestData);
		}, 100);
		return {
			message: lang[Request.lang].signup,
			data: {
				authorization_key: RequestData.authorization_key
			}
		};
	}
	async verifyOtp(req) {
		let required = {
			otp: req.body.otp
		};
		let non_required = {};
		let request_data = await super.vaildation(required, non_required);
		if (parseInt(request_data.otp) !== req.body.userInfo.otp) {
			throw new ApiError(lang[req.lang].invaildOtp);
		}
		req.body.userInfo.status = 1;
		await DB.save('users', req.body.userInfo);
		const usersInfo = await super.userDetails(req.body.userInfo.id);
		if (usersInfo.profile.length > 0) {
			usersInfo.profile = appURL + 'uploads/' + usersInfo.profile;
		}
		return {
			message: lang[req.lang].verifyOtp,
			data: usersInfo
		};
	}

	async soicalLogin(req) {
		const required = {
			social_id: req.body.social_id,
			social_token: req.body.social_token,
			soical_type: req.body.soical_type
		};
		const non_required = {
			device_type: req.body.device_type,
			device_token: req.body.device_token,
			username: req.body.username,
			phone: req.body.phone,
			email: req.body.email,
			status: 1,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			address: req.body.address,
			dob: req.body.dob,
			start_time_call: req.body.start_time_call,
			end_time_call: req.body.end_time_call,
			centre: req.body.centre,
			authorization_key: app.createToken()
		};

		let request_data = await super.vaildation(required, non_required);
		let soical_id = await DB.find('users', 'first', {
			conditions: {
				or: {
					email: request_data.email,
					social_id: request_data.social_id
				}
			},
			fields: [ 'id' ]
		});
		if (soical_id) {
			request_data.id = soical_id.id;
		}
		const id = await DB.save('users', request_data);
		const userInfo = await super.userDetails(id);
		if (userInfo.profile.length > 0) {
			userInfo.profile = appURL + 'uploads/' + userInfo.profile;
		}
		return {
			message: 'User login successfully',
			data: userInfo
		};
	}

	async forgotPassword(req) {
		let required = {
			email: req.body.email,
			otp: app.randomNumber()
		};
		let non_required = {};
		let request_data = await super.vaildation(required, non_required);
		let user_info = await DB.find('users', 'first', {
			conditions: {
				email: request_data.email
			},
			fields: [ 'id', 'email', 'name' ]
		});
		if (!user_info) throw new ApiError(lang[req.lang].mailNotFound);
		user_info.otp = request_data.otp;
		user_info.forgot_password_hash = app.createToken();
		await DB.save('users', user_info);
		let mail = {
			to: request_data.email,
			subject: 'Forgot Password',
			template: 'forgot_password',
			data: {
				first_name: user_info.name,
				last_name: user_info.name,
				url: appURL + 'users/change_password/' + user_info.forgot_password_hash
			}
		};
		setTimeout(() => {
			app.send_mail(mail);
		}, 100);
		return {
			message: lang[req.lang].otpSend,
			data: []
		};
	}

	async loginUser(req) {
		const required = {
			email: req.body.email,
			password: req.body.password
		};
		const non_required = {
			device_type: req.body.device_type || 0,
			device_token: req.body.device_token || '',
			last_login: app.currentTime,
			authorization_key: app.createToken()
		};

		let request_data = await super.vaildation(required, non_required);
		let login_details = await DB.find('users', 'first', {
			conditions: {
				email: request_data.email,
				status: 1,
			},
			fields: [ 'id', 'password', 'status', 'email' ]
		});
		if (login_details) {
			if (request_data.password !== login_details.password) throw new ApiError(lang[req.lang].wrongLogin);
			delete login_details.password;
			request_data.id = login_details.id;
			await DB.save('users', request_data);
			login_details.authorization_key = request_data.authorization_key;
			login_details = await super.userDetails(login_details.id);
			if (login_details.profile.length > 0) {
				login_details.profile = appURL + 'uploads/' + login_details.profile;
			}
			return {
				message: lang[req.lang].LoginMessage,
				data: login_details
			};
		}
		throw new ApiError(lang[req.lang].wrongLogin);
	}

	async userListing(Request) {
		const user_id = Request.body.user_id || 0;
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		const search = Request.query.search || '';
		const userType = Request.query.user_type || Request.body.userInfo.doucment_request;
		const verify = Request.query.verify || 2;
		const page = parseInt(offset);
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				status: 1,
				NotEqual: {
					id: user_id
				}
			},
			fields: [
				'users.id',
				'name',
				'status',
				'email',
				'cover_pic',
				'about_us',
				'description',
				'user_type',
				'document',
				'doucment_request',
				'profile'
			],
			limit: [ offset, limit ],
			orderBy: [ 'users.name asc' ]
		};
		if (parseInt(userType) === 0) {
			condition.conditions['user_type'] = 1;
		}
		if (parseInt(verify) !== 2) {
			condition.conditions['doucment_request'] = verify;
		}
		if (search) {
			condition.conditions['like'] = {
				name: search,
				email: search
			};
		}
		const user_info = await DB.find('users', 'all', condition);
		const message = 'user listing';
		return {
			message,
			data: {
				pagination: await super.Paginations('users', condition, page, limit),
				result: app.addUrl(user_info, [ 'profile', 'cover_pic', 'document' ])
			}
		};
	}

	async appInfo() {
		const app_info = await DB.find('app_informations', 'all');
		return {
			message: 'App Informations',
			data: app_info
		};
	}
	documentInfo(Request) { 
		return {
			message: 'Document status',
			data: Request.body.userInfo.doucment_request
		};
	}
	async changePassword(req) {
		let required = {
			old_password: req.body.old_password,
			new_password: req.body.new_password
		};
		let request_data = await super.vaildation(required, {});
		const loginInfo = req.body.userInfo;
		if (loginInfo.password !== request_data.old_password) {
			throw new ApiError(lang[req.lang].oldPassword);
		}
		loginInfo.password = request_data.new_password;
		await DB.save('users', loginInfo);
		return {
			message: 'Password change Successfully',
			data: []
		};
	}
	async updateProfile(req) {
		const required = {
			id: req.body.user_id
		};
		const non_required = {
			name: req.body.name,
			description: req.body.description
		};
		const request_data = await super.vaildation(required, non_required);
		if (req.files && req.files.profile) {
			request_data.profile = await app.upload_pic_with_await(req.files.profile);
		}
		if (req.files && req.files.document) {
			req.document = await app.upload_pic_with_await(req.files.document);
		}
		await DB.save('users', request_data);
		const usersinfo = await super.userDetails(request_data.id);
		if (usersinfo.profile.length > 0) {
			usersinfo.profile = appURL + 'uploads/' + usersinfo.profile;
		}
		return {
			message: 'Profile updated successfully',
			data: usersinfo
		};
	}

	async logout(req) {
		let required = {
			id: req.body.user_id
		};
		let request_data = await super.vaildation(required, {});
		request_data.authorization_key = '';
		request_data.device_token = '';
		await DB.save('users', request_data);
		return {
			message: 'User Logout successfully',
			data: []
		};
	}
	mails(request_data) {
		let mail = {
			to: request_data.email,
			subject: 'User Account Verification',
			template: 'user_signup',
			data: {
				first_name: request_data.name,
				last_name: request_data.name,
				url: appURL + 'users/verify/' + request_data.authorization_key
			}
		};
		try {
			app.send_mail(mail);
			return true;
		} catch (error) {
			//
		}
	}
}

module.exports = UserController;

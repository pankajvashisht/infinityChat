const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
const ApiError = require('../../Exceptions/ApiError');
let DB = new Db();
const ApiController = require('./ApiController');
class adminController extends ApiController {
	constructor() {
		super();
		this.limit = 20;
		this.offset = 1;
		this.login = this.login.bind(this);
		this.allUser = this.allUser.bind(this);
	}
	async login(req, res) {
		const { body } = req;
		try {
			let login_details = await DB.find('admins', 'first', {
				conditions: {
					email: body.email,
					status: 1,
				},
			});
			if (login_details) {
				if (app.createHash(body.password) !== login_details.password)
					throw new ApiError('Wrong Email or password');
				delete login_details.password;
				let token = await app.UserToken(login_details.id, req);
				await DB.save('admins', {
					id: login_details.id,
					token: token,
				});
				login_details.token = token;
				if (login_details.profile) {
					login_details.profile = app.ImageUrl(login_details.profile);
				}
				return app.success(res, {
					message: 'User login successfully',
					data: login_details,
				});
			}
			throw new ApiError('Wrong Email or password');
		} catch (err) {
			app.error(res, err);
		}
	}
	async allUser(req) {
		let offset = req.params.offset || 1;
		const limit = req.params.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (req.query.q && req.query.q !== 'undefined') {
			const { q } = req.query;
			conditions += ` where name like '%${q}%'  or email like '%${q}%'`;
		}
		const query = `select * from users ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from users ${conditions}`;
		const result = {
			pagination: await super.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), ['profile']),
		};
		return result;
	}
	async allListener(req) {
		let offset = req.params.offset || 1;
		const limit = req.params.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = 'where user_type = 1 ';
		if (req.query.q && req.query.q !== 'undefined') {
			const { q } = req.query;
			conditions += ` and name like '%${q}%'  or email like '%${q}%'`;
		}
		const query = `select * from users ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from users ${conditions}`;
		const result = {
			pagination: await super.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), ['profile', 'document']),
		};
		return result;
	}
	async addUser(Request) {
		const { body } = Request;
		if (body.email) {
			const query = `select * from users where email = '${body.email}'`;
			const email = await DB.first(query);
			if (email.length > 0) {
				throw new ApiError('Email Already registered Please use another');
			}
		}
		if (body.phone) {
			const query = `select * from users where email = '${body.phone}'`;
			const phone = await DB.first(query);
			if (phone.length > 0) {
				throw new ApiError('Phone Already registered Please use another');
			}
		}
		delete body.profile;
		body.password = app.createHash(body.password);
		if (Request.files && Request.files.profile) {
			body.profile = await app.upload_pic_with_await(Request.files.profile);
		}
		delete body.licence;
		if (Request.files && Request.files.licence) {
			body.licence = await app.upload_pic_with_await(Request.files.licence);
		}
		return await DB.save('users', body);
	}

	async createGroup(Request) {
		const { body } = Request;
		delete body.image;
		if (Request.files && Request.files.image) {
			body.image = await app.upload_pic_with_await(Request.files.image);
		}
		return await DB.save('groups', body);
	}

	async getGroups(Request) {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		const group_type = Request.query.group_type || 20;
		offset = (offset - 1) * limit;
		let conditions = `where group_type = ${group_type}`;
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` and name like '%${q}%'`;
		}
		const query = `select * from groups ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from groups ${conditions}`;
		const result = {
			pagination: await super.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), ['image']),
		};
		return result;
	}

	async adminProfile(Request) {
		const { body } = Request;
		if (body.password === 'empty' || body.password === '') {
			delete body.password;
		} else {
			body.password = app.createHash(body.password);
		}
		delete body.profile;
		if (Request.files && Request.files.profile) {
			body.profile = await app.upload_pic_with_await(Request.files.profile);
		}
		const admin_id = await DB.save('admins', body);
		const admin_info = await DB.first(
			`select * from admins where id = ${admin_id} limit 1`
		);
		if (admin_info[0].profile.length > 0) {
			admin_info[0].profile = app.ImageUrl(admin_info[0].profile);
		}
		return admin_info[0];
	}

	async updateData(req) {
		const { body } = req;
		if (body.id === undefined) {
			throw new ApiError('id is missing', 400);
		}
		if (req.files && req.files.picture) {
			body.picture = await app.upload_pic_with_await(req.files.picture);
		}
		if (req.files && req.files.profile) {
			body.profile = await app.upload_pic_with_await(req.files.profile);
		}
		if (body.doucment_request && body.doucment_request == 1) {
			setTimeout(async () => {
				try {
					const user = await DB.find('users', 'first', {
						conditions: { id: body.id },
					});
					app.send_push({
						message: 'Admin has approved your request of becoming a Listener.',
						notification_code: 2,
						body: {},
						token: user.device_token,
					});
				} catch (err) {
					console.log(err);
				}
			}, 100);
		}
		return await DB.save(body.table, body);
	}

	async deleteData(req) {
		const { body } = req;
		if (body.id === undefined) {
			throw new ApiError('id is missing', 400);
		}
		return await DB.first(`delete from ${body.table} where id = ${body.id}`);
	}

	async Notification(Request) {
		const { message, tag_id } = Request.body;
		return [
			{
				message: message,
				tag_id,
			},
		];
	}

	async dashboard() {
		const users = await DB.first('select count(id) as total from users');
		const groups = await DB.first(
			'select count(id) as total from groups where group_type=1'
		);
		const userGroup = await DB.first(
			'select count(id) as total from groups where group_type=0'
		);
		return {
			total_users: users[0].total,
			total_groups: groups[0].total,
			total_user_groups: userGroup[0].total,
		};
	}

	async appInfo() {
		return await DB.first('select * from app_informations');
	}
}

module.exports = adminController;

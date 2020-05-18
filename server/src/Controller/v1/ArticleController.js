const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	allCategory: async (Request) => {
		let offset = Request.query.offset || 1;
		const limit = Request.query.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where name like '%${q}%'`;
		}
		const query = `select * from categories ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from categories ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), 'image'),
		};
		return {
			message: 'Category listing',
			data: result,
		};
	},
	getArticle: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 20, category_id = 0 } = Request.query;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where articles.name like '%${q}%' or categories.name like '%${q}%' `;
		}
		if (parseInt(category_id) !== 0) {
			if (conditions) {
				conditions += ` and category_id = ${category_id}`;
			} else {
				conditions += ` where category_id = ${category_id}`;
			}
		}
		const query = `select articles.*,categories.name as category_name  from articles join categories on (articles.category_id = categories.id)  ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from articles join categories on (articles.category_id = categories.id) ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), 'image'),
		};
		return {
			message: 'Article listing',
			data: result,
		};
	},
	getGoal: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 20, category_id = 0 } = Request.query;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where goals.name like '%${q}%' or categories.name like '%${q}%' `;
		}
		if (parseInt(category_id) !== 0) {
			if (conditions) {
				conditions += ` and category_id = ${category_id}`;
			} else {
				conditions += ` where category_id = ${category_id}`;
			}
		}
		const query = `select goals.*,categories.name as category_name  from goals join categories on (goals.category_id = categories.id)  ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from goals join categories on (goals.category_id = categories.id) ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: await DB.first(query),
		};
		return {
			message: 'Goals listing',
			data: result,
		};
	},
};

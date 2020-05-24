const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
const ApiError = require('../../Exceptions/ApiError');
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
			pagination: await apis.QueryPaginations(total, offset, limit),
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
			pagination: await apis.QueryPaginations(total, offset, limit),
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
			pagination: await apis.QueryPaginations(total, offset, limit),
			result: await DB.first(query),
		};
		return {
			message: 'Goals listing',
			data: result,
		};
	},
	categoryDetails: async (Request) => {
		const { category_id } = Request.params;
		const goals = await DB.first(
			`select goals.*,categories.name as category_name  from goals join categories on (goals.category_id = categories.id)  where category_id=${category_id} order by id desc`
		);
		const airticles = await DB.first(
			`select articles.*,categories.name as category_name  from articles join categories on (articles.category_id = categories.id)  where category_id=${category_id} order by id desc`
		);
		return {
			message: 'category detaisl',
			data: {
				airticles: app.addUrl(airticles, 'image'),
				goals,
			},
		};
	},
	setGoal: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			goal_id: Request.body.goal_id,
		};
		const requestData = await apis.vaildation(required, {});
		const { user_id, goal_id } = requestData;
		const goalDetails = await DB.find('goals', 'first', {
			conditions: {
				id: goal_id,
			},
		});
		if (!goalDetails) throw new ApiError('Invaild goal id', 422);
		const setGoalInfo = await DB.find('user_goals', 'first', {
			conditions: {
				goal_id,
				user_id,
			},
		});
		let message = '';
		if (setGoalInfo) {
			message = 'Goal Remove successfully';
			await DB.first(`delete from user_goals where id = ${setGoalInfo.id} `);
			await DB.first(
				`delete from goal_progresses where user_goal_id = ${setGoalInfo.id} `
			);
		} else {
			await DB.save('user_goals', requestData);
			message = 'Goal set successfully';
		}
		return {
			message,
			data: [],
		};
	},
	addProgress: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			user_goal_id: Request.body.user_goal_id,
			date: Request.body.date,
		};
		const requestData = await apis.vaildation(required, {});
		const { user_goal_id, date } = requestData;
		const goalDetails = await DB.find('user_goals', 'first', {
			conditions: {
				id: user_goal_id,
			},
		});
		if (!goalDetails) throw new ApiError('Invaild user goal id', 422);
		requestData.date = app.unixTimeStamp(date);
		const completeGoal = await DB.first(
			`select count(id) as total from goal_progresses where user_goal_id = ${user_goal_id} and from_unixtime(date, '%Y%D%M') = from_unixtime(${requestData.date}, '%Y%D%M')`
		);
		if (completeGoal[0].total > 0)
			throw new ApiError(`this goal already done for this ${date} date`, 400);
		await DB.save('goal_progresses', requestData);
		return {
			message: 'goal completed successfully',
			data: [],
		};
	},
	getProgress: async (Request) => {
		let offset = Request.query.offset || 1;
		const user_id = Request.body.user_id;
		const { limit = 20, date = app.currentTime } = Request.query.limit || 20;
		offset = (offset - 1) * limit;
		const query = `select goals.*,user_goals.id as user_goal_id   from user_goals join goals on (goals.id = user_goals.goal_id) where user_id=${user_id}  order by user_goal_id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from user_goals join goals on (goals.id = user_goals.goal_id) where user_id=${user_id} `;
		const timeStamp = isNaN(date) ? app.unixTimeStamp(date) : date;
		const result = {
			goals: {
				pagination: await apis.QueryPaginations(total, offset, limit),
				result: await DB.first(query),
			},
		};
		const completeGoal = await DB.first(
			`select count(id) as total from goal_progresses where user_id = ${user_id} and from_unixtime(date, '%Y%D%M') = from_unixtime(${timeStamp}, '%Y%D%M')`
		);
		const completedGoal = completeGoal[0].total || 0;
		const totalRecord = result.goals.pagination.totalRecord;
		const progress = {
			completeGoal: completedGoal,
			pendingGoal: totalRecord - completedGoal,
			avg: Math.round((totalRecord / completeGoal) * 100, 1) || 0,
		};
		Object.assign(result, { progress });
		return {
			message: 'my goal listing',
			data: result,
		};
	},
};

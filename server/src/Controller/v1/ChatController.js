const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const { lang } = require('../../../config');
const DB = new Db();

class ChatController extends ApiController {
	async sendMessage(Request) {
		const required = {
			friend_id: Request.body.friend_id,
			user_id: Request.body.user_id,
			message_type: Request.body.message_type || 0, // 0-> text 1-> media
			message: Request.body.message || ''
		};
		if (required.message_type !== '0') delete required.message;
		const requestData = await super.vaildation(required, {});
		const user_info = await DB.find('users', 'first', {
			conditions: {
				'users.id': requestData.friend_id,
				status: 1
			},
			fields: [ 'id', 'name', 'status', 'email', 'user_type', 'about_us', 'profile', 'status' ]
		});
		if (!user_info) throw new ApiError(lang[Request.lang].userNotFound, 404);
		const { user_id, friend_id } = requestData;
		const query = `select * from threads where (user_id = ${user_id} and friend_id = ${friend_id} ) or (user_id = ${friend_id} and friend_id = ${user_id}) limit 1`;
		const threads = await DB.first(query);
		if (threads.length > 0) {
			requestData.thread_id = threads[0].id;
		} else {
			requestData.thread_id = await DB.save('threads', requestData);
		}
		if (!(Request.files && Request.files.message) && requestData.message_type > '0')
			throw new ApiError('message feild required', 400);
		if (Request.files && Request.files.message) {
			requestData.message = await app.upload_pic_with_await(Request.files.message);
		}
		requestData.sender_id = requestData.user_id;
		requestData.receiver_id = requestData.friend_id;
		requestData.id = await DB.save('chats', requestData);
		const object = {
			id: requestData.thread_id,
			last_chat_id: requestData.id
		};
		DB.save('threads', object);
		if (user_info.profile.length > 0) {
			user_info.profile = appURL + 'uploads/' + user_info.profile;
		}
		if (requestData.message_type !== '0') {
			requestData.message = appURL + 'uploads/' + requestData.message;
		}
		const { userInfo } = Request.body;
		requestData.user_info = userInfo;
		requestData.text = requestData.message;
		setTimeout(() => {
			const pushObject = {
				message: requestData.message,
				notification_code: 8,
				body: requestData
			};
			super.sendPush(pushObject, requestData.friend_id);
		}, 100);

		return {
			message: lang[Request.lang].messageSend,
			data: requestData
		};
	}

	async getMessage(Request) {
		const required = {
			friend_id: Request.query.friend_id,
			user_id: Request.body.user_id
		};
		const requestData = await super.vaildation(required, {});
		const { user_id, friend_id } = requestData;
		const thread = `select * from threads where (user_id = ${user_id} and friend_id = ${friend_id} ) or (user_id = ${friend_id} and friend_id = ${user_id}) limit 1`;
		let id = 0;
		const threadInfo = await DB.first(thread);
		if (threadInfo.length > 0) {
			if (threadInfo[0].user_id === requestData.user_id) {
				id = threadInfo[0].first_friend_deleted_id;
			} else {
				id = threadInfo[0].second_friend_deleted_id;
			}
		}
		DB.first(`update chats set is_read = 1 where receiver_id= ${user_id} and sender_id = ${friend_id}`);
		const query = `select chats.*, users.id as friend_id, users.profile, users.phone,users.email, users.name, users.cover_pic, users.about_us, users.user_type  from chats join users on (users.id = IF(chats.sender_id = 
			${user_id},chats.receiver_id,chats.sender_id)) where ((sender_id = ${user_id} and receiver_id = ${friend_id})
		  or (sender_id = ${friend_id} and receiver_id = ${user_id})) and chats.id > ${id} and (select count(id) as total from delete_chats where user_id =  ${user_id} and chat_id = chats.id) = 0 limit 100`;
		const chats = await DB.first(query);
		const final = makeChatArray(chats);
		return {
			message: lang[Request.lang].messages,
			data: final
		};
	}

	async lastChat(Request) {
		const user_id = Request.body.user_id;
		const query = `select chats.*, users.id as friend_id,(select count(id) from chats  where is_read = 0 and receiver_id = ${user_id} and sender_id = users.id) as un_read_message, users.profile,users.user_type, users.phone,users.email, users.name, users.cover_pic, users.about_us
		from threads join chats on (chats.id = threads.last_chat_id) join users on (users.id = IF(user_id = ${user_id}, friend_id, user_id ))
		where (user_id = ${user_id} or  friend_id = ${user_id}) and chats.id > IF(threads.user_id = ${user_id}, threads.first_friend_deleted_id, threads.second_friend_deleted_id)  order by chats.id desc`;
		return {
			message: lang[Request.lang].lastChat,
			data: makeChatArray(await DB.first(query))
		};
	}

	async readMessage(Request) {
		const user_id = Request.body.user_id;
		const chat_id = Request.params.chat_id;
		await DB.first(`update chats set is_read = 1 where receiver_id = ${user_id} and id=${chat_id}`);
		return {
			message: 'Message read successfully',
			data: []
		};
	}

	async deletesingleMessage(req) {
		const required = {
			user_id: req.body.user_id,
			chat_id: req.body.chat_id
		};
		const request_data = await super.vaildation(required, {});
		await DB.save('delete_chats', request_data);
		return {
			message: lang[req.lang].chatDelete,
			data: []
		};
	}

	async deleteChat(Request) {
		const required = {
			user_id: Request.body.user_id,
			thread_id: Request.body.thread_id
		};
		const request_data = await super.vaildation(required, {});
		let query = 'select * from threads where id = ' + request_data.thread_id;
		let last_chats = await DB.first(query);
		if (last_chats.length > 0) {
			if (last_chats[0].user_id === request_data.user_id) {
				request_data.first_friend_deleted_id = last_chats[0].last_chat_id;
			} else {
				request_data.second_friend_deleted_id = last_chats[0].last_chat_id;
			}
			request_data.id = last_chats[0].id;
			delete request_data.user_id;
			delete request_data.thread_id;
			await DB.save('threads', request_data);
		} else {
			throw new ApiError(lang[Request.lang].threadInvaild, 404);
		}
		return {
			message: lang[Request.lang].chatDelete,
			data: []
		};
	}
}

module.exports = ChatController;

const makeChatArray = (chats) => {
	return chats.map((value) => {
		const chats = {
			id: value.id,
			sender_id: value.sender_id,
			receiver_id: value.receiver_id,
			thread_id: value.thread_id,
			message_type: value.message_type,
			message: value.message,
			is_read: value.is_read,
			created: value.created,
			modified: value.modified,
			un_read_message: value.un_read_message,
			friendInfo: {
				name: value.name,
				cover_pic: value.cover_pic,
				about_us: value.about_us,
				user_type: value.user_type,
				profile: value.profile,
				user_id: value.friend_id,
				phone: value.phone,
				email: value.email
			}
		};
		if (value.profile.length > 0) {
			chats.friendInfo.profile = appURL + 'uploads/' + value.profile;
		}
		if (value.message_type !== 0) {
			chats.message = appURL + 'uploads/' + value.message;
		}
		return chats;
	});
};

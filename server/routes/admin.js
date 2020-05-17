const express = require('express');
const router = express.Router();
const {
	adminController,
	ArticleController,
} = require('../src/Controller/admin/index');
const { cross, AdminAuth } = require('../src/middleware/index');
const response = require('../libary/Response');
const { login } = require('../src/Request/adminRequest');
let admin = new adminController();

router.use([cross, AdminAuth]);
router.get('/', function (req, res) {
	res.json(' APi workings ');
});
router.post('/login', login, admin.login);
router.post('/send-push', response(admin.Notification));
router.get('/dashboard', response(admin.dashboard));
router.put('/edit-user', response(admin.editUser));
router
	.route('/users/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allUser))
	.post(response(admin.addUser))
	.put(response(admin.updateData))
	.delete(response(admin.deleteData));
router
	.route('/category/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(ArticleController.allCategory))
	.post(response(ArticleController.addCategory))
	.put(response(ArticleController.addCategory))
	.delete(response(admin.deleteData));
router
	.route('/articles/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(ArticleController.getArticle))
	.post(response(ArticleController.addArticle))
	.put(response(ArticleController.addArticle))
	.delete(response(admin.deleteData));

router.post('/admin-profile', response(admin.adminProfile));

router
	.route('/appInfo/')
	.get(response(admin.appInfo))
	.put(response(admin.updateData));

module.exports = router;

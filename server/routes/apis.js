const express = require('express');
const router = express.Router();
const {
	UserController,
	ChatController,
	ArticleController,
} = require('../src/Controller/v1/index');
const { userSignup } = require('../src/Request');
const {
	UserAuth,
	cross,
	Language,
	AuthSkip,
} = require('../src/middleware/index');
const Apiresponse = require('../libary/ApiResponse');
const user = new UserController();
const Chat = new ChatController();
router.use([cross, Language, AuthSkip, UserAuth]);
router.get('/', function (req, res) {
	res.send(' APi workings ');
});

router.post('/user', userSignup, Apiresponse(user.addUser));
router.post('/user/login/', Apiresponse(user.loginUser));
router.post('/user/verify', Apiresponse(user.verifyOtp));
router.post('/user/edit/', Apiresponse(user.updateProfile));
router.post('/change-password', Apiresponse(user.changePassword));
router.post('/forgot-password', Apiresponse(user.forgotPassword));
router.post('/logout', Apiresponse(user.logout));
router.get('/app-information', Apiresponse(user.appInfo));
router.get('/articles', Apiresponse(ArticleController.getArticle));
router.get('/categories', Apiresponse(ArticleController.allCategory));
router.get('/goals', Apiresponse(ArticleController.getGoal));
router.get(
	'/category_details/:category_id([0-9]+)',
	Apiresponse(ArticleController.categoryDetails)
);
module.exports = router;

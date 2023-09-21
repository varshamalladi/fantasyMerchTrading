const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');

const router = express.Router();

//get the sign-up form
router.get('/new', isGuest, controller.new);

//create a new user
router.post('/', isGuest, validateSignUp, validateResult, controller.create);

//get the login page
router.get('/login', isGuest, controller.login);

//process login request
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.authenticateLogin);

//get the profile page
router.get('/profile', isLoggedIn, controller.profile);

//logout
router.get('/logout', isLoggedIn, controller.logout);
module.exports = router;
const express = require('express');

const userController = require('../controllers/users.controller');
const refreshTokenController = require('../controllers/refreshToken.controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();


router.post('/register', userController.createUserController);
router.post('/login', userController.loginUserController);
router.post('/logout', authenticate, userController.logoutUserController);

router.post('/refresh-token', refreshTokenController.refreshAccessToken);


module.exports = router;
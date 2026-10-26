const UserService = require('../services/users.service');
const generateToken = require('../utils/generateToken');
const { generateRefreshToken, hashRefreshToken } = require('../utils/refreshToken');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');
const RefreshToken = require('../models/refreshToken.model');


const createUserController = async (req, res, next) => {
    try {
        const { username, email, password, password2 } = req.body;
        if (password !== password2) {
            throw new AppError('Passwords do not match', 400);
        }
        const user = await UserService.createUser({ username, email, password });

        const token = generateToken(user._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 60 * 1000
        })

        res.status(201).json({
            code: 201,
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        next(error);
    }
}

const loginUserController = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const user = await UserService.loginUser({ username });
        if (!user) {
            throw new AppError('Invalid username or password', 401);
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            throw new AppError('Invalid username or password', 401);
        }
        // if (user.code === 200) {
        //     req.session.userId = user.data.user._id;
        // }
        const accessToken = generateToken(user._id.toString());
        const refreshToken = generateRefreshToken();

        await RefreshToken.create({
            userId: user._id,
            tokenHash: hashRefreshToken(refreshToken),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
        
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        }

        res.cookie('token', accessToken, {
            ...cookieOptions,
            maxAge: 7 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
            path: '/v1/users/refresh-token'
        });

        res.status(200).json({
            code: 200,
            message: 'User logged in successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        next(error);
    }
}

const logoutUserController = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.status(200).json({
        message: 'User logged out successfully'
    });
};



module.exports = { 
    createUserController, 
    loginUserController, 
    logoutUserController 
};
const UserModel = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { generateRefreshToken, hashRefreshToken } = require('../utils/refreshToken');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');


const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError('Refresh token not provided, pls login again', 401);
        }

        const tokenHash = hashRefreshToken(refreshToken);
        const storedToken = await RefreshToken.findOne({ 
            tokenHash, 
            expiresAt: { $gt: new Date() } 
        });

        if (!storedToken) {
            throw new AppError('Invalid or expired refresh token, pls login again', 401);
        }
        const user = await UserModel.findById(storedToken.userId);

        if (!user) {
            await RefreshToken.deleteOne({ _id: storedToken._id });
            throw new AppError('User not found, pls login again', 401);
        }

        await RefreshToken.deleteOne({ _id: storedToken._id });

        const newAccessToken = generateToken(user._id.toString());

        const newRefreshToken = generateRefreshToken();

        await RefreshToken.create({
            userId: user._id,
            tokenHash: hashRefreshToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        };

        res.cookie('token', newAccessToken, {
            ...cookieOptions,
            maxAge: 7 * 60 * 1000
        });

        res.cookie('refreshToken', newRefreshToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
            path: '/v1/users/refresh-token'
        });

        return res.status(200).json({
            message: 'Access token refreshed successfully'
        });    

    } catch (error) {
        next(error);
    }
}

module.exports = {
    refreshAccessToken
};
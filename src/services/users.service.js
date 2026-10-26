const UserModel = require('../models/user.model');

const createUser = async ({ username, email, password}) => {

    return await UserModel.create({ username, email, password });
}

const loginUser = async ({ username }) => {
    return await UserModel.findOne({username});

}


module.exports = { 
    createUser, 
    loginUser
};
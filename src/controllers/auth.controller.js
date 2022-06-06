const User = require("../models/user.model.js");
const { connectMongoDb, disconnectMongoDb } = require("../utils/mongo.util.js");
const { sendResponse } = require("../utils/response.util.js");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
var jwt = require('jsonwebtoken');

async function Signup(req, res) {
    await connectMongoDb(req, res, process.env.CORE_DB);

    const { fullname, email, password } = req.detail.body;
    const isOneNull = !fullname || !email || !password;
    const isEmailRegistered = await User.findOne({ email });

    function createAccount() {
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT));

        const user = new User({
            fullname,
            email,
            password: hashPassword
        });

        user.save()
            .then(async result => {
                const token = jwt.sign({id: result._id}, process.env.JWT_SECRET);
                await disconnectMongoDb(req, res);
                sendResponse(req, res, 201, "Create account successful", {token})
            })
            .catch(async error => {
                console.log(error);
                await disconnectMongoDb(req, res);
                sendResponse(req, res, 500, "Create account faled", null);
            });
    };

    if (isOneNull) {
        await disconnectMongoDb(req, res);
        sendResponse(req, res, 400, "Please fill all the requirements", null);
    } else if (!isOneNull && isEmailRegistered) {
        await disconnectMongoDb(req, res);
        sendResponse(req, res, 400, "Email already registered", null);
    } else {
        createAccount();
    };
};

async function Signin(req, res) {
    await connectMongoDb(req, res);

    const { email, password } = req.detail.body;
    const isOneNull = !email || !password;
    const isEmailRegistered = await User.findOne({ email });

    if (isOneNull) {
        await disconnectMongoDb(req, res);
        sendResponse(req, res, 400, "Please fill all the requirements", null);
    }else if (!isEmailRegistered) {
        await disconnectMongoDb();
        sendResponse(req, res, 400, "Email not registered", null)
    } else {
        const isPasswordMatch = bcrypt.compareSync(password, isEmailRegistered.password);
        if (isPasswordMatch) {
            const token = jwt.sign({id: isEmailRegistered._id}, process.env.JWT_SECRET);
            await disconnectMongoDb(req, res);
            sendResponse(req, res, 200, "Sign in successful", {token});
        } else {
            await disconnectMongoDb();
            sendResponse(req, res, 400, "Wrong password", null)
        };
    };
};

module.exports = {
    Signup,
    Signin
};
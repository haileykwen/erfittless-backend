const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectMongoDb(req, res) {
    try {
        await mongoose.connect(process.env.DB_URI.replace(process.env.SLUG_DB, process.env.CORE_DB), { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            autoIndex: true
        });
        console.log("Database connected");
    } catch (error) {
        console.log("Fail connect to database", error);
        return res.status(500).send({
            error: true,
            message: "Fail connect to database",
            request: req.detail
        });
    };
};

async function disconnectMongoDb(req, res) {
    try {
        await mongoose.disconnect();
        console.log("Database disconnected");
    } catch (error) {
        console.log("Fail disconnect to database", error);
        return res.status(500).send({
            error: true,
            message: "Fail disconnect to database",
            request: req.detail
        });
    };
};

module.exports = {
    connectMongoDb,
    disconnectMongoDb
};
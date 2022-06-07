const express       = require('express');
const app           = express();
const PORT          = 6000;
const cors          = require('cors');
const { getRequestDetail }  = require('./src/middlewares/request.middleware.js');
const authRoutes            = require("./src/routes/auth.routes.js");
const { connectMongoDb, disconnectMongoDb } = require('./src/utils/mongo.util.js');

app.use(cors());
app.use((req, res, next) => { // Handle error CORS policy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}) 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", getRequestDetail ,authRoutes);
app.use('*', getRequestDetail, async (req, res) => {
    connectMongoDb(req, res);
    disconnectMongoDb(req, res);

    res.status(200).send({
        error   : false,
        request : req.detail
    });
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Erfittless run on port ${process.env.PORT || PORT}`);
});
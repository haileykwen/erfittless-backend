const express       = require('express');
const app           = express();
const PORT          = 3000;
const { getRequestDetail }  = require('./src/middlewares/request.middleware.js');
const authRoutes            = require("./src/routes/auth.routes.js");
const { connectMongoDb, disconnectMongoDb } = require('./src/utils/mongo.util.js');

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
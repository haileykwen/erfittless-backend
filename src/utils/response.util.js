function sendResponse(req, res, code, message, data) {
    return res.status(code).json({
        error: code == 201 || code == 200 ? false : true,
        message: message,
        data: data,
        request: req.detail,
        status: code
    });
};

module.exports = {
    sendResponse
};
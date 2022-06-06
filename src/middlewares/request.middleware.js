function getRequestDetail(req, res, next) {
    const request = {
        method  : req.method,
        path    : req._parsedUrl.pathname,
        body    : req.body,
        query   : req.query
    };

    req.detail = request;
    next();
};

module.exports = {
    getRequestDetail
};
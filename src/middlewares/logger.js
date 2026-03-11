const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const status = res.statusCode;
        console.log(`[${timestamp}] ${method} ${url} - ${status}`);
    });

    next();
};

module.exports = loggerMiddleware;

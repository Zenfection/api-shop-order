import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

const PUBLIC_URLS_REGEX = /\/users\/(login|register)|\/categories|\/products|\/products\/count/;

const byPassToken = (req) => {
    const url = req.url.toLowerCase().trim();
    return PUBLIC_URLS_REGEX.test(url);
};

const requireToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: 'Token is required',
        });
        return null;
    }
    const tokenMatch = authHeader.match(/^Bearer (.+)/);
    if (!tokenMatch) {
        res.status(httpStatus.UNAUTHORIZED).json({
            message: 'Invalid token format',
        });
        return null;
    }
    return tokenMatch[1];
};

export default async function checkToken(req, res, next) {
    // check bypass 
    if (byPassToken(req)) {
        return next();
    }
    // check token
    try {
        const token = requireToken(req, res);
        if (!token) {
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (isExpired) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: 'Token is expired',
            });
        }
        return next();
    } catch (error) {
        console.error(`Error in ${req.method} ${req.url}: ${error}`);
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Error occurred',
            error: error.message,
            url: req.url,
            method: req.method,
        });
    }
}

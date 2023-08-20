const user = require('../models/User');
const jwt = require('jsonwebtoken');


exports.authenticateToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; //bearer kısmı ayırıp 2.kısmı alıyor.

    if (!token) return res.status(404).json({ message: 'Token bulunamadı.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token geçersiz"
            })
        }
        req.user = user;
        next();
    })
}





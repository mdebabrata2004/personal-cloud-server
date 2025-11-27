const handler = require('../../api/auth');
module.exports = (req, res) => { req.url = req.url || '/login'; return handler(req,res); };

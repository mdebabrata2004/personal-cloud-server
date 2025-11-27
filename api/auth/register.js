const handler = require('../../api/auth');
module.exports = (req, res) => { req.url = req.url || '/register'; return handler(req,res); };

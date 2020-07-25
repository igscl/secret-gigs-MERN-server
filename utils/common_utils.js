const handleError = function(req, res) {
	const {status=500, message} = req
	res.status(status);
	res.send(message);
}

const userAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = {handleError, userAuthenticated}
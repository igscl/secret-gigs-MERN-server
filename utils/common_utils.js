const handleError = function(req, res) {
	const {status=500, message} = req
	res.status(status);
	res.send(message);
}

module.exports = {handleError}
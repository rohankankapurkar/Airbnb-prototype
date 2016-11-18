var crypto = require('crypto');

var algorithm = "aes-256-ctr"; //Algorithm used for encrypting
var password = "K33p!tS3(reT"; //Key for encryption

// This function returns the encrypted text.
exports.encrypt = function(text){
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(text, 'utf-8','hex');
	crypted += cipher.final('hex');
	return crypted;
}

// AWS Dep
const AWS = require('aws-sdk');

// AWS Config
if (process.env.REGION) {
	AWS.config.region = process.env.REGION
}
// var sns = new AWS.SNS();
// var s3 = new AWS.S3();
// var ddb = new AWS.DynamoDB();

exports.setYTStream = function(vidId, stream) {
	console.log('setting '+vidId);
};

exports.getYTStream = function(vidId) {
	console.log('looking for '+vidId);
	return null;
};
'use strict';

exports.DATABASE_URL = 
	process.env.DATABASE_URL ||
	global.DATABASE_URL 
	//'mongodb://localhost/goals_project';
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL ||
	global.TEST_DATABASE_URL 
	//'mongodb://localhost/goals_project_test_db';
exports.PORT = process.env.PORT || 3232;
exports.JWT_SECRET = process.env.JWT_SECRET;



/*let configurations = {
    databaseUrl: 'mongodb://admin:admin@ds155490.mlab.com:55490/goals_project',
    TEST_DATABASE_URL: 'mongodb://admin:admin@ds257627.mlab.com:57627/goals_project_test_db',
    localPort: 3232,
    testingPort: 5353,
    serverRunningMessage: "NodeMagic is happening on port ",
    secret: "amazingsecret"
};

module.exports = configurations;*/

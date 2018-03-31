if (process.env.NODE_ENV === 'test') {
  module.exports = {
    secret: 'TEST_SECRET',
    db_uri: 'mongodb://localhost/Carpool',
    CASValidateURL: 'https://idp.rice.edu/idp/profile/cas/serviceValidate',
    thisServiceURL: 'http://localhost:4200/auth',
    frontendURL: 'http://localhost:4200',
  };
} else {
  module.exports = {
    secret: 'TEST_SECRET',
    db_uri: 'mongodb://riceapps:r1ce4pps$wag1@carpool-dev-shard-00-00-k86la.mongodb.net:27017,carpool-dev-shard-00-01-k86la.mongodb.net:27017,carpool-dev-shard-00-02-k86la.mongodb.net:27017/test?ssl=true&replicaSet=carpool-dev-shard-0&authSource=admin',
    CASValidateURL: 'https://idp.rice.edu/idp/profile/cas/serviceValidate',
    thisServiceURL: 'http://localhost:4200/auth',
    frontendURL: 'http://localhost:4200',
  };
}

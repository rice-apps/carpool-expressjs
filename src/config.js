if(process.env.NODE_ENV == 'test') {
    module.exports = {
        'secret': 'TEST_SECRET',
        'db_uri': 'mongodb://localhost/Carpool'
    };
}

else {
    module.exports = {
        'secret': 'TEST_SECRET',
        'db_uri': 'mongodb://localhost/Carpool'
    };
}

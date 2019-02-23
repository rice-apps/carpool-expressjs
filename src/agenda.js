var Agenda = require('agenda');
const config = require('./config');
const nodemailer = require('nodemailer');

const mongoConnectionString = config.db_uri;
// printing out config.db_uri: mongodb://carpool2018:carpool2018@ds149353.mlab.com:49353/carpool_dev

//const mongoConnectionString = mongoose.connect('mongodb://127.0.0.1/Carpool',{ useMongoClient: true });
const agenda = new Agenda({db: {address: mongoConnectionString, collection: 'jobs'}});
agenda.start();

// Job data should include: ride id
// done() --> asynchronous
agenda.define('send future email', (job, done) => {
    // const {to} = job.attrs.data;
    console.log('are these the emails? %s', job.attrs.data.to);
    createEmailReminderJob(job.attrs.data);
    done();
});

// eventually migrate EmailConfirmation function to here.
agenda.define("ride creation email", (job, done) => {
    // TODO

    done();
});

agenda.on('start', job => {
    console.log('Job \"%s\" starting with id %s and email %s', job.attrs.name, job.attrs.data.ride_id, job.attrs.data.to);
});
agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`);
    job.remove(err => {
        if (!err) {
            console.log('Successfully removed job from collection');
        }
    });
});
agenda.on('success:send future email', job => {
    console.log(`Sent Email Successfully`);
});
agenda.on('fail:send future email', (err, job) => {
    console.log('Job failed with error: ${err.message}');
});

/**
 *
 * @param data: Object containing ride ID and list of riders
 */
function createEmailReminderJob(data) {
    var messageBody = '<p>Your ride is in 24 hours.</p>';

    async function main(){

        // create reusable transporter object using the default SMTP transport
        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                type: 'OAuth2',
                user: 'carpool.riceapps@gmail.com', // generated ethereal user
                clientId: '859237922889-smeosvsfknkhm31sirfdt0afnspc4s64.apps.googleusercontent.com',
                clientSecret: 'aGISyb3daSQF1HFVqKFe5Nho',
                refreshToken: '1/o1N0caKIPFpdy02pn0qxgwcmpV9KbUyOEL9Jox7RmQQ',
                accessToken: 'ya29.GludBu475Z82VtLhBWgQNgkIPbVG27l1VrOeFrcrA8Cz1TWuraNc24Q2nAx2GedXezdP0qEJVF2Zw_87hHNsGlra8dJSWjEV9MfOjuOouX4Ly2k1RtENNHaTyU0v'
            }
        });

        var emailString = "";
        for (var i = 0; i < data.to.length; i ++) {
            emailString += data.to[i] + ", ";
        }
        console.log("Email Receivers: %s", emailString);

        let mailOptions = {
            from: "Rice Carpool <carpool.riceapps@gmail.com>", // sender address
            to: emailString, // list of receivers
            subject: "Your ride is in 24 hours!", // Subject line
            html: messageBody
        };

        let info = await smtpTransport.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

    }

    main().catch(console.error);
}

module.exports = agenda;

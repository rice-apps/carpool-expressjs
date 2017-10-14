var mongoose = require('mongoose');

var RideSchema = new mongoose.Schema({
    title: String,
    description: String,
    departure_time: Date,
    arrival_time: Date,
    departure_address: String,
    arrival_address: String,
    // departure_location: Location,
    // arrival_location: Location,
    spots: Number
    // vehicle_type: [Sedan, Van, Minivan, SUV]
    // owner: User,
    // riders: [User]
});

mongoose.model('Bike', RideSchema);

module.exports = mongoose.model('Bike');
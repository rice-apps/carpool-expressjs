var mongoose = require('mongoose');

var RideSchema = new mongoose.Schema({
    title: String,
    description: String,
    cost: Number,
    departure_time: Date,
    arrival_time: Date,
    departure_address: String,
    arrival_address: String,
    departure_location: { type: 'Point', coordinates: [Number]}, // [long, lat]
    arrival_location: { type: 'Point', coordinates: [Number]}, // [long, lat]
    spots: Number,
    vehicle_type: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

mongoose.model('Ride', RideSchema);

module.exports = mongoose.model('Ride');
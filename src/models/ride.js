var mongoose = require('mongoose');

/**
 * Declare our schema for a Ride.
 */
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

    /* for owner and rider, we need to tell MongoDB to reference the User model here. */
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

/**
 * The owner and riders fields only contain IDs that reference the objects, not the actual obhect. Before we send our
 * Ride object, we need to 'populate' these fields with their actual objects.
 * This is called 'middleware.'
 *
 * @param next is a function passed in by mongoose that we need to call after we do our population.
 */
var autoPopulate = function (next) {
    this.populate('owner');
    this.populate('riders');
    next();
};

/**
 * Plug in our middleware we defined above to run before the specified operations.
 */
RideSchema.pre('find', autoPopulate);
RideSchema.pre('findOne', autoPopulate);
RideSchema.pre('save', autoPopulate);

/**
 * Declare the model.
 */
mongoose.model('Ride', RideSchema);

module.exports = mongoose.model('Ride');
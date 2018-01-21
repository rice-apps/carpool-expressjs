var mongoose = require('mongoose');

/**
 * Declare our schema for a Ride.
 */
var RideSchema = new mongoose.Schema({
    departing_from: String,
    arriving_at: String,
    departure_time: Date,

    /* for rider, we need to tell MongoDB to reference the User model here. */
    riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

/**
 * The riders field only contains IDs that reference the User objects, not the actual object. Before we send
 * our Ride object, we need to 'populate' this field with its actual User objects.
 * This is a type of 'middleware.'
 *
 * @param next is a function passed in by mongoose that we need to call after we do our population.
 */
var autoPopulate = function (next) {
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
module.exports = mongoose.model('Ride', RideSchema);
const mongooose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongooose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    }
});
eventSchema.plugin(autopopulate);

module.exports = mongooose.model('Event', eventSchema);

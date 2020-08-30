const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { dateToString } = require('../../helpers/date');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          createdAt: dateToString(booking._doc.createdAt),
          updatedAt: dateToString(booking._doc.updatedAt),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      createdAt: dateToString(result._doc.createdAt),
      updatedAt: dateToString(result._doc.updatedAt),
    };
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      const event = { ...booking.event._doc, _id: booking.event.id };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};

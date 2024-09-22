import{ Schema, models, model } from 'mongoose';

export interface IBooking extends Document {
    _id: string,
    pickup: string;
    destination: string;
    date: string;
    fullName: string;
    email: string;
    phone: string;
    seats: string;
    bookingDate: Date;
    reference: string;
    status?: 'pending' | 'completed'
};

const BookingSchema: Schema = new Schema({
  pickup: {type: String, required: true},
  destination: {type: String, required: true},
  date: {type: String, required: true},
  fullName: { type: String, required: true },
  email: {type: String, required: true},
  phone: {type: String, required: true},
  seats: {type: String, required: true},
  bookingDate: {type: Date, default: Date.now},
  reference: {type:String, required: true},  // This should match Paystack's reference
  status: { type: String, default: 'pending' }
});

const Booking= models.Booking || model('Booking', BookingSchema);

export default Booking;
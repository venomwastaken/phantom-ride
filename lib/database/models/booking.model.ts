import { Document } from 'mongoose';
import{ Schema, models, model, } from 'mongoose';

export interface IBooking extends Document {
    _id: string,

    busId : string;
    pickup: string;
    location: string;
    date: string;

    fullName: string;
    email: string;
    phone: string;

    seats: string[];

    agent: string;
    emergencyContactInfo: string;

    luggage: {
      name: string;
      quantity: number;
    }[];

    bookingDate: Date;
    reference: string;
    tickets: string;
    status?: "pending" | "completed"
};

const BookingSchema: Schema = new Schema<IBooking>({
  busId : {type:String, required:true},
  pickup: {type: String, required: true},
  location: {type: String, required: true},
  date: {type: String, required: true},

  fullName: { type: String, required: true },
  email: {type: String, required: true},
  phone: {type: String, required: true},

  seats: {type: [String], required: true},

  agent: {type: String, default: ""},
  emergencyContactInfo: {type: String, required: true},

  luggage: [
    {
      name: { type: String },
      quantity: { type: Number },
    }
  ],

  bookingDate: {type: Date, default: Date.now},
  reference: {type:String, required: true},  // This should match Paystack's reference
  tickets: {type: String, required: true},
  status: { type: String, enum: ["pending", "completed"], default: 'pending' }
});

const Booking= models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
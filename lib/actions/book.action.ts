'use server'


import { dbConnect } from "../database"
import Booking from "../database/models/booking.model"
import { handleError } from "../utils"

type BookingProps = {
    pickup: string,
    destination: string,
    date: string,
    fullName: string,
    email: string,
    phone:string,
    seats:string,
    reference:string,
    status?:string,
  };

export const booking = async (booking: BookingProps) => {
try {
    await dbConnect();
    const newbooking = await Booking.create(booking);
    return JSON.parse(JSON.stringify(newbooking));
    
} catch (error) {
    handleError(error);
}
}
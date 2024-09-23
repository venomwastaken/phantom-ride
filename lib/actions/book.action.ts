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

export const makeBooking = async (booking: BookingProps) => {
try {
    await dbConnect();
    const newbooking = await Booking.create(booking);
    return JSON.parse(JSON.stringify(newbooking));
    
} catch (error) {
    return handleError(error);
}
}

export const updateBookingStatus = async (reference: string) => {
    try {
        await dbConnect();
        const updatedbooking = await Booking.findOneAndUpdate({reference: reference}, {status:"completed"});
        return JSON.parse(JSON.stringify(updatedbooking));
        
    } catch (error) {
        return handleError(error);
    }
}

export const findBooking = async (reference: string) => {
    try {
        await dbConnect();
        const foundBooking = await Booking.findOne({reference: reference})
        return foundBooking
    } catch (error) {
        return handleError(error)
    }
}
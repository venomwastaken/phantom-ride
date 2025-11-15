'use server'


import { dbConnect } from "../database"
import Booking, { IBooking } from "../database/models/booking.model"
import { handleError } from "../utils"

type BookingProps = {
    pickup: string,
    location: string,
    // destination: string,
    date: string,
    fullName: string,
    email: string,
    phone:string,
    seats:string,
    agent: string;
    emergencyContactInfo: string;
    luggage: string[];
    reference:string,
    busId : string;
    status?:string,
  };

export const makeBooking = async (booking: IBooking) => {
try {
    await dbConnect();
    const tickets = [booking.seats.map((seatNumber) => `${booking.busId}${seatNumber}`)]
    const newbooking = await Booking.create({...booking, tickets: tickets.join(", "), luggage: booking.luggage.join(", ")});
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
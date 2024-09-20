'use server'


import { dbConnect } from "../database"
import Booking from "../database/models/booking.model"
import { handleError } from "../utils"

export const booking = async ({booking, path} : {booking: {}, path: React.ReactNode}) => {
try {
    await dbConnect();
    const newbooking = await Booking.create(booking);
    return JSON.parse(JSON.stringify(newbooking));
    
} catch (error) {
    handleError(error);
}
}
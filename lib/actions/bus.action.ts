'use server'

import { ObjectId } from "mongodb";
import { dbConnect } from "../database"
import Bus from "../database/models/bus.model";
import { handleError } from "../utils"

export const getSeats = async ({pickup, date} : {pickup: string, date: string}) => {
try {
    await dbConnect();

    let bus = await Bus.findOne({ pickup: pickup, date: date, isFull: false}, { availableSeats: true, takenSeats: true, _id: true, price: true });
    if (bus) {
        const { availableSeats, takenSeats, _id, price } = bus;
        return { availableSeats, takenSeats, _id: _id.toString(), price };
      
    } else {
        const { availableSeats, takenSeats, _id, price} = await Bus.create({pickup: pickup, date: date, 
            price: (pickup === "Accra")? 152: 162 });
        return { availableSeats, takenSeats, _id: _id.toString(), price};
    }
    
} catch (error) {
    handleError(error);
    return null;
}
}


export const updateSeats = async ({ _id, seatsToBook }: { _id:ObjectId, seatsToBook: string[] }) => {

    await dbConnect();
    Bus.findByIdAndUpdate(_id, {
    $push: { 
        takenSeats: { $each: seatsToBook },     // Adds ['07', '08'] to takenSeats array
    },

    $pull: { 
        availableSeats: { $in: seatsToBook },   // Removes ['07', '08'] from availableSeats
    }
    }, { new: true })
    .then(updatedBus => {
        console.log('Seats updated:', updatedBus);
    })
    .catch(error => {
        console.error('Error updating bus:', error);
    });

        
    }
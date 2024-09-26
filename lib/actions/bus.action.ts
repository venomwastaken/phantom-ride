'use server'

import { ObjectId } from "mongodb";
import { dbConnect } from "../database"
import Bus from "../database/models/bus.model";
import { handleError } from "../utils"

function generateBusId(terminalCode: string, busCount: number, day: string): string {
    return `${terminalCode}${day}${busCount.toString().padStart(3, '0')}`;
  }

export const getSeats = async ({pickup, date} : {pickup: string, date: string}) => {
try {
    await dbConnect();
    

    const bus = await Bus.findOne({ pickup: pickup, date: date, isFull: false}, { availableSeats: true, takenSeats: true, _id: true, price: true, busId:true });
    if (bus) {
        const { availableSeats, takenSeats, _id, price, busId } = bus;
        return { availableSeats, takenSeats, _id: _id.toString(), price, busId };
      
    } else {
        const numberOfBuses = (await Bus.find({pickup:pickup, date:date})).length
        const terminalCode = (pickup==="Tema")? "TM":(pickup==="Accra")? "AC": "AD"
        const day = (date==="Saturday")? "SAT": "SUN"
        const newbusId = generateBusId(terminalCode, numberOfBuses + 1, day)
        const { availableSeats, takenSeats, _id, price, busId} = await Bus.create({pickup: pickup, date: date, 
            price: (pickup === "Accra")? 152: 162, busId:newbusId });
        return { availableSeats, takenSeats, _id: _id.toString(), price, busId};
    }
    
} catch (error) {
    handleError(error);
    return null;
}
}




export const updateSeats = async ({ busId, seatsToBook }: { busId:string, seatsToBook: string[] }) => {

    await dbConnect();
    Bus.findOneAndUpdate({busId:busId}, {
    $push: { 
        takenSeats: { $each: seatsToBook },     // Adds
    },

    $pull: { 
        availableSeats: { $in: seatsToBook },   // Removes
    },
    
    }, { new: true })
    .then(updatedBus => {
        (updatedBus.availableSeats.length === 0) && Bus.findOneAndUpdate({busId:updatedBus.busId}, {isFull: true})
        console.log('Seats updated:', updatedBus);
    })
    .catch(error => {
        console.error('Error updating bus:', error);
    });

        
    }
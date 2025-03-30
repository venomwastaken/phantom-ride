'use server'

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
        const terminalCode = (pickup==="Tema(Community 1)")? "TM":(pickup==="Accra(Circle)")? "AC": "AD"
        const day = (date==="Saturday (26/04/2025)")? "SAT": "FRI"
        const newbusId = generateBusId(terminalCode, numberOfBuses + 1, day)
        const { availableSeats, takenSeats, _id, price, busId} = await Bus.create({pickup: pickup, date: date, 
            price: (pickup === "Accra(Circle)")? 158: 173, busId:newbusId });
        return { availableSeats, takenSeats, _id: _id.toString(), price, busId};
    }
    
} catch (error) {
    handleError(error);
    return null;
}
}




export const updateSeats = async ({ busId, seatsToBook }: { busId: string, seatsToBook: string[] }) => {
    try {
        await dbConnect();

        // Find and update the bus by busId
        const updatedBus = await Bus.findOneAndUpdate(
            { busId }, // or use _id if busId is not a unique field
            {
                $push: { takenSeats: { $each: seatsToBook } }, // Adds to takenSeats
                $pull: { availableSeats: { $in: seatsToBook } } // Removes from availableSeats
            },
            { new: true } // Return the updated document
        );

        if (!updatedBus) {
            throw new Error('Bus not found');
        }

        // Check if all seats are taken and mark bus as full
        if (updatedBus.availableSeats.length === 0) {
            await Bus.findOneAndUpdate({ busId: updatedBus.busId }, { isFull: true });
        }

        console.log('Seats updated:', updatedBus);

    } catch (error) {
        console.error('Error updating bus:', error);
    }
};

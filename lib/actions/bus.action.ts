'use server'

import { dbConnect } from "../database"
import Bus from "../database/models/bus.model";
import { handleError } from "../utils"

function generateBusId(terminalCode: string, busCount: number, day: string): string {
    return `${terminalCode}${day}${busCount.toString().padStart(3, '0')}`;
  }

export const getSeats = async ({pickup, date, location} : {pickup: string, date: string, location: string}) => {

const pickups = [
    "Amasaman",
    "Pokuase (Frimps Oil Filling Station)",
    "Ofankor Barrier",
    "Taifa Junction Bus Stop",
    "Nsawam (Total Filling Station)",
    "Medie"
  ];


//if(date === "Sunday (27/04/2025)"){pickup = "Accra(Circle)";}
try {
    await dbConnect();

    // Shared segment handling
    if (pickups.includes(location)) {

        const temaBuses = await Bus.find({ pickup: "Tema", date });
        const accraBuses = await Bus.find({ pickup: "Accra", date });

        const temaAvailable = temaBuses.filter(b => !b.isFull);
        const accraAvailable = accraBuses.filter(b => !b.isFull);

        // If both are fully booked, just skip to normal logic
        if (temaAvailable.length && accraAvailable.length) {
            const temaTaken = temaAvailable[0].takenSeats;
            const accraTaken = accraAvailable[0].takenSeats;

            // Choose the less loaded bus, with your bias
            if (temaTaken.length + 3 < accraTaken.length) {
                pickup = "Tema";
            } else {
                pickup = "Accra";
            }
        } else if (temaAvailable.length) {
            pickup = "Tema";
        } else if (accraAvailable.length) {
            pickup = "Accra";
        }
        // else: both full → leave pickup unchanged and let normal logic handle
    }


    // if(date === "Sunday (27/04/2025)" && pickup === "Accra(Circle)") {
    //     const bus = await Bus.findOne({ pickup: pickup, date: date}, { availableSeats: true, takenSeats: true, _id: true, price: true, busId:true });
    //     const { availableSeats, takenSeats, _id, price, busId } = bus;
    //     return { availableSeats, takenSeats, _id: _id.toString(), price, busId };
    // }

    const bus = await Bus.findOne({ pickup: pickup, date: date, isFull: false}, { availableSeats: true, takenSeats: true, _id: true, price: true, busId:true });
    if (bus) {
        const { availableSeats, takenSeats, _id, price, busId } = bus;
        return { availableSeats, takenSeats, _id: _id.toString(), price, busId };
    } 
    else {
        const numberOfBuses = (await Bus.find({pickup:pickup, date:date})).length;
        const terminalCode = (pickup==="Tema")? "TM":((pickup==="Adenta")? "AD":((pickup==="Cape Coast/Takoradi")? "CT":"AC"));
        const day = (date==="Friday (05/09/2025)")? "FRI":((date==="Saturday (06/09/2025)")? "SAT":"SUN");
        const newbusId = generateBusId(terminalCode, numberOfBuses + 1, day);
        const { availableSeats, takenSeats, _id, price, busId} = await Bus.create({pickup: pickup, date: date, 
            price: (pickup === "Accra")? 153:((pickup === "Tema")? 173: ((pickup === "Adenta")? 173: 173)), busId:newbusId });
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
        const {takenSeats, availableSeats} = await Bus.findOne({busId:busId}, {takenSeats: true, availableSeats: true});
        if(takenSeats.includes(seatsToBook) && (availableSeats.length >= seatsToBook)) {
            seatsToBook = availableSeats.slice(0, (seatsToBook.length+1));
        }

        // Find and update the bus by busId
        const updatedBus = await Bus.findOneAndUpdate(
            { busId }, 
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

        //console.log('Seats updated:', updatedBus);

    } catch (error) {
        console.error('Error updating bus:', error);
    }
};


export const getBusPrice = async (busId : string) => {
    try {
        await dbConnect();
        const {price} = await Bus.findOne({busId:busId}, {price: true});
        return price;
    } catch (error) {
        console.error('Error getting bus price:', error);
    }
}
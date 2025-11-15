'use server'

import { dbConnect } from "../database"
import Bus from "../database/models/bus.model";
import { handleError } from "../utils"

function generateBusId(terminalCode: string, busCount: number, day: string): string {
    return `${terminalCode}${day}${busCount.toString().padStart(3, '0')}`;
  }

function generateAllSeats(totalSeats: number) {
  return Array.from({ length: totalSeats }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
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
        if (date !== "Friday (05/09/2025)") {
        if (pickups.includes(location)) {

            const temaBuses = await Bus.find({ pickup: "Tema", date });
            const accraBuses = await Bus.find({ pickup: "Accra", date });

            const temaAvailable = temaBuses.filter(b => b.takenSeats.lenght < b.totalSeats);
            const accraAvailable = accraBuses.filter(b => b.takenSeats.lenght < b.totalSeats);

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
        }


        // if(date === "Sunday (27/04/2025)" && pickup === "Accra(Circle)") {
        //     const bus = await Bus.findOne({ pickup: pickup, date: date}, { availableSeats: true, takenSeats: true, _id: true, price: true, busId:true });
        //     const { availableSeats, takenSeats, _id, price, busId } = bus;
        //     return { availableSeats, takenSeats, _id: _id.toString(), price, busId };
        // }

        const bus = await Bus.findOne({ 
                                        pickup: pickup, 
                                        date: date, 
                                        $expr: {$lt: [{$size:"$takenSeats"}, "$totalSeats"]}
                                    }, 
                                    { 
                                        totalSeats: true,
                                        takenSeats: true, 
                                        _id: true, 
                                        price: true, 
                                        busId:true 
                                    });
        if (bus) {
            const { totalSeats, takenSeats, _id, price, busId } = bus;
            return { totalSeats, takenSeats, _id: _id.toString(), price, busId };
        } 
        else {
            const numberOfBuses = (await Bus.find({pickup:pickup, date:date})).length;
            const terminalCode = (pickup==="Tema")? "TM":((pickup==="Adenta")? "AD":((pickup==="Cape Coast/Takoradi")? "CT":"AC"));
            const day = (date==="Friday (05/09/2025)")? "FRI":((date==="Saturday (06/09/2025)")? "SAT":"SUN");
            const newbusId = generateBusId(terminalCode, numberOfBuses + 1, day);
            const { totalSeats, takenSeats, _id, price, busId} = await Bus.create(
                {
                    pickup: pickup, date: date, 
                    price: (pickup === "Accra")? 153:((pickup === "Tema")? 173: ((pickup === "Adenta")? 173: 173)), 
                    busId:newbusId 
                });

            return { totalSeats, takenSeats, _id: _id.toString(), price, busId};
        }
        
    } catch (error) {
        handleError(error);
        return null;
    }
}




export const updateSeats = async ({ busId, seatsToBook }: { busId: string, seatsToBook: string[] }) => {
    try {
        await dbConnect();
        const {taken, totalSeats} = await Bus.findOne({busId:busId}, {takenSeats: true, totalSeats: true});
        const allSeats = generateAllSeats(totalSeats);

        // STEP A — Identify seats already taken
        const alreadyTaken = seatsToBook.filter(seat => taken.includes(seat));

        // STEP B — Determine remaining seats needed
        const seatsNeeded = seatsToBook.length;

        // STEP C — Compute available seats
        const availableSeats = allSeats.filter(seat => !taken.includes(seat));

        if (availableSeats.length < seatsNeeded) {
        throw new Error("Not enough seats available");
        }

        // STEP D — If some seats are taken, auto-replace them
        let finalSeats = [];

        if (alreadyTaken.length > 0) {
            console.log("Seat(s) already taken:", alreadyTaken);

            // Pick the next available seats
            finalSeats = availableSeats.slice(0, seatsNeeded);
        } else {
            finalSeats = seatsToBook;
        }

        // STEP E — Update the bus atomically
        await Bus.findOneAndUpdate(
            { busId },
            { $push: { takenSeats: { $each: finalSeats } } },
        );

        return {
            success: true,
            seatsBooked: finalSeats,
            autoReplaced: alreadyTaken.length > 0,
            replacedSeats: alreadyTaken
        };

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

export const unselectSeats = async ({ busId, seatsToUnselect }: { busId: string, seatsToUnselect: string[] }) => {
    try {
        await dbConnect();
        // Find and update the bus by busId
        const updatedBus = await Bus.findOneAndUpdate(
            { busId },
            {
                $pull: { takenSeats: { $in: seatsToUnselect } }, // Removes from takenSeats
            },
            { new: true } // Return the updated document
        );
        if (!updatedBus) {
            throw new Error('Bus not found');
        }

        //console.log('Seats unselected:', updatedBus);
    } catch (error) {
        console.error('Error unselecting seats:', error);
    }
};


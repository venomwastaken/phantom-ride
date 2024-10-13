'use client'
import { createContext, useContext, useState } from "react"

// type Context {

// }

const BusContext = createContext<any>(undefined);

export default function BusWrapper({children} : {children : React.ReactNode}) {
    const [takenSeats, setTakenSeats] = useState<string[]>([]); // Example of taken seats
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoadingSeats, setIsLoadingSeats] = useState<boolean>(true);
    const [busId, setBusId] = useState<string | undefined>();

    return(
        <BusContext.Provider value = {{takenSeats, setTakenSeats, 
                                       selectedSeats, setSelectedSeats, 
                                       isSubmitting, setIsSubmitting, 
                                       isLoadingSeats, setIsLoadingSeats,
                                       busId, setBusId}}>
            {children}
        </BusContext.Provider>
    )

}

export function useBusContext() {
    return useContext(BusContext)
}
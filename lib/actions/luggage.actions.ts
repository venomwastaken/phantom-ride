'use server'

import { dbConnect } from "../database";
import { handleError } from "../utils";
import LuggagePrice from "../database/models/luggagePrice.model";

export const getLuggagePrice = async (luggage : string[]) => {
    try {
        await dbConnect();

        const prices = await LuggagePrice.find({ name: { $in: luggage } });
        return prices.reduce((total, p) => total + (p.price ?? 0), 0);
        
    } catch (error) {
        return handleError(error);
    }
    }
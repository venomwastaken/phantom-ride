'use server'

import { dbConnect } from "../database";
import { handleError } from "../utils";
import LuggagePrice from "../database/models/luggagePrice.model";

export const getLuggagePrice = async (luggage : {name: string, quantity: number}[]) => {
    try {
        await dbConnect();

        const prices = await LuggagePrice.find({ name: { $in: luggage.map(l => l.name) } });
        const priceMap = new Map(prices.map(p => [p.name, p.price ?? 0]));
        return luggage.reduce((total, item) => {
            const price = priceMap.get(item.name) ?? 0;
            return total + price * item.quantity;
        }, 0);
        
    } catch (error) {
        return handleError(error);
    }
    }
'use server'

import { dbConnect } from "../database";
import MailingList from "../database/models/mailingList.model";
import { handleError } from "../utils";

export const addMail = async (email : string) => {
    try {
        await dbConnect();
        const newmail = await MailingList.create({email});
        return JSON.parse(JSON.stringify(newmail));
        
    } catch (error) {
        return handleError(error);
    }
    }
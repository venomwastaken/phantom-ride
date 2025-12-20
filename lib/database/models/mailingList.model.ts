import { Schema, Document, model, models } from "mongoose";

export interface IMailingList extends Document {
  email: string;
}

const MailingListSchema: Schema = new Schema({
  email: { type: String, required: true },
});


const MailingList = models.MailingList || model('MailingList', MailingListSchema);

export default MailingList;

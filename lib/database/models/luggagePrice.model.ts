import { Schema, Document, model, models } from "mongoose";

export interface ILuggagePrice extends Document {
  name: string;
  price: number;
}

const LuggagePriceSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});


const LuggagePrice = models.LuggagePrice || model('LuggagePrice', LuggagePriceSchema);

export default LuggagePrice;

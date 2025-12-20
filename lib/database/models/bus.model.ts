import{ Schema, models, model } from 'mongoose';


export interface IBus extends Document {
  busId: string;
  pickup: string;
  date: string;
  totalSeats: number;
  takenSeats: string[];
  price: number; 
};




const BusSchema: Schema = new Schema<IBus>({
  busId : {type: String, required: true},
  pickup: { type: String, required: true },
  date: {type: String, required: true},

  totalSeats: {type: Number, default: 34},

  takenSeats: {type: [String], default: []},

  price: {type: Number, require: true}
});

const Bus= models.Bus || model<IBus>('Bus', BusSchema);

export default Bus;
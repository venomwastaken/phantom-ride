import{ Schema, models, model } from 'mongoose';


export interface IBus extends Document {
  _id: string,
  busId: string;
  pickup: string;
  date: string;
  isFull: boolean;
  availableSeats: string[];
  takenSeats: string[];
  price: number; 
};




const BusSchema: Schema = new Schema({
  busId : {type: String, required: true},
  pickup: { type: String, required: true },
  date: {type: String, required: true},
  isFull: {type: Boolean, default: false},
  availableSeats: {
    type: [String],
    default: ["01","02","03","04","05","06","07","08","09","10",
              "11","12","13","14","15","16","17","18","19","20",
              "21","22","23","24","25","26","27","28","29","30",
              "31","32","33","34"
    ],
  },
  takenSeats: {type: [String], default: []},
  price: {type: Number, require: true}
});

const Bus= models.Bus || model<IBus>('Bus', BusSchema);

export default Bus;
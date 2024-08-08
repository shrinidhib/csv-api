import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  utc_time: {
    type: Date,
    required: true,
  },
  operation: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  base_coin: {
    type: String,
    required: true,
  },
  quote_coin: {
    type: String,
    required: true,
  },
  buy_sell_amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Trade = mongoose.model('Trade', TradeSchema);

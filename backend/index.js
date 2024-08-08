import express from "express";
import { connectDB } from "./database/mongoConnection.js";
import dotenv from "dotenv"
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { Trade } from "./database/models/Trade.js";
import { error } from "console";
dotenv.config()
const app = express()
const upload = multer({ dest: 'uploads/' });

app.use(express.json())
//to upload csv data to mongodb database
app.post('/upload', upload.single('file'), async(req, res) => {
  const filePath = path.join(process.cwd(), req.file.path);
  try{
    await connectDB();
    let trades = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        //console.log(row)
      const [base_coin, quote_coin] = row.Market.split('/');
      const trade = new Trade({
        utc_time: new Date(row.UTC_Time),
        operation: row.Operation.toLowerCase(),
        base_coin,
        quote_coin,
        buy_sell_amount: parseFloat(row['Buy/Sell Amount']),
        price: parseFloat(row.Price),
      });
      trades.push(trade);
    })
    .on('end', () => {
      Trade.insertMany(trades)
        .then(() => {
          fs.unlinkSync(filePath); 
          res.status(200).json({ message: 'CSV data successfully uploaded and stored in the database' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Error storing data' });
        });
    });
  }
  catch(e){
    res.status(500).json({message: "Error in DB Connection"})
  }
  
});

//fetch all trades for display
app.get('/all', async(req,res)=>{
    try{
        await connectDB();
        const trades = await Trade.find()
        res.status(200).json({trades})
    }
    catch(e){
        res.status(500).json({message: e})
    }
})

//return balance at given time
app.post('/balance', async(req,res)=>{
  try{
    await connectDB()
    console.log(req.body)
    const {timestamp} = req.body;
    const date = new Date(timestamp)

    const trades = await Trade.find({utc_time: {$lte: date}})
    console.log(trades)
    const balances = {}
    trades.forEach((trade)=>{
      const {base_coin, operation,buy_sell_amount } = trade;

      if (!balances[base_coin]){
        balances[base_coin]=0;
      }
      
      if (operation==='buy'){
        //add balance
        balances[base_coin]+=buy_sell_amount
      }
      else{
        //subtract balance
        balances[base_coin]-=buy_sell_amount
      }
    })
    res.status(200).json(balances)
  }
  catch(e){
    console.log(e)
    res.status(500).json({error: "Error calculating balances"})
  }

})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
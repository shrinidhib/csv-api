import express from "express";
import { connectDB } from "./database/mongoConnection.js";
import dotenv from "dotenv"
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { Trade } from "./database/models/Trade.js";
dotenv.config()
const app = express()
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async(req, res) => {
  const filePath = path.join(process.cwd(), req.file.path);
  try{
    await connectDB();
    let trades = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        console.log(row)
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

app.get('/all', async(req,res)=>{
    try{
        await connectDB();
        const trades = await Trade.find()
        res.status(200).json({db: trades})
    }
    catch(e){
        res.status(500).json({message: e})
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
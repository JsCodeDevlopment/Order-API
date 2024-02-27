import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import path from "node:path";
import { router } from "./routes";
import { corsOptions } from './app/middlewares/Cors';
import cors from 'cors'

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log('👌 Mongodb connection started!')
    const app = express();

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(router)
    app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")))

    app.listen(3333, () => {
      console.log("🏴‍☠️ Server is running on http://localhost:3333");
    });
  })
  .catch((err) => console.log(err, "error to connect at mongodb"));

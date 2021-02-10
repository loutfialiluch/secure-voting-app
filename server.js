import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import CORouter from "./CO.js";
import DORouter from "./DE.js";

const CO_PORT = process.env.PORT | 5000;
const DE_PORT = process.env.PORT | 5001;
const COServer = express();
const DEServer = express();
COServer.use(cors());
DEServer.use(cors());
COServer.use(express.json());
DEServer.use(express.json());

const uri = "YOUR MONGODB URI";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    COServer.listen(CO_PORT, () => {
      console.log(`COServer started running on PORT ${CO_PORT}`);
    });
    DEServer.listen(DE_PORT, () => {
      console.log(`DEServer started running on PORT ${DE_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
COServer.use("/CO", CORouter);
DEServer.use("/DE", DORouter);

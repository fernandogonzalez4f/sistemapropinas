import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import tipsRouter from "./routes/tips.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/tips", tipsRouter);

mongoose
  .connect("mongodb://localhost:27017/propinas")
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión a MongoDB:", err));

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
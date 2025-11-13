import { Schema, model } from "mongoose";

interface DistribucionItem {
  nombre: string;
  monto: number;
}

interface TipDoc {
  total: number;
  periodo: string;
  metodoPago?: string;
  distribucion?: DistribucionItem[];
  fecha: Date;
}

const tipSchema = new Schema<TipDoc>({
  total: { type: Number, required: true },
  periodo: { type: String, required: true },
  metodoPago: { type: String },
  distribucion: [{ nombre: String, monto: Number }],
  fecha: { type: Date, default: Date.now },
});

export const Tip = model<TipDoc>("Tip", tipSchema);

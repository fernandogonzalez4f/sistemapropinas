import { Request, Response } from "express";
import { Tip } from "../models/tip.model";

// Registrar propina
export const addTip = async (req: Request, res: Response) => {
  try {
    const { total, periodo } = req.body;

    if (!total || !periodo) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const nuevaPropina = new Tip({
      total,
      periodo,
      fecha: new Date(),
    });

    await nuevaPropina.save();

    res.status(201).json({
      mensaje: "Se ha registrado correctamente la propina",
      data: {
        id: nuevaPropina._id,
        total: nuevaPropina.total,
        periodo: nuevaPropina.periodo,
        fecha: nuevaPropina.fecha.toISOString().split("T")[0],
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar la propina", error: error.message });
  }
};

// Dividir propinas
export const dividirPropinas = (req: Request, res: Response) => {
  const { total, empleados } = req.body;

  if (!total || !empleados || empleados.length === 0) {
    return res.status(400).json({ mensaje: "Datos incompletos" });
  }

  const sumaPorcentajes = empleados.reduce((s: number, e: any) => s + e.porcentaje, 0);

  const distribucion = empleados.map((e: any) => {
    const ratio = e.porcentaje / sumaPorcentajes;
    const monto = Math.round((total * ratio + Number.EPSILON) * 100) / 100;
    return { nombre: e.nombre, monto };
  });

  res.json({ total, distribucion });
};

// Pagar propinas
export const pagarPropinas = async (req: Request, res: Response) => {
  try {
    const { total, periodo, metodoPago, distribucion } = req.body;

    if (!total || !periodo || !metodoPago || !distribucion || distribucion.length === 0) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const nuevaPropina = new Tip({
      total,
      periodo,
      metodoPago,
      distribucion,
      fecha: new Date(),
    });

    await nuevaPropina.save();

    const recibo = {
      id: nuevaPropina._id,
      fecha: nuevaPropina.fecha.toISOString(),
      total: nuevaPropina.total,
      metodoPago: nuevaPropina.metodoPago,
      distribucion: nuevaPropina.distribucion,
    };

    res.status(201).json({
      mensaje: "Propinas pagadas y registradas correctamente",
      recibo
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el pago de propinas", error: error.message });
  }
};

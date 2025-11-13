import { Router } from "express";
import { addTip, dividirPropinas, pagarPropinas } from "../controllers/tips.controller";

const router = Router();

router.post("/", addTip);
router.post("/dividir", dividirPropinas);
router.post("/pagar", pagarPropinas);

export default router;
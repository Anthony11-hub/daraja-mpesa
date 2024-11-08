import { Router } from "express";
import { callback, stkPush } from "../controllers/logic";
import { generateToken } from "../middleware/MPESAToken";
const router = Router();

router.post("/stk", generateToken, stkPush);
router.post("/callback", callback);

export default router;

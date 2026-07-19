import { Router } from "express";
import { customers } from "../data/customers.js";

const router = Router();

router.get("/customers", (_req, res) => {
  res.json(customers);
});

export default router;

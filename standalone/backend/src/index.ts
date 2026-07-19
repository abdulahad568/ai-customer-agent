import "dotenv/config";
import express from "express";
import cors from "cors";
import customersRouter from "./routes/customers.js";
import ticketsRouter from "./routes/tickets.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", customersRouter);
app.use("/api", ticketsRouter);
app.use("/api", dashboardRouter);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
});
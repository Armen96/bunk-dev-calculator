import express from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import {expensesCalculator} from "./lib.js";
const app = express()

// Parse application/json
app.use(bodyParser.json());
// Cors allow for localhost:4200
app.use(cors({origin: 'http://localhost:4200'}))

// POST /payouts
app.post('/payouts', function (req, res) {
  if (!req.body.expenses) {
    res.sendStatus(400);
    return;
  }

  const response = expensesCalculator(req.body.expenses);

  res.send(response);
});

export default app

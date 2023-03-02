import request from 'supertest';
import app from './app.js';
import {expensesCalculator} from "./lib.js";

/**
 * E2E Tests: HTTP statuses and requests/responses
 */
describe("POST /payouts", () => {
  describe("given a expenses param", () => {
    const bodyData = {expenses: []};

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      expect(response.statusCode).toBe(200)
    })

    test("should respond with a valid body response", async () => {
      const response = await request(app).post("/payouts").send(bodyData)

      const expected = {total: 0, equalShare: 0, payouts: []}
      expect(response.body).toMatchObject(expected)
    })

    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
  });

  describe("when the expenses param is missing", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = {data: []};

      const response = await request(app).post("/payouts").send(bodyData)
      expect(response.statusCode).toBe(400)
    })
  });

  describe("Holiday expenses calculator case 1: No member", () => {
    const bodyData = {
      expenses: []
    };

    /**
     * Should return blank response
     */
    test("should respond correct response", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      const body = response.body;

      expect(body.total).toBe(0);
      expect(body.equalShare).toBe(0);
      expect(body.payouts.length).toBe(0);
    })
  });

  describe("Holiday expenses calculator case 2: 2 members", () => {
    const bodyData = {
      expenses: [
        {name: "Adriana", amount: 5.75},
        {name: "Adriana", amount: 5.75},
        {name: "Bao", amount: 12}
      ]
    };

    /**
     * Adriana = 11.5
     * Bao = 12
     *
     * Total = (5.75 + 5.75 + 12) = 23.5
     * Equal Share = Total / Members Count =  23.5 / 2 = 11.75
     * Bao should gave/take 0.25 to be equal with Adriana
     */
    test("should respond correct response", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      const body = response.body;

      expect(body.total).toBe(23.5);
      expect(body.equalShare).toBe(11.75);
      expect(body.payouts.length).toBe(1);
      expect(body.payouts[0].owes).toBe('Adriana');
      expect(body.payouts[0].owed).toBe('Bao');
      expect(body.payouts[0].amount).toBe(0.25);
    })
  });

  describe("Holiday expenses calculator case 3: 1 member", () => {
    const bodyData = {
      expenses: [
        {name: "Bao", amount: 12}
      ]
    };

    /**
     * Bao = 12
     *
     * Should return empty payouts
     */
    test("should respond correct response", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      const body = response.body;

      expect(body.total).toBe(12);
      expect(body.equalShare).toBe(12);
      expect(body.payouts.length).toBe(0);
    })
  });

  describe("Holiday expenses calculator case 4: 4 members", () => {
    const bodyData = {
      expenses: [
        {name: "Adriana", amount: 5.75},
        {name: "Adriana", amount: 5.75},
        {name: "Bao", amount: 12},
        {name: "Mark", amount: 6},
        {name: "Diana", amount: 3},
      ]
    };

    /**
     * Adriana = 11.5
     * Bao = 12
     * Mark = 6
     * Diana = 3
     *
     * Total = (5.75 + 5.75 + 12 + 6 + 3) = 32.5
     * Equal Share = Total / Members Count =  32.5 / 4 = 8.125
     *
     * Step 1
     * Mark takes 2.125 from Adriana (Mark = 8.125 | Adriana = 9.375 | Bao = 12 | Diana = 3 )
     *
     * Step 2
     * Diana takes 3.875 from Bao (Mark = 8.125 | Adriana = 9.375 | Bao = 8.125 | Diana = 6.875 )
     *
     * Step 3
     * Diana takes 1.25 from Adriana (Mark = 8.125 | Adriana = 8.125 | Bao = 8.125 | Diana = 8.125 )
     *
     */
    test("should respond correct response", async () => {
      const response = await request(app).post("/payouts").send(bodyData)
      const body = response.body;

      expect(body.total).toBe(32.5);
      expect(body.equalShare).toBe(8.125);
      expect(body.payouts.length).toBe(3);

      // Step 1
      expect(body.payouts[0].owes).toBe('Mark');
      expect(body.payouts[0].owed).toBe('Adriana');
      expect(body.payouts[0].amount).toBe(2.125);

      // Step 2
      expect(body.payouts[1].owes).toBe('Diana');
      expect(body.payouts[1].owed).toBe('Bao');
      expect(body.payouts[1].amount).toBe(3.875);

      // Step 3
      expect(body.payouts[2].owes).toBe('Diana');
      expect(body.payouts[2].owed).toBe('Adriana');
      expect(body.payouts[2].amount).toBe(1.25);
    })
  });
})

/**
 * Unit Tests
 */
describe("Function Test: expensesCalculator", () => {
  describe("Holiday expenses calculator case 1: 2 members", () => {
    const bodyData = {
      expenses: [
        {name: "Bao", amount: 12},
        {name: "Mark", amount: 6}
      ]
    };

    /**
     * Bao = 12
     * Mark = 6
     *
     * Total = (12 + 6) = 18
     * Equal Share = Total / Members Count =  18 / 2 = 9
     *
     * Mark takes 3 from Bao (Mark = 9 | Bao = 9 )
     */
    test("should respond correct response", async () => {
      const body = expensesCalculator(bodyData.expenses);

      expect(body.total).toBe(18);
      expect(body.equalShare).toBe(9);
      expect(body.payouts.length).toBe(1);

      expect(body.payouts[0].owes).toBe('Mark');
      expect(body.payouts[0].owed).toBe('Bao');
      expect(body.payouts[0].amount).toBe(3);
    })
  });
});




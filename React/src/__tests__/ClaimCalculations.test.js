import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ClaimCalculations from "../ClaimCalculations";

describe("ClaimCalculations Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockReturnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            {
              name: "Insurer A",
              email: "insurerA@example.com",
              phone: "123-456-7890",
              address: "123 Main St",
              payout: "1000",
            },
            {
              name: "Insurer B",
              email: "insurerB@example.com",
              phone: "987-654-3210",
              address: "456 Elm St",
              payout: "2000",
            },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders table with fetched data", async () => {
    render(
      <Router>
        <ClaimCalculations />
      </Router>
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8001/Climate_Bind_Development/claim_calculations.php",
      {
        method: "GET",
        credentials: "include",
      }
    );

    await waitFor(() => {
      expect(screen.getByText("Name of your insurer")).toBeInTheDocument();
      expect(screen.getByText("Their email address")).toBeInTheDocument();
      expect(screen.getByText("Phone number")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
      expect(
        screen.getByText("The amount they owe you USD $")
      ).toBeInTheDocument();

      expect(screen.getByText("Insurer A")).toBeInTheDocument();
      expect(screen.getByText("insurerA@example.com")).toBeInTheDocument();
      expect(screen.getByText("123-456-7890")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("1000")).toBeInTheDocument();

      expect(screen.getByText("Insurer B")).toBeInTheDocument();
      expect(screen.getByText("insurerB@example.com")).toBeInTheDocument();
      expect(screen.getByText("987-654-3210")).toBeInTheDocument();
      expect(screen.getByText("456 Elm St")).toBeInTheDocument();
      expect(screen.getByText("2000")).toBeInTheDocument();
    });
  });
});

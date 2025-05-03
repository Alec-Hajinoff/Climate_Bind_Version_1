import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PayorData from "../PayorData";

test("renders PayorData component with correct text", () => {
  render(
    <MemoryRouter>
      <PayorData />
    </MemoryRouter>
  );

  const paragraphElement = screen.getByText(
    /ongoing insurance claim that you are requested to pay/i
  );
  expect(paragraphElement).toBeInTheDocument();

  const calculationsElement = screen.getByText(/Claimant name/i);
  expect(calculationsElement).toBeInTheDocument();
});

import React from "react";
import { render, screen } from "@testing-library/react";
import SubmittedClaim from "../SubmittedClaim";

jest.mock("../ClaimCalculations.js", () => () => (
  <div>Mocked Claim Calculations</div>
));

describe("SubmittedClaim Component", () => {
  test("renders the thank you message and ClaimCalculations component", () => {
    render(<SubmittedClaim />);

    const thankYouMessage = screen.getByText(
      /Thank you for submitting your insurance claim!/i
    );
    expect(thankYouMessage).toBeInTheDocument();

    const mockedClaimCalculations = screen.getByText(
      /Mocked Claim Calculations/i
    );
    expect(mockedClaimCalculations).toBeInTheDocument();
  });
});

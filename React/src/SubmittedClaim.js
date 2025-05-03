import React from "react";
import blue from "./blue.svg";
import "./SubmittedClaim.css";
import UserLogin from "./UserLogin.js";
import ClaimCalculations from "./ClaimCalculations.js";

function SubmittedClaim() {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12">
          <p>
            Thank you for submitting your insurance claim! Below, you will find
            a list of your insurers, the amounts they owe you, and their contact
            details. Please reach out to them directly to arrange your claim
            payout.
          </p>
          <ClaimCalculations />
        </div>
      </div>
    </div>
  );
}

export default SubmittedClaim;

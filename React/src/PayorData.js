import React from "react";
import blue from "./blue.svg";
import "./PayorData.css";
import UserLogin from "./UserLogin.js";
import PayorCalculations from "./PayorCalculations.js";

function PayorData() {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12">
          <p>
            There’s an ongoing insurance claim that you are requested to pay as
            part of your peer-to-peer insurance commitment. You’ll find all the
            details of the claim below. Please contact the claimant to arrange
            payment within 15 calendar days to keep everything running smoothly.
            Thanks for your prompt attention!
          </p>
          <PayorCalculations />
        </div>
      </div>
    </div>
  );
}

export default PayorData;

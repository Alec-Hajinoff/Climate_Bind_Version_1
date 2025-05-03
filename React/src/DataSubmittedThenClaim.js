import React from "react";
import blue from "./blue.svg";
import "./DataSubmittedThenClaim.css";
import UserLogin from "./UserLogin.js";
import ClaimDataCapture from "./ClaimDataCapture.js";

function DataSubmittedThenClaim() {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12">
          <p>
            If you'd like to make a claim please fill in the form below. You
            certify that the information provided in your claim is true and
            accurate to the best of your knowledge. You acknowledge and agree
            that your claim is subject to the laws of your country of residence.
          </p>
          <ClaimDataCapture />
        </div>
      </div>
    </div>
  );
}

export default DataSubmittedThenClaim;

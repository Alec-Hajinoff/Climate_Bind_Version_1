import React from "react";
//import blue from "./blue.svg";
import "./Main.css";

function Main() {
  return (
    <div>
      <p>
        Climate Bind is an open-source, free-to-use peer-to-peer insurance web
        application offering insurance cover for damage to residential buildings
        caused by severe weather events.
      </p>

      <p>
        Peer-to-peer insurance is where policyholders insure each other without
        an insurance company between them. This insurance model has its pluses
        and minuses, and our platform aims to maximise the benefits while
        reducing the disadvantages. This type of insurance may better suit
        policyholders who cannot insure their property through traditional
        insurance, or where such insurance is expensive.
      </p>

      <p>
        Our insurance service is free to use because we don't actually accept
        insurance premiums, and we don't pay them out. We merely act as a
        matching engine between those claiming and those insuring. If two
        different policyholders insure each other, they each make a legally
        binding commitment to insure one another (up to the amount they
        themselves set). The higher the amount a policyholder can pay out to
        another, the higher the amount they can themselves claim.
      </p>

      <p>
        The application is currently in beta phase. Please note that if you lose
        your account password, you will need to create a new account, as
        password recovery is not yet available. If you encounter any technical
        difficulties while using the application, please contact us via email,
        and we will assist you as soon as possible. Thank you for your support
        and feedback during this beta phase!
      </p>
    </div>
  );
}

export default Main;

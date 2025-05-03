//import logo from './logo.svg';
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import MainRegLog from "./MainRegLog";
import Footer from "./Footer";
import RegisteredPage from "./RegisteredPage";
import AccountPage from "./AccountPage";
import DataSubmittedThenClaim from "./DataSubmittedThenClaim";
import SubmittedClaim from "./SubmittedClaim";
import AccountDataCapture from "./AccountDataCapture";
import PayorData from "./PayorData";
import LogoutComponent from "./LogoutComponent";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainRegLog />} />
          <Route path="RegisteredPage" element={<RegisteredPage />} />
          <Route path="AccountPage" element={<AccountPage />} />
          <Route path="DataSubmittedThenClaim" element={<DataSubmittedThenClaim />} /> 
          <Route path="AccountDataCapture" element={<AccountDataCapture />} />
          <Route path="SubmittedClaim" element={<SubmittedClaim />} />
          <Route path="PayorData" element={<PayorData />} />
          <Route path="LogoutComponent" component={LogoutComponent} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import "./AccountDataCapture.css";
import { useNavigate } from "react-router-dom";
import LogoutComponent from "./LogoutComponent";
import { captureAccountData } from "./ApiService";

function AccountDataCapture() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    last_name: "",
    date_of_birth: "",
    passport_copy: null,
    phone: "",
    national_insurance: "",
    address: "",
    images: null,
    ownership_proof: null,
    date_of_construction: "",
    square_footage: null,
    type_home: "",
    building_materials: "",
    number_levels: null,
    roof_type: "",
    heating_systems: "",
    safety_features: "",
    home_renovations: "",
    mortgage_lender: "",
    current_previous_insurance: "",
    list_previous_disasters: "",
    monthly_premium: null,
    bank_account_number: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await captureAccountData(formData);
      if (data.success) {
        navigate("/DataSubmittedThenClaim");
      } else {
        setErrorMessage("Submission failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center">
      <div>
        <p>
          To initiate your insurance policy, please complete the form below.
          Please be advised that the insurance cover you provide to another user
          constitutes a legally binding commitment. You agree to process and
          make payment for any valid claim within ten working days of receiving
          a formal pay-out request, which will be sent via email. You warrant
          that the information provided in the form below is accurate to the
          best of your knowledge. You agree to be bound by the laws of your
          country of residence as well as the laws of the country in which the
          claimant is based.
        </p>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <form onSubmit={handleSubmit}>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row" className="col-8 align-middle">
                <label htmlFor="surname">Surname</label>
              </th>
              <td className="col-8">
                <input
                  id="surname"
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  pattern="[a-zA-Z ]+"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Date of birth
              </th>
              <td>
                <input
                  type="date"
                  className="form-control"
                  autoComplete="off"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Upload passport copy (page showing photo)
              </th>
              <td>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,.pdf"
                  name="passport_copy"
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                <label htmlFor="phone">Phone number</label>
              </th>
              <td>
                <input
                  id="phone"
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                National insurance number
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(or National security number)"
                  name="national_insurance"
                  value={formData.national_insurance}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Address of the property you are insuring (must be your home
                address)
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(including the post code or zip code)"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Upload an external image of the property
              </th>
              <td>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,.pdf"
                  name="images"
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Upload proof of ownership (page showing your name)
              </th>
              <td>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,.pdf"
                  name="ownership_proof"
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Date of the construction of the property
              </th>
              <td>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_construction"
                  autoComplete="off"
                  value={formData.date_of_construction}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Square footage of the property
              </th>
              <td>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  name="square_footage"
                  autoComplete="off"
                  value={formData.square_footage}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Type of home
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g., semi-detached, townhouse, flat, etc.)"
                  name="type_home"
                  autoComplete="off"
                  value={formData.type_home}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Building materials
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g., wood, brick, etc.)"
                  name="building_materials"
                  autoComplete="off"
                  value={formData.building_materials}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Number of stories or levels
              </th>
              <td>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  name="number_levels"
                  autoComplete="off"
                  value={formData.number_levels}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Roof type and age
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g., shingle, tile, etc.)"
                  name="roof_type"
                  autoComplete="off"
                  value={formData.roof_type}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Heating, electrical, and plumbing systems
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(age, type, and condition)"
                  name="heating_systems"
                  autoComplete="off"
                  value={formData.heating_systems}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Safety features
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g., smoke detectors, fire extinguishers, deadbolt locks, etc.)"
                  name="safety_features"
                  autoComplete="off"
                  value={formData.safety_features}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Home improvements or renovations
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(e.g., updated plumbing, new roof, etc.)"
                  name="home_renovations"
                  autoComplete="off"
                  value={formData.home_renovations}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Mortgage balance & lender information
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  placeholder="(type 'not mortgaged' if not applicable)"
                  name="mortgage_lender"
                  autoComplete="off"
                  value={formData.mortgage_lender}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Current and/or previous insurance provider and policy details
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="current_previous_insurance"
                  autoComplete="off"
                  placeholder="(type 'not insured' if not applicable)"
                  value={formData.current_previous_insurance}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                List of previous natural disasters for the location
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="list_previous_disasters"
                  autoComplete="off"
                  placeholder="(type 'unknown' if not applicable)"
                  value={formData.list_previous_disasters}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Amount of cover you can offer USD $. This is the maximum
                amount you can pay out in the event of a claim. The maximum you
                can claim is 100 times of this amount.
              </th>
              <td>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  name="monthly_premium"
                  autoComplete="off"
                  value={formData.monthly_premium}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <th scope="row" className="align-middle">
                Bank account details of where the amount that you offer to pay
                out is held
              </th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="bank_account_number"
                  placeholder="(name of the bank, sort code, account number)"
                  autoComplete="off"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-end mb-3">
          <div id="error-message" className="error" aria-live="polite">
            {errorMessage}
          </div>
          <button type="submit" className="btn btn-secondary" id="loginBtnOne">
            Submit
            <span
              role="status"
              aria-hidden="true"
              id="spinnerLogin"
              style={{ display: loading ? "inline-block" : "none" }}
            ></span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountDataCapture;
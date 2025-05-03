import React, { useState, useEffect } from "react";
import "./PayorCalculations.css";
import LogoutComponent from "./LogoutComponent";
import { fetchPayorCalculations } from "./ApiService"; 

function PayorCalculations() {
  const [addressData, setAddressData] = useState({});
  const [claimData, setClaimData] = useState({});
  const [claimDocuments, setClaimDocuments] = useState({});
  const [propertyData, setPropertyData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPayorCalculations(); 
        setAddressData(data);

        if (data && data.claim_data) {
          setClaimData(data.claim_data);
        }

        if (data && data.claim_documents) {
          setClaimDocuments(data.claim_documents);
        }

        if (data && data.property_data) {
          setPropertyData(data.property_data);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container text-center">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th style={{ width: "33%" }}>Claim amount USD $</th>
            <td style={{ width: "67%" }}>
              {addressData.claims_payor_amount || "No amount found"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Claimant name</th>
            <td style={{ width: "67%" }}>
              {addressData.full_name || "No name found"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Their email address</th>
            <td style={{ width: "67%" }}>
              {addressData.email || "No email found"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Phone number</th>
            <td style={{ width: "67%" }}>
              {addressData.phone || "No phone found"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Address</th>
            <td style={{ width: "67%" }}>
              {addressData.address || "No address found"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Incident date</th>
            <td style={{ width: "67%" }}>
              {claimData.incident_date || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Claim submission date</th>
            <td style={{ width: "67%" }}>
              {claimData.submission_date || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Cause of damage/loss</th>
            <td style={{ width: "67%" }}>
              {claimData.damage_cause || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>List of damaged items</th>
            <td style={{ width: "67%" }}>
              {claimData.damaged_items || "None listed"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Contractor repair estimates</th>
            <td style={{ width: "67%" }}>
              {claimData.contractor_repair_estimates ? (
                <img
                  src={`data:image/jpeg;base64,${claimData.contractor_repair_estimates}`}
                  alt="Contractor Repair Estimates"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              Bank account number where to send payment
            </th>
            <td style={{ width: "67%" }}>
              {claimData.bank_account || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Local authority report</th>
            <td style={{ width: "67%" }}>
              {claimDocuments.local_authority_report ? (
                <img
                  src={`data:image/jpeg;base64,${claimDocuments.local_authority_report}`}
                  alt="Local Authority Report"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Photographs</th>
            <td style={{ width: "67%" }}>
              {claimDocuments.photographs ? (
                <img
                  src={`data:image/jpeg;base64,${claimDocuments.photographs}`}
                  alt="Photographs"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Receipts of damaged items</th>
            <td style={{ width: "67%" }}>
              {claimDocuments.damaged_items_receipts ? (
                <img
                  src={`data:image/jpeg;base64,${claimDocuments.damaged_items_receipts}`}
                  alt="Damaged Items Receipts"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Property images</th>
            <td style={{ width: "67%" }}>
              {propertyData.images ? (
                <img
                  src={`data:image/jpeg;base64,${propertyData.images}`}
                  alt="Property Images"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Proof of ownership</th>
            <td style={{ width: "67%" }}>
              {propertyData.ownership_proof ? (
                <img
                  src={`data:image/jpeg;base64,${propertyData.ownership_proof}`}
                  alt="Ownership Proof"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                "Not provided"
              )}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              Date of the construction of the property
            </th>
            <td style={{ width: "67%" }}>
              {propertyData.date_of_construction || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Square footage of the property</th>
            <td style={{ width: "67%" }}>
              {propertyData.square_footage || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Type of home</th>
            <td style={{ width: "67%" }}>
              {propertyData.type_home || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Building materials</th>
            <td style={{ width: "67%" }}>
              {propertyData.building_materials || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Number of stories or levels</th>
            <td style={{ width: "67%" }}>
              {propertyData.number_levels || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Roof type and age</th>
            <td style={{ width: "67%" }}>
              {propertyData.roof_type || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              Heating, electrical, and plumbing systems
            </th>
            <td style={{ width: "67%" }}>
              {propertyData.heating_systems || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Safety features</th>
            <td style={{ width: "67%" }}>
              {propertyData.safety_features || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>Home improvements or renovations</th>
            <td style={{ width: "67%" }}>
              {propertyData.home_renovations || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              Mortgage balance USD $ & lender information
            </th>
            <td style={{ width: "67%" }}>
              {propertyData.mortgage_lender || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              Current and/or previous insurance provider and policy details
            </th>
            <td style={{ width: "67%" }}>
              {propertyData.current_previous_insurance || "Not provided"}
            </td>
          </tr>
          <tr>
            <th style={{ width: "33%" }}>
              List of previous natural disasters for the location
            </th>
            <td style={{ width: "67%" }}>
              {propertyData.list_previous_disasters || "Not provided"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PayorCalculations;
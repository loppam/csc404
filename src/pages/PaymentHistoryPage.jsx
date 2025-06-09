import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { FaHistory, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

const SERVICES = {
  "birth-certificate": {
    name: "Birth Certificate",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "nin", label: "National Identification Number (NIN)" },
      { name: "dateOfBirth", label: "Date of Birth" },
      { name: "gender", label: "Gender" },
      { name: "placeOfBirth", label: "Place of Birth" },
      { name: "fatherName", label: "Father's Name" },
      { name: "motherName", label: "Mother's Name" },
      { name: "fatherOccupation", label: "Father's Occupation" },
      { name: "motherOccupation", label: "Mother's Occupation" },
      { name: "address", label: "Residential Address" },
      { name: "stateOfOrigin", label: "State of Origin" },
      { name: "lga", label: "Local Government Area" },
    ],
  },
  "tax-receipt": {
    name: "Tax Receipt",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "taxId", label: "Tax ID" },
      { name: "amount", label: "Amount Paid" },
      { name: "paymentDate", label: "Payment Date" },
      { name: "paymentPurpose", label: "Payment Purpose" },
    ],
  },
  "marriage-certificate": {
    name: "Marriage Certificate",
    fields: [
      { name: "husbandName", label: "Husband's Full Name" },
      { name: "wifeName", label: "Wife's Full Name" },
      { name: "husbandNin", label: "Husband's NIN" },
      { name: "wifeNin", label: "Wife's NIN" },
      { name: "marriageDate", label: "Date of Marriage" },
      { name: "marriageVenue", label: "Marriage Venue" },
      { name: "witness1", label: "First Witness Name" },
      { name: "witness2", label: "Second Witness Name" },
    ],
  },
  "death-certificate": {
    name: "Death Certificate",
    fields: [
      { name: "deceasedName", label: "Deceased Full Name" },
      { name: "dateOfDeath", label: "Date of Death" },
      { name: "placeOfDeath", label: "Place of Death" },
      { name: "causeOfDeath", label: "Cause of Death" },
      { name: "informantName", label: "Informant's Name" },
      { name: "informantRelationship", label: "Relationship to Deceased" },
    ],
  },
  "business-registration": {
    name: "Business Registration",
    fields: [
      { name: "businessName", label: "Business Name" },
      { name: "businessType", label: "Business Type" },
      { name: "registrationNumber", label: "Registration Number" },
      { name: "ownerName", label: "Owner's Name" },
      { name: "ownerNin", label: "Owner's NIN" },
      { name: "businessAddress", label: "Business Address" },
      { name: "registrationDate", label: "Registration Date" },
    ],
  },
  "passport-application": {
    name: "Passport Application",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "nin", label: "NIN" },
      { name: "dateOfBirth", label: "Date of Birth" },
      { name: "gender", label: "Gender" },
      { name: "passportType", label: "Passport Type" },
      { name: "address", label: "Current Address" },
      { name: "emergencyContact", label: "Emergency Contact" },
    ],
  },
  "driver-license-renewal": {
    name: "Driver's License Renewal",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "licenseNumber", label: "Current License Number" },
      { name: "expiryDate", label: "Current License Expiry Date" },
      { name: "address", label: "Current Address" },
      { name: "phoneNumber", label: "Phone Number" },
      { name: "bloodGroup", label: "Blood Group" },
    ],
  },
};

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (auth.currentUser) {
          const q = query(
            collection(db, "requests"),
            where("userId", "==", auth.currentUser.uid),
            where("paymentStatus", "==", "paid"), // Filter for paid requests
            orderBy("timestamp", "desc")
          );
          const querySnapshot = await getDocs(q);
          const paymentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPayments(paymentsData);
        }
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to load payment history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generateCertificate = (data, serviceType) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

    // Add header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("FEDERAL REPUBLIC OF NIGERIA", pageWidth / 2, margin + 10, {
      align: "center",
    });

    // Add sub-header (e-Gov MIS Portal)
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("E-GOV MIS PORTAL", pageWidth / 2, margin + 20, {
      align: "center",
    });

    // Add certificate title (e.g., CERTIFICATE OF BIRTH)
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const certificateTitle = `CERTIFICATE OF ${SERVICES[
      serviceType
    ].name.toUpperCase()}`;
    doc.text(certificateTitle, pageWidth / 2, margin + 40, { align: "center" });

    // Add content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let y = margin + 60;

    // For birth certificates, add random height and weight if not already present
    if (serviceType === "birth-certificate" && !data.height && !data.weight) {
      const height = (Math.random() * (55 - 45) + 45).toFixed(1); // Random height between 45-55 cm
      const weight = (Math.random() * (3.5 - 2.5) + 2.5).toFixed(2); // Random weight between 2.5-3.5 kg
      data.height = `${height} cm`;
      data.weight = `${weight} kg`;
    }

    const serviceFields = SERVICES[serviceType]?.fields || [];
    serviceFields.forEach((field) => {
      const value = data[field.name];
      if (value) {
        doc.text(`${field.label}:`, margin + 5, y);
        doc.text(`${value}`, pageWidth / 2, y); // Align value to the right of the middle
        y += 8; // Reduce line spacing
      }
    });

    // Add a signature line placeholder
    y += 20; // Add some space before signature
    doc.line(margin, y, pageWidth - margin, y); // Draw a line for signature
    doc.setFontSize(10);
    doc.text("Authorized Signature", pageWidth / 2, y + 5, { align: "center" });

    // Add footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is an electronically generated document. Any alteration invalidates this certificate.",
      pageWidth / 2,
      pageHeight - margin - 5,
      { align: "center" }
    );

    doc.save(
      `${serviceType}_${
        data.fullName || data.businessName || data.deceasedName || "certificate"
      }.pdf`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-700 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/loginbg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl relative"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          <FaHistory className="inline-block mr-3 text-purple-600" />
          Payment History
        </h2>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payment history found.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <motion.li
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-blue-600 truncate">
                        {SERVICES[payment.serviceType]?.name ||
                          "Unknown Service"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Paid for ₦
                        {(() => {
                          let amountToDisplay = 0;
                          if (
                            payment.formData &&
                            !isNaN(parseFloat(payment.formData.amount))
                          ) {
                            amountToDisplay = parseFloat(
                              payment.formData.amount
                            );
                          } else if (!isNaN(parseFloat(payment.price))) {
                            amountToDisplay = parseFloat(payment.price);
                          }
                          return amountToDisplay.toLocaleString();
                        })()}{" "}
                        on {formatDate(payment.timestamp)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() =>
                          generateCertificate(
                            payment.formData,
                            payment.serviceType
                          )
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                      >
                        <FaDownload className="mr-2" /> Download Certificate
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        {/* Back button */}
        <div className="text-center mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentHistoryPage;

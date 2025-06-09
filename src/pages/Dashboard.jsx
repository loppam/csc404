import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaCreditCard,
  FaUserAlt,
  FaPlus,
  FaDownload,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndRequests = async () => {
      try {
        if (auth.currentUser) {
          setUser(auth.currentUser);

          const q = query(
            collection(db, "requests"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("timestamp", "desc")
          );

          const querySnapshot = await getDocs(q);
          const requestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(requestsData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRequests();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

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
    const certificateTitle = `CERTIFICATE OF ${
      SERVICES[serviceType]?.name.toUpperCase() || "DOCUMENT"
    }`;
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
        className="container mx-auto px-4 py-16 bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-12 relative"
          variants={itemVariants}
        >
          <button
            onClick={handleSignOut}
            className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-md flex items-center space-x-2 text-sm"
            title="Sign Out"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
            Welcome
            {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
          </h2>
          <p className="text-lg text-gray-700">
            Your personalized dashboard for e-government services.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/service-form"
              className="block p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center text-center h-full"
            >
              <div className="flex flex-col items-center">
                <FaPlus className="text-3xl mb-2" />
                <span className="text-lg font-semibold">
                  Request New Service
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to="/profile"
              className="block p-4 bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center text-center h-full border border-gray-200"
            >
              <div className="flex flex-col items-center">
                <FaUserAlt className="text-3xl mb-2 text-blue-600" />
                <span className="text-lg font-semibold">Manage Profile</span>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to="/payment-history"
              className="block p-4 bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center text-center h-full"
            >
              <div className="flex flex-col items-center">
                <FaCreditCard className="text-3xl mb-2 text-purple-600" />
                <span className="text-lg font-semibold">Payment History</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="mb-12" variants={itemVariants}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
            Your Recent Requests
          </h3>
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
              <p className="text-gray-500 text-lg">
                You haven't made any requests yet.{" "}
                <Link
                  to="/service-form"
                  className="text-blue-600 hover:underline"
                >
                  Request your first service now!
                </Link>
              </p>
            </div>
          ) : (
            <motion.div
              className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100"
              variants={containerVariants}
            >
              <ul className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <motion.li key={request.id} variants={itemVariants}>
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-blue-600 truncate">
                          <FaFileAlt className="inline-block mr-2 text-xl" />
                          {SERVICES[request.serviceType]?.name ||
                            "Unknown Service"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Requested on {formatDate(request.timestamp)}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() =>
                            generateCertificate(
                              request.formData,
                              request.serviceType
                            )
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                        >
                          <FaDownload className="mr-2" /> Download
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>

        {/* You can add more sections here, e.g., announcements, FAQs, etc. */}
      </motion.div>
    </div>
  );
}

export default Dashboard;

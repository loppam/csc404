import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { auth } from "../firebase/config";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const SERVICES = {
  "birth-certificate": {
    name: "Birth Certificate",
    price: 5000,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      {
        name: "nin",
        label: "National Identification Number (NIN)",
        type: "text",
        required: true,
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
        required: true,
      },
      {
        name: "placeOfBirth",
        label: "Place of Birth",
        type: "text",
        required: true,
      },
      {
        name: "fatherName",
        label: "Father's Name",
        type: "text",
        required: true,
      },
      {
        name: "motherName",
        label: "Mother's Name",
        type: "text",
        required: true,
      },
      {
        name: "fatherOccupation",
        label: "Father's Occupation",
        type: "text",
        required: true,
      },
      {
        name: "motherOccupation",
        label: "Mother's Occupation",
        type: "text",
        required: true,
      },
      {
        name: "address",
        label: "Residential Address",
        type: "text",
        required: true,
      },
      {
        name: "stateOfOrigin",
        label: "State of Origin",
        type: "text",
        required: true,
      },
      {
        name: "lga",
        label: "Local Government Area",
        type: "text",
        required: true,
      },
    ],
  },
  "tax-receipt": {
    name: "Tax Receipt",
    price: 2000,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "taxId", label: "Tax ID", type: "text", required: true },
      { name: "amount", label: "Amount Paid", type: "number", required: true },
      {
        name: "paymentDate",
        label: "Payment Date",
        type: "date",
        required: true,
      },
      {
        name: "paymentPurpose",
        label: "Payment Purpose",
        type: "text",
        required: true,
      },
    ],
  },
  "marriage-certificate": {
    name: "Marriage Certificate",
    price: 10000,
    fields: [
      {
        name: "husbandName",
        label: "Husband's Full Name",
        type: "text",
        required: true,
      },
      {
        name: "wifeName",
        label: "Wife's Full Name",
        type: "text",
        required: true,
      },
      {
        name: "husbandNin",
        label: "Husband's NIN",
        type: "text",
        required: true,
      },
      { name: "wifeNin", label: "Wife's NIN", type: "text", required: true },
      {
        name: "marriageDate",
        label: "Date of Marriage",
        type: "date",
        required: true,
      },
      {
        name: "marriageVenue",
        label: "Marriage Venue",
        type: "text",
        required: true,
      },
      {
        name: "witness1",
        label: "First Witness Name",
        type: "text",
        required: true,
      },
      {
        name: "witness2",
        label: "Second Witness Name",
        type: "text",
        required: true,
      },
    ],
  },
  "death-certificate": {
    name: "Death Certificate",
    price: 3000,
    fields: [
      {
        name: "deceasedName",
        label: "Deceased Full Name",
        type: "text",
        required: true,
      },
      {
        name: "dateOfDeath",
        label: "Date of Death",
        type: "date",
        required: true,
      },
      {
        name: "placeOfDeath",
        label: "Place of Death",
        type: "text",
        required: true,
      },
      {
        name: "causeOfDeath",
        label: "Cause of Death",
        type: "text",
        required: true,
      },
      {
        name: "informantName",
        label: "Informant's Name",
        type: "text",
        required: true,
      },
      {
        name: "informantRelationship",
        label: "Relationship to Deceased",
        type: "text",
        required: true,
      },
    ],
  },
  "business-registration": {
    name: "Business Registration",
    price: 25000,
    fields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        required: true,
      },
      {
        name: "businessType",
        label: "Business Type",
        type: "select",
        options: [
          "Sole Proprietorship",
          "Partnership",
          "Limited Liability Company",
        ],
        required: true,
      },
      {
        name: "registrationNumber",
        label: "Registration Number",
        type: "text",
        required: true,
      },
      {
        name: "ownerName",
        label: "Owner's Name",
        type: "text",
        required: true,
      },
      { name: "ownerNin", label: "Owner's NIN", type: "text", required: true },
      {
        name: "businessAddress",
        label: "Business Address",
        type: "text",
        required: true,
      },
      {
        name: "registrationDate",
        label: "Registration Date",
        type: "date",
        required: true,
      },
    ],
  },
  "passport-application": {
    name: "Passport Application",
    price: 35000,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "nin", label: "NIN", type: "text", required: true },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
        required: true,
      },
      {
        name: "passportType",
        label: "Passport Type",
        type: "select",
        options: ["Standard", "Official", "Diplomatic"],
        required: true,
      },
      {
        name: "address",
        label: "Current Address",
        type: "text",
        required: true,
      },
      {
        name: "emergencyContact",
        label: "Emergency Contact",
        type: "text",
        required: true,
      },
    ],
  },
  "driver-license-renewal": {
    name: "Driver's License Renewal",
    price: 15000,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      {
        name: "licenseNumber",
        label: "Current License Number",
        type: "text",
        required: true,
      },
      {
        name: "expiryDate",
        label: "Current License Expiry Date",
        type: "date",
        required: true,
      },
      {
        name: "address",
        label: "Current Address",
        type: "text",
        required: true,
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        required: true,
      },
      {
        name: "bloodGroup",
        label: "Blood Group",
        type: "select",
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: true,
      },
    ],
  },
};

function ServiceForm() {
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyPayment = async (reference) => {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (data.status && data.data.status === "success") {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying payment:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const service = SERVICES[selectedService];
      if (!service) throw new Error("Please select a service");

      // Generate a unique reference
      const reference = `EGOV-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: auth.currentUser.email,
        amount: service.price * 100,
        currency: "NGN",
        ref: reference,
        callback: function (response) {
          // Handle the callback
          const verifyAndProcess = async () => {
            try {
              setVerifying(true);

              // Verify the payment
              const isPaymentVerified = await verifyPayment(response.reference);

              if (!isPaymentVerified) {
                throw new Error("Payment verification failed");
              }

              // Save request to Firestore with payment reference
              await addDoc(collection(db, "requests"), {
                userId: auth.currentUser.uid,
                serviceType: selectedService,
                formData,
                price: service.price,
                paymentStatus: "paid",
                paymentReference: response.reference,
                timestamp: new Date().toISOString(),
              });

              navigate("/dashboard");
            } catch (error) {
              console.error("Error processing payment:", error);
              setError("Error processing payment. Please contact support.");
            } finally {
              setVerifying(false);
              setLoading(false);
            }
          };

          verifyAndProcess();
        },
        onClose: function () {
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

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
        className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl relative"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleGoBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          title="Go Back"
        >
          <FaArrowLeft />
        </motion.button>

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Request a Service
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form below to request your service
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          <div>
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700"
            >
              Select Service
            </label>
            <select
              id="service"
              name="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select a service</option>
              {Object.entries(SERVICES).map(([key, service]) => (
                <option key={key} value={key}>
                  {service.name} - ₦{service.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES[selectedService]?.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === "text" && field.name.includes("address")
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      required={field.required}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      required={field.required}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || verifying || !selectedService}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading
                ? "Processing..."
                : verifying
                ? "Verifying Payment..."
                : "Proceed to Payment"}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default ServiceForm;

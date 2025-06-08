import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaCreditCard,
  FaUserShield,
  FaCheckCircle,
} from "react-icons/fa";

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const HomePage = () => {
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
        className="container mx-auto px-4 py-16 bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-16"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 leading-tight"
            variants={textVariants}
          >
            Empowering Citizens Through Digital Governance
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto font-light"
            variants={textVariants}
          >
            Your seamless gateway to efficient government services, secure
            payments, and organized document management.
          </motion.p>
          <motion.div
            className="space-x-4 flex justify-center"
            variants={buttonVariants}
          >
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-24 grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
            variants={cardVariants}
          >
            <div className="text-blue-600 text-5xl mb-4">
              <FaFileAlt />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Streamlined Service Requests
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Submit and track your government service requests online with
              real-time updates and notifications, simplifying administrative
              processes.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
            variants={cardVariants}
          >
            <div className="text-purple-600 text-5xl mb-4">
              <FaCreditCard />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Secure Online Payments
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Make secure payments for government services and fees with
              multiple payment options and instant receipts, ensuring peace of
              mind.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
            variants={cardVariants}
          >
            <div className="text-blue-600 text-5xl mb-4">
              <FaUserShield />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Effortless Document Management
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Access and download your certificates and documents securely with
              advanced encryption and backup, always at your fingertips.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-lg">
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Secure and encrypted transactions ensuring your data's privacy
                  and safety.
                </span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  24/7 dedicated customer support to assist you with any queries
                  or issues.
                </span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Real-time status updates on all your service requests for
                  complete transparency.
                </span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Mobile-friendly interface, allowing you to access services
                  from any device, anywhere.
                </span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Multiple flexible payment options for your convenience and
                  ease of transaction.
                </span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-300 mr-3 mt-1 flex-shrink-0" />
                <span>
                  Robust document verification system to ensure authenticity and
                  reduce fraud.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;

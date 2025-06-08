import React from "react";
import { motion } from "framer-motion";

const ContactPage = () => {
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
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Contact Us
        </h2>
        <p className="text-lg text-gray-700">
          Have questions or need assistance? Feel free to reach out to us.
        </p>
        <p className="mt-4 text-gray-500">(Contact form/details coming soon)</p>
      </motion.div>
    </div>
  );
};

export default ContactPage;

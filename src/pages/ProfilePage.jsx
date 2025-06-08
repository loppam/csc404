import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FaUserCircle,
  FaEnvelope,
  FaBirthdayCake,
  FaIdCard,
  FaPen,
} from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    nin: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser(auth.currentUser);
            setProfileData({
              name: data.name || "",
              email: data.email || "",
              role: data.role || "",
              nin: data.nin || "",
              dateOfBirth: data.dateOfBirth || "",
            });
          } else {
            setError("No profile data found.");
          }
        } else {
          setError("User not logged in.");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateSuccess(false);
    setError("");

    try {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: profileData.name,
        });
        await auth.currentUser.updateProfile({ displayName: profileData.name });
        setUpdateSuccess(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        className="max-w-4xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          <FaUserCircle className="inline-block mr-3 text-blue-600" />
          Your Profile
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        {updateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">
              Profile updated successfully!
            </span>
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <FaUserCircle className="text-5xl text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-800">Name:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="text-xl text-gray-700">{profileData.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <FaEnvelope className="text-5xl text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-800">Email:</p>
              <p className="text-xl text-gray-700">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <FaIdCard className="text-5xl text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-800">NIN:</p>
              <p className="text-xl text-gray-700">
                {profileData.nin || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Official ID - Not Editable)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <FaBirthdayCake className="text-5xl text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Date of Birth:
              </p>
              <p className="text-xl text-gray-700">
                {profileData.dateOfBirth || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Official Record - Not Editable)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-inner">
            <FaUserCircle className="text-5xl text-gray-400" />
            <div>
              <p className="text-lg font-semibold text-gray-800">Role:</p>
              <p className="text-xl text-gray-700 capitalize">
                {profileData.role}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            {isEditing ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateProfile}
                disabled={updateLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? "Updating..." : "Save Changes"}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FaPen className="mr-2" /> Edit Name
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

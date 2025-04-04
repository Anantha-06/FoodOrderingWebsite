import React from "react";
import AddNewAddress from "../../Components/User/AddNewAddress.jsx";
import { motion } from "framer-motion";
import "../../PageStyle/UserAddressEdit.css"; // Optional for custom styles

function UserAddressEdit() {
  return (
    <div className="full-width-container">
      <motion.div
        className="full-width-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h3 className="text-center fw-bold mb-4">Edit Your Address</h3>
        <AddNewAddress />
      </motion.div>
    </div>
  );
}

export default UserAddressEdit;

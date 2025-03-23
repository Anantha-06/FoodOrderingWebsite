import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../../Axios/axiosInstance.js";
import Popup from "../../Components/User/Popup.jsx";
import { motion } from "framer-motion";
import AddNewAddress from "../../Components/User/AddNewAddress.jsx";

function UserAddressEdit() {

  return (
   <>
   <AddNewAddress/>
   </>
  );
}

export default UserAddressEdit;

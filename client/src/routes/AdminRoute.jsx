import React from "react";
import { Outlet } from "react-router-dom";

function AdminRoute(){
    return(
        <>
         <Outlet/>
        </>
    )
}

export default AdminRoute
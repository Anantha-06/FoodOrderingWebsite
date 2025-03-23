import React from "react";
import HeaderNav from "../Components/User/HeaderNav";
import FooterNav from "../Components/User/FooterNav";
import { Outlet } from "react-router-dom";

function UserRoute() {
  return (
    <>
      <div id="root">
        <HeaderNav />
        <div className="page-content">
          <Outlet />
        </div>
        <FooterNav />
      </div>
    </>
  );
}

export default UserRoute;

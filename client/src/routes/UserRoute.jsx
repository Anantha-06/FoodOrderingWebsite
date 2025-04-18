import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderNav from "../Components/User/HeaderNav";
import FooterNav from "../Components/User/FooterNav";
import { Outlet } from "react-router-dom";

function UserRoute() {
  const { pathname } = useLocation();

  useEffect(() => {
   
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div id="root" className="scroll-container">
      <HeaderNav />
      <main className="page-content">
        <Outlet />
      </main>
      <FooterNav />
    </div>
  );
}

export default UserRoute;
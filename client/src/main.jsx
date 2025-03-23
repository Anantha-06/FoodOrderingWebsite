import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx";
import Homepage from "./Pages/User/Homepage.jsx";
import RestaurantPage from "./Pages/User/RestaurantPage.jsx";
import ProfilePage from "./Pages/User/ProfilePage.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import AboutUs from "./Pages/User/AboutUsPage.jsx";
import LoginPage from "./Pages/User/LoginPage.jsx";
import SignUpPage from "./Pages/User/SignupPage.jsx";
import UserAddressEdit from "./Pages/User/UserAddressEdit.jsx"
import CheckoutPage from "./Pages/User/CheckoutPage.jsx";
import PaymentPage from "./Pages/User/PaymentPage.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "",
            element: <Homepage />,
          },
          {
            path: "/restaurant/:id",
            element: <RestaurantPage />,
          },
          {
            path: "/user/about",
            element: <AboutUs />,
          },
          {
            path: "/user/profile",
            element: <ProfilePage />,
          },
          {
            path: "/address/new",
            element: <UserAddressEdit/>,
          },
          {
            path: "checkoutpage",
            element: <CheckoutPage/>,
          },
          {
            path: "orderpage",
            element: <PaymentPage/>,
          },
        ],
      },
    ],
  },
  
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

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
import UserAddressEdit from "./Pages/User/UserAddressEdit.jsx";
import CheckoutPage from "./Pages/User/CheckoutPage.jsx";
import PaymentPage from "./Pages/User/PaymentPage.jsx";
import MainPage from "./Pages/Shared/MainPage.jsx";
import UserRoute from "./routes/UserRoute.jsx";
import AdminSignup from "./Pages/Admin/AdminSignup.jsx";
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import AllOrderPage from "./Pages/User/AllORderPage.jsx";
import RestaurantSignup from "./Pages/Restaurant/RestaurantSignup.jsx";
import RestaurantLogin from "./Pages/Restaurant/RestaurantLogin.jsx";
import RestaurantDashboard from "./Pages/Restaurant/RestaurantDashboard.jsx";
import LandingPage from "./Pages/Shared/LandingPage.jsx";
import ResponsiveCardHover from "./Pages/User/ResponsiveCardHover.jsx";
import ErrorPage from "./Pages/User/ErrorPage.jsx"; 
import ForgotPassword from "./Pages/User/ForgotPassword.jsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "user",
        element: <UserRoute />,
        children: [
          {
            element: <ProtectedRoutes />,
            children: [
              {
                path: "homepage",
                element: <Homepage />,
              },
              {
                path: "restaurant/:id",
                element: <RestaurantPage />,
              },
              {
                path: "about",
                element: <AboutUs />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
              {
                path: "address/new",
                element: <UserAddressEdit />,
              },
              {
                path: "checkout",
                element: <CheckoutPage />,
              },
              {
                path: "orders", 
                element: <AllOrderPage />, 
              },
              {
                path: "payment",
                element: <PaymentPage />, 
              },
            ],
          },
        ],
      },
      {
        path: "admin/dashboard", 
        element: <AdminDashboard />,
      },
      {
        path: "user/login", 
        element: <LoginPage />,
      },
      {
        path: "user/signup", 
        element: <SignUpPage />,
      },
      {
        path: "admin/signup", 
        element: <AdminSignup />,
      },
      {
        path: "admin/login", 
        element: <AdminLogin />,
      },
      {
        path: "restaurant/signup", 
        element: <RestaurantSignup />,
      },
      {
        path: "restaurant/login", 
        element: <RestaurantLogin />,
      },
      {
        path: "restaurant/dashboard", 
        element: <RestaurantDashboard />,
      },
      {
        path: "user/landingpage", 
        element: <LandingPage/>,
      },   
      {
        path: "ak/test", 
        element: <ResponsiveCardHover/>,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        path: "/user/update-password",
        element: <ForgotPassword />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
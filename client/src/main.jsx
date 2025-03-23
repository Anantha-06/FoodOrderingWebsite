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
import UserRoute from "./routes/userRoute.jsx";
import AllOrderPage from "./Pages/User/AllORderPage.jsx"

const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    children: [
      {
        path: "",
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
                path: "order",
                element: <PaymentPage />,
              },
              {
                path: "all/order",
                element: <AllOrderPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/user/login",
        element: <LoginPage />,
      },
      {
        path: "user/signup",
        element: <SignUpPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

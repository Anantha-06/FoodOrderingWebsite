import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx";
import Homepage from "./Pages/User/Homepage.jsx";
import RestaurantPage from "./Pages/User/RestaurantPage.jsx";
import ProfilePage from "./Pages/User/ProfilePage.jsx";
import AdminLoginPage from "./Pages/AdminLoginPage.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import AboutUs from "./Pages/User/AboutUsPage.jsx";
import LoginPage from "./Pages/User/LoginPage.jsx";
import SignUpPage from "./Pages/User/SignupPage.jsx";
import UserAddressEdit from "./Pages/User/UserAddressEdit.jsx"
import CheckoutPage from "./Pages/User/CheckoutPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/",
            element: <Homepage />,
          },
          {
            path: "/restaurant/:id",
            element: <RestaurantPage />,
          },
          {
            path: "/about",
            element: <AboutUs />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/address/new",
            element: <UserAddressEdit/>,
          },
          {
            path: "/checkoutpage",
            element: <CheckoutPage/>,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/admin",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [userdata, setUserdata] = useState({});
  console.log("response", userdata);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login/sucess", {
        withCredentials: true,
      });
      setUserdata(response.data.user);
    } catch (error) {
      console.log("error", error);
    }
  };

  const logout = () => {
    window.open("http://localhost:8080/logout", "_self");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <header className="bg-gray-800 text-white shadow-md">
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Login With Google</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              <li>
                <NavLink
                  to="/"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Home
                </NavLink>
              </li>
              {Object.keys(userdata)?.length > 0 ? (
                <>
                  <li className="text-sm font-bold text-gray-300">
                    {userdata?.displayName}
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="text-gray-300 hover:text-white transition duration-300"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li
                    onClick={logout}
                    className="cursor-pointer text-gray-300 hover:text-red-500 transition duration-300"
                  >
                    Logout
                  </li>
                  <li>
                    <img
                      src={userdata?.image}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-600"
                    />
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;

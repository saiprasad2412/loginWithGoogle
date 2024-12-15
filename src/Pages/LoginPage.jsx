import React, { useState } from "react";
import loginPageImg from "../assets/loginpageImg.png";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login clicked!", { email, password });
    };

    const handleGoogleSignIn = () => {
        window.open("http://localhost:8080/auth/google/callback", "_self");

    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-screen h-screen">
            {/* Image Container */}
            <div className="flex items-center justify-center w-[80%] h-[80%]">
                <img
                    src={loginPageImg}
                    alt="Login"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Button Container */}
            <div className="flex flex-col items-center justify-center w-[80%] h-[80%] space-y-4">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" onClick={handleGoogleSignIn}>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;

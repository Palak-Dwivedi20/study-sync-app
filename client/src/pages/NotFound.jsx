import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ComponentImport";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-400 text-center mb-6 max-w-md">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Button
        title="Go Back Home"
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300"
      />
    </div>
  );
}

export default NotFound;

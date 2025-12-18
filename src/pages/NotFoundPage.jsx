import React from "react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <Link to="/home" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold transition duration-300">
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;

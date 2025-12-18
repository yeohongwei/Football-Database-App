import React from "react";

const ErrorComponent = (props) => {
  console.error("Error Encountered", props.error);

  return (
    <div className="bg-red-500 text-white p-4 rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-2">Error encountered</h1>
      <p>Error message: {props.error.message}</p>
    </div>
  );
};

export default ErrorComponent;

import React from "react";

const LoadingButton = ({ onClick, isLoading, text, size }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`bg-blue-500 text-white py-2 px-4 rounded focus:outline-none flex gap-2 justify-center items-center ${size} ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className={`bi bi-arrow-clockwise ${
          isLoading ? "animate-spin flex" : "hidden"
        }`}
        viewBox="0 0 16 16">
        <path
          fillRule="evenodd"
          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
        />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>
      {text}
    </button>
  );
};

export default LoadingButton;

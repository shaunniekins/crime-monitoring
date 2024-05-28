import React, { useState } from "react";
import Select from "react-select";
import LoadingButton from "../LoadingButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadID({ credentials }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState({});

  // TOAST FUNCTION
  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  }; 
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 3000,
    });
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file)
      await axios.post(`/api/uploadID?email=${credentials.email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccessMessage("File successfully uploaded.")
      setTimeout(() => {
        
      navigate("/signIn");
      }, 4000);
    } catch (error) {
      showErrorMessage("Error uploading file: " + error)
    }
  };


  return (

    <div className="w-full flex flex-col justify-center items-center gap-10 p-4 h-96 bg-white rounded-md sm:w-4/6 md:w-3/6 md:rounded-tr-md md:rounded-br-md md:rounded-tl-none md:rounded-bl-none">
      <p>Upload your I.D here.</p>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <LoadingButton
        isLoading={loading}
        text="Upload"
        size="w-5/6 mt-5"
        onClick={handleUpload}
      />
    </div>
  );
}

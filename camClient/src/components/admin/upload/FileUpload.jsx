import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpload = ({user}) => {
  const [file, setFile] = useState(null);

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
    });
  };
  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 2000,
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
      await axios.post(`/fileUpload?id=${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccessMessage("File uploaded successfully");
    } catch (error) {
      showErrorMessage("Error uploading file:" + error)
    }
  };

  return (
    <div>
    <ToastContainer />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className='p-2 bg-blue-400 rounded-md w-52 text-white hover:bg-blue-500 duration-200'>Upload</button>
    </div>
  );
};

export default FileUpload;
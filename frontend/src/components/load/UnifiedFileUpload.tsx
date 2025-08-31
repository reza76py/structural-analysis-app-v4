// src/components/load/UnifiedFileUpload.tsx

import React, { useState } from "react";
import axios from "axios";
import "../../styles/styles_upload_files.css";


// type Props = {
//     onUploadSuccess?: () => void;
//   };

const UnifiedFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadStatus("");
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("❌ Please select a file first.");
      return;
    }

    const ext = getFileExtension(selectedFile.name);
    let endpoint = "";

    switch (ext) {
      case "pdf":
        endpoint = "/file/upload/pdf/";
        break;
      case "xlsx":
      case "xls":
        endpoint = "/file/upload/excel/";
        break;
      default:
        setUploadStatus(`❌ Unsupported file type: .${ext}`);
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_type", ext);

    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        setUploadStatus(`✅ ${response.data.message}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Upload error:", error.message);
        } else {
            console.error("Upload error:", error);
        }
        setUploadStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="upload-files">
      <h2 className="text-[10px] font-semibold mb-2 text-white">Upload Node File</h2>
      <input
        type="file"
        accept=".pdf,.xlsx,.xls"
        onChange={handleFileChange}
        className="mb-2 text-[10px] text-white"
      />
      <br />
      <button
        className="bg-blue-600 h-5 text-[10px] text-white px-4 rounded"
        onClick={handleUpload}
      >
        📤 Upload File
      </button>
      {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
    </div>
  );
};

export default UnifiedFileUpload;

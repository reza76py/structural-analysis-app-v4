// src/components/load/FileUploadForm.tsx

import React, { useState } from "react";
import axios from "axios";
import "../../styles/styles_upload_files.css";

const FileUploadForm = () => {
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
          endpoint = "/file/upload/pdf/"; // ✅ Full correct path
          break;
        default:
          setUploadStatus("❌ Only PDF files are supported right now.");
          return;
      }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_type", ext);

    try {
      const response = await axios.post(`https://spacetruss.rezteche.com:8002${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadStatus(`✅ ${response.data.message}`);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="upload-files">
      <h2 className="text-[10px] font-semibold mb-2 text-white">Upload Node in PDF</h2>
      <input
        type="file"
        accept=".pdf,.xlsx,.xls,.txt"
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

export default FileUploadForm;
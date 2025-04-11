import React, { useState } from "react";
import axios from "axios";

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
        endpoint = "/file/upload/pdf/";
        break;
      case "xlsx":
      case "xls":
        endpoint = "/file/upload/excel/";
        break;
      default:
        setUploadStatus(`❌ Unsupported file type: ${ext}`);
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_type", ext);

    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, formData, {
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
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">📁 Upload Node Coordinates in EXCL</h2>
      <input
        type="file"
        accept=".pdf,.xlsx,.xls"
        onChange={handleFileChange}
        className="mb-2"
      />
      <br />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        📤 Upload File
      </button>
      {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
    </div>
  );
};

export default FileUploadForm;

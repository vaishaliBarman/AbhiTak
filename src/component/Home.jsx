 
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import  Chat from "./Chat";

// const Home = () => {
//   const [userName, setUserName] = useState("");
//   const [files, setFiles] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedName = localStorage.getItem("userName");

//     if (!token || !storedName) {
//       navigate("/");
//     } else {
//       setUserName(storedName);
//     }

//     // ✅ Fetch uploaded files from MongoDB
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get("http://localhost:5002/getFiles");
//         setFiles(response.data.files);
//       } catch (error) {
//         console.error("Error fetching files:", error);
//       }
//     };

//     fetchFiles();
//   }, [navigate]);

//   // ✅ Handle File Selection
//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files);
//   };

//   // ✅ Upload Files to Cloudinary
//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select files to upload!");
//       return;
//     }

//     const formData = new FormData();
//     for (let i = 0; i < selectedFiles.length; i++) {
//       formData.append("files", selectedFiles[i]);
//      // setCount(selectedFiles.length);
//     }

//     try {
//       const response = await axios.post("http://localhost:5002/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Upload Successful!");
//       setFiles([...files, ...response.data.files]); // Update UI with new files
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert("Upload failed. Please try again.");
//     }
//   };

//   // ✅ Delete File
//   const handleDelete = async (public_id) => {
//     const encodedPublicId = encodeURIComponent(public_id); // 🔥 Encode the public_id

//     console.log("Deleting file:", encodedPublicId); // Debugging
    
//     try {
//       await axios.delete(`http://localhost:5002/delete/${encodedPublicId}`);
//       setFiles(files.filter((file) => file.public_id !== public_id)); // Update UI
//       alert("File deleted successfully");
//     } catch (error) {
//       console.error("Delete Error:", error.response?.data || error);
//       alert("Delete failed.");
//     }
//   };
  

  
//     return (
//       <div>
//         <h2>Welcome, {userName || "Loading..."}</h2>
  
//         <h3>Upload Files:</h3>
//         <input type="file" multiple onChange={handleFileChange} />
//         <button onClick={handleUpload}>Upload</button>
  
//         <h3>My Gallery:</h3>
         
//         <p>Total Post: {files.length}</p>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//           {files.map((file) => (
//             <div key={file.public_id} style={{ width: "200px", textAlign: "center" }}>
//               {file.type === "image" ? (
//                 <img src={file.url} alt="Uploaded" style={{ width: "100%", borderRadius: "10px" }} />
//               ) : file.type === "video" ? (
//                 <video controls style={{ width: "100%" }}>
//                   <source src={file.url} type={`video/${file.format}`} />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : file.type === "audio" ? (
//                 <audio controls>
//                   <source src={file.url} type={`audio/${file.format}`} />
//                   Your browser does not support the audio tag.
//                 </audio>
//               ) : (
//                 <a href={file.url} target="_blank" rel="noopener noreferrer">
//                   {file.format.toUpperCase()} File
//                 </a>
//               )}
//               <button onClick={() => handleDelete(file.public_id)}>Delete</button>
//             </div>
//           ))}
//         </div>

//         <  Chat />
//       </div>
//     );

// };

// export default Home;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chat from "./Chat";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (!token || !storedName) {
      navigate("/");
    } else {
      setUserName(storedName);
    }

    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5002/getFiles");
        setFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [navigate]);

  //  Handle File Selection & Preview
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setSelectedFiles(fileList);
  };

  //  Remove a File Before Uploading
  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  //  Upload Files to Cloudinary
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://localhost:5002/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload Successful!");
      setFiles([...files, ...response.data.files]);
      setSelectedFiles([]); // Clear selected files after upload
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed. Please try again.");
    }
  };

  //  Delete File
  const handleDelete = async (public_id) => {
    const encodedPublicId = encodeURIComponent(public_id);

    try {
      await axios.delete(`http://localhost:5002/delete/${encodedPublicId}`);
      setFiles(files.filter((file) => file.public_id !== public_id));
      alert("File deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      alert("Delete failed.");
    }
  };

  return (
    <div>
      <h2>Welcome, {userName || "Loading..."}</h2>

      <h3>Upload Files:</h3>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {/*  File Preview Section */}
      {selectedFiles.length > 0 && (
        <div>
          <h4>Selected Files (Preview & Remove):</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {selectedFiles.map((file, index) => {
              const fileType = file.type.split("/")[0];
              return (
                <div key={index} style={{ width: "150px", textAlign: "center" }}>
                  {fileType === "image" ? (
                    <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: "100%", borderRadius: "10px" }} />
                  ) : fileType === "video" ? (
                    <video controls style={{ width: "100%" }}>
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : fileType === "audio" ? (
                    <audio controls>
                      <source src={URL.createObjectURL(file)} type={file.type} />
                      Your browser does not support the audio tag.
                    </audio>
                  ) : (
                    <p>{file.name}</p>
                  )}
                  <button onClick={() => removeSelectedFile(index)}>Remove</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h3>My Gallery:</h3>
      <p>Total Post: {files.length}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {files.map((file) => (
          <div key={file.public_id} style={{ width: "200px", textAlign: "center" }}>
            {file.type === "image" ? (
              <img src={file.url} alt="Uploaded" style={{ width: "100%", borderRadius: "10px" }} />
            ) : file.type === "video" ? (
              <video controls style={{ width: "100%" }}>
                <source src={file.url} type={`video/${file.format}`} />
                Your browser does not support the video tag.
              </video>
            ) : file.type === "audio" ? (
              <audio controls>
                <source src={file.url} type={`audio/${file.format}`} />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.format.toUpperCase()} File
              </a>
            )}
            <button onClick={() => handleDelete(file.public_id)}>Delete</button>
          </div>
        ))}
      </div>

      <Chat />
    </div>
  );
};

export default Home;

// import React, { useState, useRef, createContext ,useEffect} from "react";
// import Language from "../components/form/Language";
// import axios from "axios";
// import Meta from "../components/meta/Meta";
// import FormCP from "../components/form/FormCP";
// import dynamic from "next/dynamic";
// import DefaultResumeData from "../components/utility/DefaultResumeData";
// import SocialMedia from "../components/form/SocialMedia";
// import WorkExperience from "../components/form/WorkExperience";
// import Skill from "../components/form/Skill";
// import PersonalInformation from "../components/form/PersonalInformation";
// import Summary from "../components/form/Summary";
// import Projects from "../components/form/Projects";
// import Education from "../components/form/Education";
// import Certification from "../components/form/certification";
// import ColorPicker from './ColorPicker';
// import ColorPickers from "./ColorPickers";
// import Preview from "../components/preview/Preview";
// import TemplateSelector from "../components/preview/TemplateSelector";
// import { PDFExport } from '@progress/kendo-react-pdf';
// import LoadUnload from "../components/form/LoadUnload";
// import MyResume from "./dashboard/MyResume";
// import Modal from "../components/Modal"; // Import the modal
// import Link from "next/link";
// import { useRouter } from "next/router";
// import generatePDF, { Resolution, Margin } from "react-to-pdf";

// const ResumeContext = createContext(DefaultResumeData);
// import toast from "react-hot-toast";
// import Sidebar from "./dashboard/Sidebar";

// const Print = dynamic(() => import("../components/utility/WinPrint"), {
//   ssr: false,
// });

// export default function WebBuilder() {
//   const [resumeData, setResumeData] = useState(DefaultResumeData);
//   const [formClose, setFormClose] = useState(false);
//   const [currentSection, setCurrentSection] = useState(0);
//   const [selectedFont, setSelectedFont] = useState("Ubuntu");
//   const [headerColor, setHeaderColor] = useState("");
//   const [backgroundColorss, setBgColor] = useState("");
//   const [selectedTemplate, setSelectedTemplate] = useState("template1");
//   const [isFinished, setIsFinished] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
//   const [token, setToken] = useState(null);
//   const [resumeId, setResumeId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedToken = localStorage.getItem("token");
//       setToken(storedToken);
//     }
//   }, []);

//   useEffect(() => {
//     // Extract resumeId from URL
//     if (typeof window !== "undefined") {
//       const path = window.location.pathname;
//       const id = path.split("/").pop(); // Get the last part of the URL
//       setResumeId(id);

//       // Fetch resume data from the API using resumeId
//       const fetchResumeData = async () => {
//         const token = localStorage.getItem("token");
//         try {
//           const response = await axios.get(
//             `https://api.novajobs.us/api/user/resume-list/${id}`,
//             {
//               headers: { Authorization: token },
//             }
//           );
//           const resumeData = response.data.data;
//           console.log("resumeData>>>>>", resumeData);
//           if (
//             !resumeData ||
//             // !resumeData.file_path ||
//             !resumeData.ai_resume_parse_data
//           ) {
//             console.error("Resume data not found in API response");
//             return;
//           }

//           const parsedData = JSON.parse(resumeData.ai_resume_parse_data);
//           setResumeData(parsedData.templateData);
//         } catch (error) {
//           console.error("Error fetching resume data:", error);
//         }
//       };

//       if (id) {
//         fetchResumeData();
//       }
//     }
//   }, []);

//   const handleDownloadResume = () => {
//     const amount = 49; // Fixed price

//     // Ensure the resumeId is valid
//     if (!resumeId) {
//       console.error("Resume ID is not available");
//       return;
//     }

//     // Create the download payload
//     const payload = {
//       amount,
//       ResumeId: resumeId, // Ensure the field name matches the API expectation
//       Token: token || "", // Ensure the field name matches the API expectation
//     };

//     // Make the API call to initiate download

//     axios
//       .post(
//         "https://api.novajobs.us/api/user/paypal/create-payment",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" }, // Use JSON content type
//         }
//       )

//       .then((response) => {
//         const data = response.data;
//         if (data && data.data) {
//           // Redirect to the PayPal URL provided in the response
//           window.location.href = data.data;
//         }
//         if (data && data.order_id) {
//           localStorage.setItem("orderid", data.order_id);
//         }
//         console.log(data.order_id);
//       })
//       .catch((error) => console.error("Payment Error:", error));
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleProfilePicture = (e) => {
//     const file = e.target.files[0];
//     if (file instanceof Blob) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setResumeData({ ...resumeData, profilePicture: event.target.result });
//       };
//       reader.readAsDataURL(file);
//     } else {
//       console.error("Invalid file type");
//     }
//   };

//   const handleChange = (e) => {
//     setResumeData({ ...resumeData, [e.target.name]: e.target.value });
//   };

//   const sections = [
//     { label: "Details", component: <PersonalInformation /> },
//     { label: "Social", component: <SocialMedia /> },
//     { label: "Summary", component: <Summary /> },
//     { label: "Education", component: <Education /> },
//     { label: "Experience", component: <WorkExperience /> },
//     { label: "Projects", component: <Projects /> },
//     {
//       label: "Skills",
//       component: Array.isArray(resumeData?.skills) ? (
//         resumeData.skills.map((skill, index) => (
//           <Skill title={skill.title} key={index} />
//         ))
//       ) : (
//         <p>No skills available</p>
//       ),
//     },
//     { label: "Language", component: <Language /> },
//     { label: "Certification", component: <Certification /> },
//   ];

//   const handleNext = async () => {
//     await handleFinish();
//     if (currentSection === sections.length - 1) {
//       setIsFinished(true);
//     } else {
//       setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
//     }
//   };

//   const handleBackToPrevious = async () => {
//     await handleFinish();
//     setIsFinished(false);
//   };

//   const handlePrevious = async () => {
//     await handleFinish();
//     setCurrentSection((prev) => Math.max(prev - 1, 0));
//   };

//   const handleSectionClick = async (index) => {
//     await handleFinish();
//     setCurrentSection(index);
//   };

//   const handleFontChange = (e) => {
//     setSelectedFont(e.target.value);
//   };

//   const pdfExportComponent = useRef(null);
//   const downloadAsPDF = () => {
//     // if (pdfExportComponent.current) {
//     //   pdfExportComponent.current.save();
//     //   router.push('/dashboard/page')
//     // }
//   };

//   const pdfExportOptions = {
//     paperSize: "A4",
//     fileName: "resume.pdf",
//     author: resumeData.firstName + " " + resumeData.lastName,
//     creator: "ATSResume Builder",
//     date: new Date(),
//     scale: 0.7,
//     forcePageBreak: ".page-break",
//   };

//   const router = useRouter();
//   const { id } = router.query;
//   // const handleLogout = () => {
//   //   localStorage.removeItem("token"); // Clear the token
//   //   setIsLoggedIn(false); // Update login state
//   // };
//   const getLinkClassName = (path) => {
//     return router.pathname === path
//       ? "flex items-center p-2 bg-slate-900 border-b-2 rounded font-semibold text-white"
//       : "flex items-center p-2 hover:bg-indigo-100  border-b-2 rounded font-semibold  ";
//   };
//   const saveResume = async () => {
//     // Logic to save the resume, e.g., API call to save data
//     // await saveResumeAPI(resumeData);
//     console.log("Resume saved!");
//   };
//   // console.log(">>>>>ResumeData", resumeData);
//   const handleFinish = async () => {
//     if (!resumeData) return;

//     // Map resumeData into the required templateData format
//     const templateData = {
//       templateData: {
//         ...resumeData,
//         workExperience:
//           resumeData.workExperience?.map((exp) => ({
//             company: exp.company || "",
//             position: exp.position || "",
//             description: exp.description || "",
//             KeyAchievements: Array.isArray(exp.keyAchievements)
//               ? exp.keyAchievements
//               : [exp.keyAchievements || ""], // Ensure it's an array
//             startYear: exp.startYear || "",
//             endYear: exp.endYear || "",
//           })) || [],
//         projects:
//           resumeData.projects?.map((project) => ({
//             title: project.title || "",
//             link: project.link || "",
//             description: project.description || "",
//             keyAchievements: Array.isArray(project.keyAchievements)
//               ? project.keyAchievements
//               : [project.keyAchievements || ""], // Ensure it's an array
//             startYear: project.startYear || "",
//             endYear: project.endYear || "",
//             name: project.name || "",
//           })) || [],
//         skills: Array.isArray(resumeData.skills)
//           ? resumeData.skills.map((skill) => ({
//               title: skill.title || "",
//               skills: skill.skills || [],
//             }))
//           : [],
//       },
//     };

//     try {
//       // Check if `id` is available, otherwise get it from local storage
//       const id = router.query.id || localStorage.getItem("resumeId");
//       if (!id) {
//         console.error("Resume ID not found.");
//         return;
//       }

//       const url = `https://api.novajobs.us/api/user/resume-update/${id}`;
//       const response = await axios.put(url, templateData, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       });

//       console.log("Resume updated successfully:", response.data);
//       // Uncomment below if you need to redirect after updating
//       // if (response.data) {
//       //   router.push('/dashboard/ai-resume-builder');
//       // }
//       await saveResume(); // Save the resume
//       toast.success("Your resume has been saved in 'My Resume'");
//     } catch (error) {
//       console.error("Error updating resume:", error);
//       console.error("Error saving resume:", error);
//       toast.error("Failed to save resume. Please try again.");
//     }
//   };

//   // const getTargetElement = () => document.getElementById("content-pdf");
//   const getTargetElement = () => {
//     const targetElement = document.getElementById("preview-section"); //("content-pdf");
//     if (!targetElement) {
//       console.error("Preview section not found.");
//       return null;
//     }

//     // Apply the additional classes to all <h2> tags and elements with the "pdf-icon" class
//     const h2Elements = targetElement.querySelectorAll(".border-b-2");
//     const iconElements = targetElement.querySelectorAll(".pdf-icon");
//     const mainHeadingElements = targetElement.querySelectorAll(".main-heading");
//     // Store the original classes so they can be restored later
//     h2Elements.forEach((h2) => h2.classList.add("pb-2"));
//     iconElements.forEach((icon) => icon.classList.add("pt-4"));
//     mainHeadingElements.forEach((div) => div.classList.add("pb-2"));
//     const style = document.createElement("style");
//     style.setAttribute("data-custom", "pdf-styles");
//     style.innerHTML = `
//     #preview-section ul {
//       list-style: none; /* Hides default markers */
//       padding-left: 0;
//     }

//     #preview-section li {
//       position: relative;
//       padding-left: 1.5em; /* Spacing for custom marker */
//     }

//     #preview-section li::before {
//       content: '• ';
//       position: absolute;
//       left: 0;
//       top: -0.05em; /* Move the marker upwards */
//     }
//   `;

//     // Append the style to the head to apply the styles dynamically
//     document.head.appendChild(style);

//     return targetElement;
//   };

//   const handleDownload = async () => {
//     setLoading(true); // Show loader when download starts

//     await handleFinish();
//     try {
//       const targetElement = await getTargetElement();
//       const options = {
//         resolution: Resolution.HIGH,
//         canvas: { qualityRatio: 1 },
//         overrides: { canvas: { useCORS: true } },
//       };

//       // Generate the PDF
//       await generatePDF(() => targetElement, options);

//       // Revert modifications by removing the added classes
//       const h2Elements = targetElement.querySelectorAll(".border-b-2");
//       const iconElements = targetElement.querySelectorAll(".pdf-icon");
//       const mainHeadingElements =
//         targetElement.querySelectorAll(".main-heading");
//       h2Elements.forEach((h2) => h2.classList.remove("pb-2"));
//       iconElements.forEach((icon) => icon.classList.remove("pt-4"));
//       mainHeadingElements.forEach((div) => div.classList.remove("pb-2"));
//       const styleElement = document.querySelector(
//         'style[data-custom="pdf-styles"]'
//       );
//       if (styleElement) styleElement.remove();
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//     setLoading(false); // Hide loader
//   };

//   return (
//     <>
//       <ResumeContext.Provider
//         value={{
//           resumeData,
//           setResumeData,
//           handleProfilePicture,
//           handleChange,
//           headerColor,
//           backgroundColorss,
//         }}
//       >
//         <Meta
//           title="ATSResume | Get hired with an ATS-optimized resume"
//           description="ATSResume is a cutting-edge resume builder that helps job seekers create a professional, ATS-friendly resume in minutes..."
//           keywords="ATS-friendly, Resume optimization..."
//         />

//         {!isFinished && (
//           <div className="flex">
//             {/* <LoadUnload /> */}
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//               <MyResume />
//             </Modal>
//             <div className="relative">
//               {/* Toggle button for smaller screens */}
//               <button
//                 onClick={toggleSidebar}
//                 className="md:hidden p-2 text-black bg-indigo-100 fixed top-4 left-4 z-50 rounded"
//               >
//                 ☰
//               </button>

            
//               <Sidebar />
//             </div>
//             <div>
//               <div className="flex justify-center">
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   disabled={currentSection === 0}
//                   className="rounded-lg border-2 bg-blue-950  w-full lg:w-40 text-white px-10 py-1"
//                 >
//                   Previous
//                 </button>

//                 <aside
//                   className={`h-full bg-gray-100 p-4  transform ${
//                     isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//                   } transition-transform duration-300 ease-in-out`}
//                 >
//                   <ul className="flex space-x-2 text-center">
//                     {sections.map((section, index) => (
//                       <li
//                         key={index}
//                         className={`px-4 py-2 cursor-pointer ${
//                           currentSection === index
//                             ? "rounded-lg border-2 border-blue-800 font-bold bg-blue-950 text-white px-10 py-1"
//                             : "rounded-lg border-2 bg-white border-blue-800  text-blue-800 px-10 py-1"
//                         }`}
//                         onClick={() => handleSectionClick(index)}
//                       >
//                         {section.label}
//                       </li>
//                     ))}
//                   </ul>
//                 </aside>
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="rounded-lg px-10 font-bold bg-blue-500 w-full lg:w-40 text-white p-1"
//                 >
//                   {currentSection === sections.length - 1 ? "Finish" : "Next"}
//                 </button>
//               </div>

//               <div className="lg:flex justify-center bg-gray-200 p-2 px-5">
//                 {/* <button
//                 type="button"
//                 onClick={toggleSidebar}
//                 className="p-2 bg-blue-900 text-white rounded-lg"
//               >
//                 {isSidebarOpen ? "☰" : "☰"}
//               </button> */}
//                 {/* <button
//                   type="button"
//                   onClick={handlePrevious}
//                   disabled={currentSection === 0}
//                   className="rounded-lg border-2 bg-blue-950  w-full lg:w-40 text-white px-10 py-1"
//                 >
//                   Previous
//                 </button> */}

//                 <div className="lg:flex gap- content-center  justify-between bg-gray-200 p-1 px-5 lg:block hidden">
//                   <select
//                     value={selectedFont}
//                     onChange={handleFontChange}
//                     className="rounded-lg border-2 border-blue-800 font-bold text-blue-800 lg:block hidden m-2  px-5 py-2  bg-white  "
//                   >
//                     <option value="Ubuntu">Ubuntu</option>
//                     <option value="Calibri">Calibri</option>
//                     <option value="Georgia">Georgia</option>
//                     <option value="Roboto">Roboto</option>
//                     <option value="Poppins">Poppins</option>
//                   </select>

//                   <ColorPicker
//                     selectedColor={headerColor}
//                     onChange={setHeaderColor}
//                   />
//                   <ColorPickers
//                     selectmultiplecolor={backgroundColorss}
//                     onChange={setBgColor}
//                   />
//                   <TemplateSelector
//                     selectedTemplate={selectedTemplate}
//                     setSelectedTemplate={setSelectedTemplate}
//                   />
//                 </div>

//                 {/* <button
//                   type="button"
//                   onClick={handleNext}
//                   className="rounded-lg px-10 font-bold bg-blue-500 w-full lg:w-40 text-white p-1"
//                 >
//                   {currentSection === sections.length - 1 ? "Finish" : "Next"}
//                 </button> */}
//               </div>

//               <div
//                 className="flex flex-col md:flex-row md:mx-auto md:h-screen overflow-y-auto"
//                 style={{ fontFamily: selectedFont }}
//               >
//                 {/* <div className="flex">
//                 <aside
//                   className={` h-full bg-gray-100 p-4  z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
//                 >
//                   <ul className="space-y-2 text-center">
//                     {sections.map((section, index) => (
//                       <li
//                         key={index}
//                         className={`p-2 cursor-pointer ${currentSection === index ? "rounded-3xl border-y-2 border-blue-800 font-bold bg-blue-950 text-white" : "border-2 bg-white border-blue-800 rounded-3xl text-blue-800"}`}
//                         onClick={() => handleSectionClick(index)}
//                       >
//                         {section.label}
//                       </li>
//                     ))}
//                   </ul>
//                 </aside>
//               </div> */}

//                 <form className=" p-3">
//                   {sections[currentSection].component}
//                 </form>

//                 <PDFExport ref={pdfExportComponent} {...pdfExportOptions}>
//                   <div className="bg-white lg:block hidden">
//                     <Preview selectedTemplate={selectedTemplate} />
//                   </div>
//                 </PDFExport>
//               </div>
//             </div>
//           </div>
//         )}
//         {isFinished && (
//           <div className="">
//             <div className="lg:flex lg:justify-between  bg-gray-200 p-2 px-5">
//               <div className="lg:flex  gap-4 flex-row justify-center bg-gray-200">
//                 <select
//                   value={selectedFont}
//                   onChange={handleFontChange}
//                   className="rounded-lg border-2 border-blue-800 lg:px-8 p-2 m-2 font-bold bg-white text-blue-800"
//                 >
//                   <option value="Ubuntu">Ubuntu</option>
//                   <option value="Calibri">Calibri</option>
//                   <option value="Georgia">Georgia</option>
//                   <option value="Roboto">Roboto</option>
//                   <option value="Poppins">Poppins</option>
//                 </select>
//                 <ColorPicker
//                   selectedColor={headerColor}
//                   onChange={setHeaderColor}
//                 />
//                 <ColorPickers
//                   selectmultiplecolor={backgroundColorss}
//                   onChange={setBgColor}
//                 />
//                 <TemplateSelector
//                   selectedTemplate={selectedTemplate}
//                   setSelectedTemplate={setSelectedTemplate}
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={handleFinish}
//                 // disabled={isFinished} // Optional, disable if already finished
//                 className="bg-blue-950 text-white px-5 py-2 p-1  rounded-lg"
//               >
//                 Save
//               </button>

//               {loading && (
//                 <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
//                   <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64 align-middle text-white font-semibold text-lg">
//                     Loading...
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="button"
//                 className="rounded-lg px-10 lg:ms-2 font-bold bg-blue-950 text-white p-1"
//                 onClick={handleDownload}
//                 disabled={loading}
//               >
//                 Pay & Download
//               </button>
//               <button
//                 type="button"
//                 className="rounded-lg px-10 lg:ms-2 font-bold bg-blue-950 text-white p-1"
//                 onClick={handleBackToPrevious}
//               >
//                 Back to previous
//               </button>
//             </div>

//             <div className="overflow-y-auto md:h-screen mx-auto">
//               {/* <PDFExport ref={pdfExportComponent} {...pdfExportOptions}> */}
//               <div className="bg-white" style={{ fontFamily: selectedFont }}>
//                 <Preview selectedTemplate={selectedTemplate} />
//               </div>
//               {/* </PDFExport> */}
//             </div>
//           </div>
//         )}
//       </ResumeContext.Provider>
//     </>
//   );
// }



// export { ResumeContext };

import React, { useState, useRef, useEffect, useContext } from "react";
import Language from "../components/form/Language";
import axios from "axios";
import Meta from "../components/meta/Meta";
import FormCP from "../components/form/FormCP";
import dynamic from "next/dynamic";
import DefaultResumeData from "../components/utility/DefaultResumeData";
import SocialMedia from "../components/form/SocialMedia";
import WorkExperience from "../components/form/WorkExperience";
import Skill from "../components/form/Skill";
import PersonalInformation from "../components/form/PersonalInformation";
import Summary from "../components/form/Summary";
import Projects from "../components/form/Projects";
import Education from "../components/form/Education";
import Certification from "../components/form/certification";
import ColorPicker from "./ColorPicker";
import ColorPickers from "./ColorPickers";
import Preview from "../components/preview/Preview";
import TemplateSelector from "../components/preview/TemplateSelector";
import { PDFExport } from "@progress/kendo-react-pdf";
import LoadUnload from "../components/form/LoadUnload";
import MyResume from "./dashboard/MyResume";
import { useRouter } from "next/router";
import Sidebar from "./dashboard/Sidebar";
import toast from "react-hot-toast";
import LoaderButton from "../components/utility/LoaderButton";
import useLoader from "../hooks/useLoader";
import Modal from "./adminlogin/Modal";
import { Menu, X } from 'lucide-react';
import Image from "next/image";
import resumeImg from "./builderImages/GraphicDesignerResume.jpg";
import poweredbypaypal from "./builderImages/poweredbypaypal.png";
import paypal from "./builderImages/paypal.png";
import logo from "./builderImages/logo.jpg";
import applepay from "./builderImages/apple-pay.png";
import { ResumeContext } from "../components/context/ResumeContext";

const Print = dynamic(() => import("../components/utility/WinPrint"), {
  ssr: false,
});

export default function WebBuilder() {
  // const [resumeData, setResumeData] = useState(DefaultResumeData);
  const [formClose, setFormClose] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  // const [selectedFont, setSelectedFont] = useState("Ubuntu");
  // const [headerColor, setHeaderColor] = useState("");
  // const [backgroundColorss, setBgColor] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isFinished, setIsFinished] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pdfExportComponent = useRef(null);
  const [isLoading, handleAction] = useLoader();
  const { PayerID } = router.query;
  const [isSaved, setIsSaved] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const templateRef = useRef(null);
  const {resumeData ,setResumeData, setHeaderColor,setBgColor,setSelectedFont,selectedFont,backgroundColorss,headerColor} = useContext(ResumeContext)

  useEffect(() => {
    setUserId(localStorage.getItem("user_id"));
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      const { id } = router.query;
      const token = localStorage.getItem('token');

      if (id && token) {
        try {
          const response = await axios.get(`https://api.novajobs.us/api/user/resume-list/${id}`, {
            headers: {
              Authorization: token,
            },
          });

          if (response.data.status === 'success') {
            const { data } = response.data;
            const parsedData = JSON.parse(data.ai_resume_parse_data);
            
            // Update state with fetched data
            setResumeData(parsedData.templateData);
            
            // Set background color and template
            if (parsedData.templateData.templateDetails) {
              setBgColor(parsedData.templateData.templateDetails.backgroundColor || '');
              setHeaderColor(parsedData.templateData.templateDetails.backgroundColor );
              setSelectedTemplate(parsedData.templateData.templateDetails.templateId || 'template1');
            }
          }
        } catch (error) {
          console.error('Error fetching resume data:', error);
          toast.error('Failed to fetch resume data');
        }
      }
    };

    fetchResumeData();
  }, [router.query]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      const storedIsFinished = localStorage.getItem("isFinished");
      const storedTemplate = localStorage.getItem("selectedTemplate");
      const storedFont = localStorage.getItem("selectedFont");
      const storedBgColor = localStorage.getItem("backgroundColor");
      const storedCurrentSection = localStorage.getItem("currentSection");
      // const storedResumeData = localStorage.getItem("resumeData");

      if (storedIsFinished) setIsFinished(JSON.parse(storedIsFinished));
      if (storedTemplate && !selectedTemplate) setSelectedTemplate(storedTemplate);
      if (storedFont) setSelectedFont(storedFont);
      if (storedBgColor && !backgroundColorss) setBgColor(storedBgColor);
      if (storedCurrentSection)
        setCurrentSection(parseInt(storedCurrentSection));
      // if (storedResumeData && !resumeData) setResumeData(JSON.parse(storedResumeData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isFinished", JSON.stringify(isFinished));
      localStorage.setItem("selectedTemplate", selectedTemplate);
      localStorage.setItem("selectedFont", selectedFont);
      localStorage.setItem("headerColor", headerColor);
      localStorage.setItem("backgroundColor", backgroundColorss);
      localStorage.setItem("currentSection", currentSection.toString());
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [
    isFinished,
    selectedTemplate,
    selectedFont,
    headerColor,
    backgroundColorss,
    currentSection,
    resumeData,
  ]);

  useEffect(() => {
    const savedState = localStorage.getItem("isSaved");
    if (savedState === "true") {
      setIsSaved(true);
    }
  }, []);

  useEffect(() => {
    if (isSaved) {
      setIsSaved(false);
      localStorage.setItem("isSaved", "false");
    }
  }, [resumeData]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaved]);

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("/").pop();
    setResumeId(id);
  }, []);

  const sections = [
    { label: "Personal Details", component: <PersonalInformation /> },
    { label: "Social Links", component: <SocialMedia /> },
    { label: "Summary", component: <Summary /> },
    { label: "Education", component: <Education /> },
    { label: "Experience", component: <WorkExperience /> },
    { label: "Projects", component: <Projects /> },
    {
      label: "Skills",
      component: Array.isArray(resumeData?.skills) ? (
        resumeData.skills.map((skill, index) => (
          <Skill title={skill.title} key={index} />
        ))
      ) : (
        <p>No skills available</p>
      ),
    },
    { label: "Languages", component: <Language /> },
    { label: "Certifications", component: <Certification /> },
  ];

  // const handleProfilePicture = (e) => {
  //   const file = e.target.files[0];
  //   if (file instanceof Blob) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setResumeData({ ...resumeData, profilePicture: event.target.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentSection === sections.length - 1) {
      localStorage.setItem("tempResumeData", JSON.stringify(resumeData));
      localStorage.setItem("tempHeaderColor", headerColor);
      localStorage.setItem("tempBgColor", backgroundColorss);
      localStorage.setItem("tempFont", selectedFont);
      setIsFinished(true);
    } else {
      setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
    }
  };

  useEffect(() => {
    if (isFinished) {
      const tempResumeData = localStorage.getItem("tempResumeData");
      const tempHeaderColor = localStorage.getItem("tempHeaderColor");
      const tempBgColor = localStorage.getItem("tempBgColor");
      const tempFont = localStorage.getItem("tempFont");

      if (tempResumeData) setResumeData(JSON.parse(tempResumeData));
      if (tempHeaderColor) setHeaderColor(tempHeaderColor);
      if (tempBgColor) setBgColor(tempBgColor);
      if (tempFont) setSelectedFont(tempFont);
    }
  }, [isFinished]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("tempResumeData");
      localStorage.removeItem("tempHeaderColor");
      localStorage.removeItem("tempBgColor");
      localStorage.removeItem("tempFont");
    };
  }, []);

  const handlePrevious = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSectionClick = (index) => {
    setCurrentSection(index);
    setIsMobileMenuOpen(false);
  };

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      handleSectionClick(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      handleSectionClick(currentSection - 1);
    }
  };

  const pdfExportOptions = {
    paperSize: "A4",
    fileName: "resume.pdf",
    author: resumeData.firstName + " " + resumeData.lastName,
    creator: "ATSResume Builder",
    date: new Date(),
    scale: 0.8,
    forcePageBreak: ".page-break",
  };

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);


 

  // const downloadAsPDF = async () => {
  //   if (!templateRef.current) {
  //     toast.error("Template reference not found");
  //     return;
  //   }
  
  //   try {
  //     // Get the HTML content from the template
  //     const htmlContent = templateRef.current.innerHTML;
  
  //     // Generate the full HTML for the PDF
  //     const fullContent = `
  //       <style>
  //         @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  //       </style>
  //       ${htmlContent}
  //     `;
  
  //     // API call to generate the PDF
  //     const response = await axios.post(
  //       'https://api.novajobs.us/api/user/generate-pdf1',
  //       { html: fullContent },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: token,
  //         },
  //       }
  //     );
  
  //     // Check if the file path was returned
  //     const filePath = response.data.data?.file_path;
  //     if (!filePath) {
  //       throw new Error('PDF file path not received');
  //     }
  
  //     // Construct the URL
  //     const downloadUrl = `https://api.novajobs.us${filePath}`;
  
  //     // Open the URL in a new tab
  //     window.open(downloadUrl, '_blank');
  
  //     toast.success('PDF generated and opened in a new tab!');
  //   } catch (error) {
  //     console.error('PDF generation error:', error);
  //     toast.error(
  //       error.response?.data?.message || 'Failed to generate and open PDF'
  //     );
  //   }
  // };
 
  
  
  
  const downloadAsPDF = async () => {
    if (!templateRef.current) {
      toast.error("Template reference not found");
      return;
    }
  
    try {
      // Step 1: Generate PDF
      const htmlContent = templateRef.current.innerHTML;
  
      // Full HTML content with Tailwind styles
      const fullContent = `
        <style>
          @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        </style>
        ${htmlContent}
      `;
  
      // API call to generate PDF
      const pdfResponse = await axios.post(
        "https://api.novajobs.us/api/user/generate-pdf1",
        { html: fullContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
  
      // Check for PDF file path
      const filePath = pdfResponse.data.data?.file_path;
      if (!filePath) {
        throw new Error("PDF file path not received");
      }
  
      // Construct download URL
      const downloadUrl = `https://api.novajobs.us${filePath}`;
      toast.success("PDF generated successfully!");
  
      // Step 2: Checkout API Call
      const parsedResumeId = parseInt(resumeId, 10);
      if (isNaN(parsedResumeId)) {
        throw new Error("Invalid resume ID; unable to convert to an integer.");
      }
  
      const checkoutResponse = await axios.post(
        "https://api.novajobs.us/api/user/payment/checkout",
        {
          plan_id: 1,
          resume_id: parsedResumeId, // Use integer here
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      // Check for successful response
      const redirectUrl = checkoutResponse.data.data; // Adjust the key if necessary
      if (redirectUrl) {
        toast.success("Checkout successful! Redirecting...");
        window.location.href = redirectUrl; // Redirects user to payment page
      } else {
        throw new Error("No redirect URL found in checkout response.");
      }
  
      // Optionally, open the PDF in a new tab
      window.open(downloadUrl, "_blank");
      toast.success("PDF opened in a new tab!");
    } catch (error) {
      console.error("Error during process:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to complete the PDF generation or checkout process."
      );
    }
  };
  
  
  useEffect(() => {
    if (PayerID) {
      verifyPayment();
    }
  }, [PayerID]);

  const verifyPayment = async () => {
    try {
      const orderId = localStorage.getItem("orderid");
      const token = localStorage.getItem("token");

      if (orderId && token && PayerID) {
        const response = await axios.get(
          `https://api.novajobs.us/api/user/paypal/verify-order?orderid=${orderId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          setPaymentVerified(true);
          toast.success("Payment verified successfully!");

          localStorage.removeItem("orderid");

          if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
          }
        } else {
          toast.error("Payment verification failed. Please try again.");
          router.push("/payment-failed");
        }
      }
    } catch (error) {
      console.error("Payment Verification Error:", error);
      toast.error(
        error?.response?.data?.message || "Payment verification failed"
      );
      router.push("/payment-failed");
    }
  };

  const handleFinish = async () => {
    if (!resumeData) return;

    const templateData = {
      templateData: {
        name: resumeData.name || "",
        position: resumeData.position || "",
        contactInformation: resumeData.contact || "",
        email: resumeData.email || "",
        address: resumeData.address || "",
        profilePicture: resumeData.profilePicture || "",
        socialMedia:
          resumeData.socialMedia?.map((media) => ({
            socialMedia: media.platform || "",
            link: media.link || "",
          })) || [],
        summary: resumeData.summary || "",
        education:
          resumeData.education?.map((edu) => ({
            school: edu.school || "",
            degree: edu.degree || "",
            startYear: edu.startYear || "",
            endYear: edu.endYear || "",
          })) || [],
        workExperience:
          resumeData.workExperience?.map((exp) => ({
            company: exp.company || "",
            position: exp.position || "",
            description: exp.description || "",
            KeyAchievements: Array.isArray(exp.keyAchievements)
              ? exp.keyAchievements
              : [exp.keyAchievements || ""],
            startYear: exp.startYear || "",
            endYear: exp.endYear || "",
          })) || [],
        projects:
          resumeData.projects?.map((project) => ({
            title: project.title || "",
            link: project.link || "",
            description: project.description || "",
            keyAchievements: Array.isArray(project.keyAchievements)
              ? project.keyAchievements
              : [project.keyAchievements || ""],
            startYear: project.startYear || "",
            endYear: project.endYear || "",
            name: project.name || "",
          })) || [],
        skills: Array.isArray(resumeData.skills)
          ? resumeData.skills.map((skill) => ({
              title: skill.title || "",
              skills: skill.skills || [],
            }))
          : [],
        languages: resumeData.languages || [],
        certifications: resumeData.certifications || [],
        templateDetails: {
          templateId: selectedTemplate,
          backgroundColor: backgroundColorss || "",
          font: selectedFont || "Ubuntu",
        },
      },
    };

    await handleAction(async () => {
      try {
        const id = router.query.id || localStorage.getItem("resumeId");
        if (!id) {
          console.error("Resume ID not found.");
          return;
        }

        const url = `https://api.novajobs.us/api/user/resume-update/${id}`;
        const response = await axios.put(url, templateData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (response.data.code === 200 || response.data.status === "success") {
          setIsSaved(true);
          localStorage.setItem("isSaved", "true");
          toast.success(response.data.message || "Resume saved Successfully");
        } else {
          toast.error(response.data.error || "Error while saving the Resume");
        }
      } catch (error) {
        toast.error(error?.message || "Error !!");
        console.error("Error updating resume:", error);
      }
    });
  };

  

 

  const handleBackToEditor = () => {
    // localStorage.setItem("tempResumeData", JSON.stringify(resumeData));
    localStorage.setItem("tempHeaderColor", headerColor);
    localStorage.setItem("tempBgColor", backgroundColorss);
    localStorage.setItem("tempFont", selectedFont);
    setIsFinished(false);
    setCurrentSection(0);
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userProfileResponse = await axios.get(
          "https://api.novajobs.us/api/jobseeker/user-profile",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (userProfileResponse.data.status === "success") {
          const userData = userProfileResponse.data.data;
          setFormData((prevData) => ({
            ...prevData,
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            phone: userData.phone || "",
            email: userData.email || "",
          }));
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // console.log(resumeData,"");

  return (
    <>
      <Meta
        title="NovaJobs.US - AI Resume Builder"
        description="ATSResume is a cutting-edge resume builder that helps job seekers create a professional, ATS-friendly resume in minutes..."
        keywords="ATS-friendly, Resume optimization..."
      />

      <div className="min-h-screen bg-gray-50">
       

        {!isFinished ? (
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="w-full bg-gray-200 p-4 shadow-sm">
              <div className="hidden md:flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex w-full lg:w-auto gap-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentSection === 0}
                    className="w-40 h-10 rounded-lg bg-blue-950 text-white font-medium transition hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-40 h-10 rounded-lg bg-yellow-500 text-black font-medium transition hover:bg-yellow-400"
                  >
                    {currentSection === sections.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                  <select
                    value={selectedFont}
                    onChange={handleFontChange}
                    className="w-40 h-10 rounded-lg border border-blue-800 px-4 font-bold text-blue-800 bg-white focus:ring-2 focus:ring-blue-800"
                  >
                    <option value="Ubuntu">Ubuntu</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                  </select>

                  <div className="flex items-center gap-4">
                    {/* <ColorPicker
                      selectedColor={headerColor}
                      onChange={setHeaderColor}
                    /> */}
                    <ColorPickers
                      selectmultiplecolor={backgroundColorss}
                      onChange={setBgColor}
                    />
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                      setSelectedTemplate={setSelectedTemplate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-0 z-10 w-full bg-white shadow-sm">
              <div className="hidden md:flex justify-center items-center p-4">
                <nav className="bg-gray-100 rounded-lg p-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => prevSection()}
                      className="p-2 hover:bg-gray-200 rounded-lg "
                      disabled={currentSection === 0}
                    >
                      {/* Chevron Left Icon Here */}
                    </button>

                    <div className="flex-1 overflow-x-auto scrollbar-hide ">
                      <ul className="flex flex-row gap-3 items-center py-2 px-4  ">
                        {sections.map((section, index) => (
                          <li
                            key={index}
                            className={`px-4 py-2 cursor-pointer transition rounded-lg border-2 ${
                              currentSection === index
                                ? "border-blue-800 font-semibold bg-blue-950 text-white"
                                : "border-blue-800 bg-white text-blue-800 hover:bg-blue-50"
                            }`}
                            onClick={() => handleSectionClick(index)}
                          >
                            {section.label}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => nextSection()}
                      className="p-2 hover:bg-gray-200 rounded-lg "
                      disabled={currentSection === sections.length - 1}
                    >
                      {/* Chevron Right Icon Here */}
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            <div className="flex flex-col md:flex-row flex-grow ">
            

             

              <aside
                className={`fixed md:static left-0 top-0 h-full z-10 transform 
                                
                                md:translate-x-0 transition-transform duration-300 ease-in-out 
                                w-64 bg-gray-100 border-r`}
              >
                <div className="sticky top-20 p-4 overflow-y-auto h-full">
                  <div className="mt-12 md:mt-0">
                    <Sidebar />
                  </div>
                </div>
              </aside>

              <main className="flex-1 max-w-2xl mx-auto md:p-4">
                <form>{sections[currentSection].component}</form>
              </main>

              <aside className="  w-1/2 min-h-screen border-l bg-gray-50">
                <div className="sticky top-20 p-4">
                 
                    <Preview ref={templateRef} selectedTemplate={selectedTemplate} />
                 
                </div>
              </aside>
            </div>

          </div>
        ) : (
          <div className=" flex flex-col">
            

            <div className="hidden md:flex w-screen px-8 py-4 justify-between items-center bg-white shadow">
              <div className="flex gap-4">
                <select
                  value={selectedFont}
                  onChange={handleFontChange}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="Ubuntu">Ubuntu</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                </select>
                {/* <ColorPicker
                  selectedColor={headerColor}
                  onChange={setHeaderColor}
                /> */}
                <ColorPickers
                  selectmultiplecolor={backgroundColorss}
                  onChange={setBgColor}
                />
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleFinish}
                  className="bg-blue-950 text-white px-6 py-2 rounded-lg"
                >
                  Save Resume
                </button>
                <button
                  onClick={downloadAsPDF}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-lg"
                >
                  Pay & Download
                </button>
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className=" w-full max-w-4xl bg-white rounded-lg shadow-lg ">
                      <div className="flex justify-between items-center p-2">
                        <Image src={logo} alt="logo" className="h-10 w-auto" />
                        <button
                          className=" text-gray-600 hover:text-gray-800 z-20"
                          onClick={handleCloseModal}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 w-full p-4  ">
                          <div className="w-[400px] h-[400px]">
                            <Image
                              src={resumeImg}
                              alt="resumeimg"
                              className="w- full h-full rounded-l-lg"
                            />
                          </div>
                        </div>

                        <div className="md:w-1/2 w-full p-4 ">
                          <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                              $49
                            </h2>
                            <p className="text-sm text-gray-500">
                              Total Amount
                            </p>
                          </div>

                          <form>
                            <div className="mb-4">
                              <label className="block text-gray-800 mb-2">
                                👨🏻‍💼 Name
                              </label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={`${formData.first_name} ${formData.last_name}`.trim()}
                                name="full name"
                                required
                                disabled
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-800 mb-2">
                                📧 Email
                              </label>
                              <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                value={formData.email}
                                required
                                name="email"
                                disabled
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-800 mb-2">
                                ☎️ Phone
                              </label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                                required
                                disabled
                                type="number"
                                name="phone"
                                value={formData.phone}
                              />
                            </div>

                            <div className="flex justify-center mt-6">
                              <button
                                onClick={downloadAsPDF}
                                
                                type="submit"
                                className="w-full bg-yellow-400 text-blue-800 font-bold  rounded-[50px] hover:bg-yellow-500 transition duration-200"
                              >
                                <Image
                                  src={paypal}
                                  alt="paypal"
                                  className="h-10 w-auto m-auto"
                                />
                              </button>
                            </div>
                            <div className="flex justify-center mt-6">
                              <button className="w-full bg-black text-white font-bold  rounded-[50px] transition duration-200  ">
                                <Image
                                  src={applepay}
                                  alt="apple pay"
                                  className=" w-auto m-auto h-10"
                                />
                              </button>
                            </div>
                            <div className="flex justify-center mt-6 ">
                              <Image
                                src={poweredbypaypal}
                                alt="poweredbypaypal"
                                className="h-10 w-auto"
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleBackToEditor}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="z-10">
            
                <Preview ref={templateRef} selectedTemplate={selectedTemplate} />
            
            </div>
          </div>
        )}
      </div>
    </>
  );
}



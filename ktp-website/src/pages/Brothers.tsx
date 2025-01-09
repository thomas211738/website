// src/pages/Brothers.tsx
import { useEffect } from "react";
import { useState } from "react";
import fallbackImage from "../img/KTPLogo.jpeg";
import Icons from '../components/Icons';

import { useContext } from "react";
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";

function Brothers() {
  //DB DATA
  const { userData, pictureData } = useContext(DataBaseDataContext);

  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [activeTab, setActiveTab] = useState("Actives");
  const [brotherName, setBrotherName] = useState([]);
  const [eboardName, setEboardName] = useState([]);
  const [alumniName,setAlumniName] = useState([]);


  //TypeWriter Functions
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const Sentences = ["Developers", "Engineers", "Innovators", "Leaders", "Researchers"];
  useEffect(() => {
    const typeWriter = () => {
      const current_sentence = Sentences[currentSentenceIndex];
      if (charIndex < current_sentence.length) {
        setCurrentText(
          (prev) => current_sentence.substring(0, charIndex + 1)
        );
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          if (currentSentenceIndex + 1 < Sentences.length) {
            setCurrentSentenceIndex(currentSentenceIndex + 1);
            setCurrentText(""); // Reset the base text
          } else {
            setCurrentSentenceIndex(0);
            setCurrentText(""); // Reset the base text
          }
        }, 1500); // Pause before transitioning to the next word
      }
    };
    const typingTimeout = setTimeout(typeWriter, 100); // Typing speed
    return () => clearTimeout(typingTimeout);
  }, [charIndex, currentSentenceIndex]);

  const filterAndCategorizeNames = (data) => {
    const brothers = data.filter((brother) => !brother.Eboard_Position);
    const eboardMembers = data.filter((brother) => !!brother.Eboard_Position); // Handles truthy values
  
    return { brothers, eboardMembers };
  };


  const groupByClass = (brothers) => {
    return brothers.reduce((classMap, brother) => {
      const className = brother.Class || "Unknown"; // Default to "Unknown" if Class is missing
      if (!classMap[className]) {
        classMap[className] = [];
      }
      classMap[className].push(brother);
      return classMap;
    }, {});
  };

  const letters = [
    "Omega", "Psi", "Chi", "Phi", "Upsilon", "Tau", "Sigma", "Rho",
    "Pi", "Omicron", "Xi", "Nu", "Mu", "Lambda", "Kappa", "Iota",
    "Theta", "Eta", "Zeta", "Epsilon", "Delta", "Gamma", "Beta", "Alpha", "Co-founder"
  ];
  const errorHandlingLinkedIn = (linkedIn) => {
    if (!linkedIn) {
      // If LinkedIn is empty, return the default company page
      return "https://www.linkedin.com/company/kappa-theta-pi-lambda-chapter/";
    }
    if (linkedIn.startsWith("https://")) {
      // If it already starts with https://, return as is
      return linkedIn;
    }
    if (linkedIn.startsWith("www.linkedin.com")) {
      // If it starts with www.linkedin.com, prepend https://
      return `https://${linkedIn}`;
    }
    // Otherwise, assume it's just the username and construct the full URL
    return `https://www.linkedin.com/in/${linkedIn}`;
  };
  

  useEffect(() => {
    if (userData && pictureData) { 
        // Fetch users and pictures
        let users = userData;
        let alumni = users.filter((user) => user.Position === 4);
        setAlumniName(alumni)
        users = users.filter((user) => user.Position === 2 || user.Position === 3 || user.Position ===5);
        const pictures = pictureData;

  
        // Join users with pictures based on `_id` and `websitePic`
        const brothersWithPictures = users.map((user) => {
          let pictureUrl = null; // ititialize as null
          // Find the matching picture
          const userPicture = pictures.find((pic) => pic._id === user.websitePic);
          // If a matching picture is found, set the pictureUrl
         // Use if statements to determine the correct URL
          if (userPicture) {
            pictureUrl = `data:image/jpeg;base64,${userPicture.data}`; // Base64-encoded image
          } else {
            pictureUrl = fallbackImage; // Fallback to default image path
          }

          console.log("User Data with Picture:", {
            user,
            userPicture,
            pictureUrl,
          });
          // Return a new user object with the pictureUrl field added
          return {
            ...user,
            pictureUrl: pictureUrl,
          };
        });
        // Categorize into brothers and e-board members
        const { brothers, eboardMembers } = filterAndCategorizeNames(brothersWithPictures);
  
        // Update state
        setBrotherName(brothers);
        setEboardName(eboardMembers);
      
    };
  }, [userData, pictureData]); 


  return (
    <div className="w-full py-8 px-4">
      {/* Typewriter Effect */}
      {/* Centered Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">
          Our Brothers Are{" "}
          <span className="underline decoration-2 underline-offset-2">
            {currentText}
          </span>
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Our fraternity is made up of diverse individuals from various
          backgrounds and disciplines. Each brother brings their own unique
          perspective and talents to our community.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-8 border-b pb-2">
        <button
          className={`font-bold ${
            activeTab === "Actives" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Actives")}
        >
          Actives
        </button>
        <button
          className={`font-bold ${
            activeTab === "E-Board" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("E-Board")}
        >
          E-Board
        </button>
        <button
          className={`font-bold ${
            activeTab === "Alumni" ? "text-black border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Alumni")}
        >
          Alumni
        </button>
      </div>


      {/* Conditional Rendering Based on Active Tab */}
      <div className="mt-6 w-full text-center">
        {activeTab === "Actives" && (
          // Show Brothers grouped and sorted by Custom Order
          <div>
            {brotherName.length === 0 ? ( // Check if brothers are still loading
              <p>Loading brothers...</p>
            ) : (
              Object.entries(groupByClass(brotherName))
                .sort(([classA], [classB]) => {
                  // Sort using the custom order defined in `letters`
                  const indexA = letters.indexOf(classA);
                  const indexB = letters.indexOf(classB);
                  return indexA - indexB; // Compare indices
                })
                .map(([className, brothers]) => (
                  <div key={className} className="mb-12">
                    {/* Class Section Header */}
                    <h2 className="text-xl items-center text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
                      {className === "Co-founder" ? "Founding" : className} Class
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-5 mx-auto max-w-7xl text-gray-700">
                      {brothers.map((brother, index) => (
                        <li key={index} className="flex flex-col items-center justify-between text-center space-y-2 group">
                          {/* Profile Image and linkedIn */}
                          <a
                            href={errorHandlingLinkedIn(brother.LinkedIn)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-56 h-56"
                          >
                            <img
                              src={brother.pictureUrl}
                              alt={`${brother.FirstName || "Unknown"} ${brother.LastName || "Brother"}`}
                              className="w-56 h-56 object-cover object-top rounded-md"
                            />
                            {/* LinkedIn Icon - Appears on Hover */}
                            <div className="w-56 h-56 absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 text-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Icons.Linkedin/>
                            </div>
                          </a>
                          <span>
                            {brother.FirstName} {brother.LastName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            )}
          </div>
        )}
        {activeTab === "E-Board" && (
          // Show E-Board Members
          <div className="mt-6">
          {/* Header */}
          <h2 className="text-xl items-center text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
            Kappa Theta Pi Executive Board
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-5 mx-auto max-w-6xl text-gray-700">
            {eboardName.length > 0 ? (
              eboardName.map((member, index) => (
                <li
                  key={index}
                  className="flex flex-col items-center justify-between text-center space-y-1 group"
                >
                  {/* Profile Image */}
                  {/* Profile Image and linkedIn */}
                  <a
                    href={
                      errorHandlingLinkedIn(member.LinkedIn)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-56 h-56"
                    >
                    <img
                      src={member.pictureUrl}
                      alt={`${member.FirstName || "Unknown"} ${member.LastName || "Member"}`}
                      className="w-56 h-56 object-cover object-top rounded-md"
                    />
                    {/* LinkedIn Icon - Appears on Hover */}
                    <div className="w-56 h-56 absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 text-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Icons.Linkedin />
                    </div>
                  </a>
                  <span>
                    {member.FirstName} {member.LastName}
                  </span>
                  {/* Display E-Board Position */}
                  <span className="text-sm text-gray-500">{member.Eboard_Position}</span>
                </li>
              ))
            ) : (
              <p>Loading e-board members...</p>
            )}
          </ul>
        </div>
        )}
        {activeTab === "Alumni" && (
          <div className="mt-6">
            <h2 className="text-xl items-center text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
              Kappa Theta Pi Alumni
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-4 mx-auto max-w-6xl text-gray-700">
              {alumniName.length > 0 ? (
                alumniName.map((alumnus, index) => (
                  <li
                    key={index}
                    className="text-lg text-center"
                  >
                    {alumnus.FirstName} {alumnus.LastName}
                  </li>
                ))
              ) : (
                <p>Loading alumni...</p>
              )}
            </ul>
          </div>
        )}
      </div> {/* Last Div for the brothers/eboard/alumni*/}


    {/* Last Div for the brothers/eboard/alumni*/}
    </div>
  );
}

export default Brothers;

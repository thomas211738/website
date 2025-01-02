// src/pages/Brothers.tsx
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import fallbackImage from "../img/KTPLogo.jpeg";


function Brothers() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [activeTab, setActiveTab] = useState("Actives");
  const [brotherName, setBrotherName] = useState([]);
  const [eboardName, setEboardName] = useState([]);


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and pictures
        const userResponse = await axios.get(`${backendUrl}/users`);
        const pictureResponse = await axios.get(`${backendUrl}/websitePics`);
        console.log("Loaded Data")
        let users = userResponse.data.data;
        users = users.filter((user) => user.Position === 2 || user.Position === 3 || user.Position ===5);
        const pictures = pictureResponse.data.data;
  
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


      } catch (error) {
        console.error("Error fetching and joining data:", error);
      }
    };
  
    fetchData();
  }, [backendUrl]);


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Typewriter Effect */}
      <div className="text-center">
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
      </div>


      {/* Conditional Rendering Based on Active Tab */}
      <div className="mt-6">
        {activeTab === "Actives" ? (
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
                  <div key={className} className="mb-20">
                    {/* Class Section Header */}
                    <h2 className="text-xl items-center text-center font-semibold mb-8">{className} Class</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 max-w-fit mx-auto text-gray-700">
                      {brothers.map((brother, index) => (
                        <li key={index} className="flex flex-col items-center text-center space-y-2">
                          {/* Render the Base64 image */}
                          <img
                            src={brother.pictureUrl}
                            alt={`${brother.FirstName || "Unknown"} ${brother.LastName || "Brother"}`}
                            className="w-40 h-40 object-cover object-top"
                          />
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
        ) : (
          // Show E-Board Members
          <div className="mt-12">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 max-w-fit mx-auto text-gray-700">
              {eboardName.length > 0 ? (
                eboardName.map((member, index) => (
                  <li key={index} className="flex flex-col items-center text-center space-y-2">
                    {/* Render the Base64 image */}
                    <img
                      src={member.pictureUrl} // Use pictureUrl as-is
                      alt={`${member.FirstName || "Unknown"} ${member.LastName || "Member"}`}
                      className="w-40 h-40 object-cover object-top"
                    />
                    <span>{member.FirstName} {member.LastName}</span>
                    <span>{member.Eboard_Position}</span>
                  </li>
                ))
              ) : (
                <p>Loading e-board members...</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Brothers;

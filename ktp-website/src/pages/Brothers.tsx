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
    const brothers = data.filter((brother) => brother.Position === 2);
    const eboardMembers = data.filter((brother) => brother.Position === 3);
  
    return { brothers, eboardMembers };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and pictures
        const userResponse = await axios.get(`${backendUrl}/users`);
        const pictureResponse = await axios.get(`${backendUrl}/websitePics`);
  
        let users = userResponse.data.data;
        users = users.filter((user) => user.Position === 2 || user.Position === 3);
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
        const brothers = brothersWithPictures.filter((user) => user.Position === 2);
        const eboardMembers = brothersWithPictures.filter((user) => user.Position === 3);
  
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
            // Show Brothers
            <ul className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
              {brotherName.length > 0 ? (
                brotherName.map((brother, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    {/* Render the Base64 image */}
                    <img
                      src={brother.pictureUrl} // Use pictureUrl as-is
                      alt={`${brother.FirstName} ${brother.LastName}`}
                      className="w-16 h-16 rounded-full"
                    />
                    <span>{brother.FirstName} {brother.LastName}</span>
                  </li>
                ))
              ) : (
                <p>Loading brothers...</p>
              )}
            </ul>
          ) : (
            // Show E-Board Members
            <ul className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
              {eboardName.length > 0 ? (
                eboardName.map((member, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    {/* Render the Base64 image */}
                    <img
                      src={member.pictureUrl} // Use pictureUrl as-is
                      alt={`${member.FirstName} ${member.LastName}`}
                      className="w-16 h-16 rounded-full"
                    />
                    <span>{member.FirstName} {member.LastName}</span>
                  </li>
                ))
              ) : (
                <p>Loading e-board members...</p>
              )}
            </ul>
          )}
        </div>
    </div>
  );
}

export default Brothers;





  // useEffect(() => {
  //   axios.get(`${backendUrl}/users`)
  //     .then((response) => {
  //       const { brothers, eboardMembers } = filterAndCategorizeNames(response.data.data);
  //       setBrotherName(brothers);
  //       setEboardName(eboardMembers);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${backendUrl}/websitePics`)
  //     .then((response) => {
  //       setBrotherPicture(response.data.data);
  //       console.error("Count", response.data.count);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching brother pictures:", error);
  //     });
  // }, []);

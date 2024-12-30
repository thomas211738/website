// src/pages/Brothers.tsx
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function Brothers() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [activeTab, setActiveTab] = useState("Actives");
  const [brotherName, setBrotherName] = useState([]);
  const [eboardName, setEboardName] = useState([]);
  const [brotherPicture, setBrotherPicture] = useState([]);

  const filterAndCategorizeNames = (data) => {
    const brothers = data.filter((brother) => brother.Position === 2);
    const eboardMembers = data.filter((brother) => brother.Position === 3);
  
    return { brothers, eboardMembers };
  };

  useEffect(() => {
    axios.get(`${backendUrl}/users`)
      .then((response) => {
        const { brothers, eboardMembers } = filterAndCategorizeNames(response.data.data);
        setBrotherName(brothers);
        setEboardName(eboardMembers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/websitePics`)
      .then((response) => {
        setBrotherPicture(response.data.data);
        console.error("Count", response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching brother pictures:", error);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Meet the Brothers</h1>
      <p className="text-gray-700 leading-relaxed">
        Our fraternity is made up of diverse individuals from various
        backgrounds and disciplines. Each brother brings their own unique
        perspective and talents to our community.
      </p>

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
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            {brotherName.length > 0 ? (
              brotherName.map((brother, index) => (
                <li key={index}>
                  {brother.FirstName} {brother.LastName}
                </li>
              ))
            ) : (
              <p>Loading brothers...</p>
            )}
          </ul>
        ) : (
          // Show E-Board Members
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            {eboardName.length > 0 ? (
              eboardName.map((member, index) => (
                <li key={index}>
                  {member.FirstName} {member.LastName}
                </li>
              ))
            ) : (
              <p>Loading e-board members...</p>
            )}
          </ul>
        )}
      </div>


    
      <p className="text-gray-700 mt-4">
        We pride ourselves on our strong bond and the support we provide to each
        other, both academically and socially.
      </p>
    </div>
  );
}

export default Brothers;

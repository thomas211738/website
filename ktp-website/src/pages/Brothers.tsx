// src/pages/Brothers.tsx
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function Brothers() {

  const [brotherName, setbrotherName] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/users`)
      .then((response) => {
        setbrotherName(response.data.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(brotherName[10])

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Meet the Brothers</h1>
      <p className="text-gray-700 leading-relaxed">
        Our fraternity is made up of diverse individuals from various
        backgrounds and disciplines. Each brother brings their own unique
        perspective and talents to our community.
      </p>

      {/* Dynamically Render Brother Names */}
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

      <p className="text-gray-700 mt-4">
        We pride ourselves on our strong bond and the support we provide to each
        other, both academically and socially.
      </p>
    </div>
  );
}

export default Brothers;


// useEffect(() => {
//   const VITE_mongoDBURL = import.meta.env.VITE_mongoDBURL;
//   console.log("API URL:", VITE_mongoDBURL); 
// }, []);
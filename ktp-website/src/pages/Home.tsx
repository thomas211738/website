import { Link } from "react-router-dom";
import josh from "../img/josh.jpeg"; 
import ktp1 from "../img/ktp1.jpeg";
import ktp2 from "../img/ktp2.jpeg";
import paul from "../img/paul_tye.jpeg";
import ryanc from "../img/ryanc.jpeg";
import ryanch from "../img/ryanch.jpeg";
import seth from "../img/seth.png";
import yana from "../img/yana.jpeg";

/**
 * Home Component
 * Displays the homepage with a collage of images and a description of Kappa Theta Pi.
 * Includes responsive layouts for desktop/tablet and mobile screens.
 */
function Home() {
  return (
    <div className="min-h-screen">
      {/*
        Desktop/Tablet Layout (Visible on screens with custom breakpoint and larger)
        Contains:
        - Left: Image collage (positioned absolutely for custom layout)
        - Right: Text content with a title, description, and button linking to the "About" page
      */}
      <div className="hidden custom:flex items-center justify-center px-4">
        {/* LEFT: Image Collage */}
        <div className="relative w-[800px] h-[800px] md:mr-8 mb-8 md:mb-0">
          {/* Individual images positioned absolutely within the collage container */}
          <div className="absolute top-[390px] left-[500px] w-[166px] h-[166px] shape-big rounded-br-[80px] overflow-hidden shadow-lg">
            <img src={josh} alt="Josh" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[236px] left-[288px] w-[182px] h-[182px] shape-big rounded-tr-[80px] overflow-hidden shadow-lg">
            <img src={ktp1} alt="KTP 1" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[527px] left-[34px] w-[145px] h-[142px] shape-big rounded-bl-[80px] overflow-hidden shadow-md">
            <img src={ktp2} alt="KTP 2" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[92px] left-[30px] w-[220px] h-[220px] shape-big rounded-tl-[80px] overflow-hidden shadow-md">
            <img src={paul} alt="Paul & Tye" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[126px] left-[288px] w-[76px] h-[76px] shape-big rounded-[20px] overflow-hidden shadow-md">
            <img src={ryanc} alt="Ryan C" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[370px] left-[140px] w-[114px] h-[114px] shape-big rounded-bl-[80px] overflow-hidden shadow-md">
            <img src={ryanch} alt="Ryan Ch" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[92px] left-[428px] w-[106px] h-[106px] shape-big rounded-tr-[80px] overflow-hidden shadow-md">
            <img src={seth} alt="Seth" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[462px] left-[298px] w-[130px] h-[130px] shape-big rounded-br-[80px] overflow-hidden shadow-md">
            <img src={yana} alt="Yana" className="object-cover w-full h-full" />
          </div>
        </div>

        {/* RIGHT: Kappa Theta Pi text/content */}
        <div className="max-w-lg text-left">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[#134b91]">
            Kappa Theta Pi
          </h1>
          {/* Description */}
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          {/* Button linking to the About page */}
          <div className="space-x-4">
            <Link to="/About">
              <button className="bg-[#134b91] text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                About us &#8250;
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/*
        Mobile Layout (Visible on screens below custom breakpoint)
        Contains:
        - Text content only (no image collage)
      */}
      <div className="custom:hidden flex flex-col items-center justify-center px-4">
        <div className="max-w-lg text-left pt-8 pb-16">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-[#134b91]">
            Kappa Theta Pi
          </h1>
          {/* Description */}
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          {/* Button linking to the About page */}
          <div className="space-x-4">
            <Link to="/About">
              <button className="bg-[#134b91] text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                About us &#8250;
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

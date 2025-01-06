import { Link } from "react-router-dom";
import ktp1 from "../img/ktp1.jpeg";
import ktp2 from "../img/ktp2.jpeg";
import paul from "../img/paul_tye.jpeg";
import ryanc from "../img/ryanc.jpeg";
import ryanch from "../img/ryanch.jpeg";
import yana from "../img/yana.jpeg";
import trio from "../img/Brandon Eric and Rohan.jpg";
import patrick from "../img/Pat 2.jpeg";

/* NETWORK IMAGES */
import amazon from "../img/amazon.png";
import bh from "../img/bh.png";          
import bny from "../img/bny.png";     
import comcast from "../img/comcast.png";
import gd from "../img/gd.png";        
import hancock from "../img/hancock.png"; 
import jp from "../img/jp.png";         
import liberty from "../img/liberty.jpg"; 
import microsoft from "../img/microsoft.png";
import pwc from "../img/pwc.png";       
import redhat from "../img/redhat.png";
import spark from "../img/spark.png";   
import stryker from "../img/stryker.png";
import tiffany from "../img/Tiffany.png"; 
import textron from "../img/textron.png"; 
import nomura from "../img/Nomura.png";
import capitalOne from "../img/CapitalOne.png";
import citizens from "../img/Citizens.png";
import ey from "../img/EY.png";
import savvas from "../img/Savvas.png";
import scotiabank from "../img/Scotia.png";
import mit from "../img/MIT.png";
import mbta from "../img/MBTA.png";
import fresenius from "../img/Fresenius.png";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Desktop/Tablet Layout */}
      <div className="hidden custom:flex items-center justify-center px-4">
        <div className="relative w-[800px] h-[800px] md:mr-8 mb-8 md:mb-0">
          <div className="absolute top-[390px] left-[500px] w-[240px] h-[166px] shape-big rounded-br-[80px] overflow-hidden shadow-lg">
            <img src={ktp2} alt="KTP 2" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[236px] left-[288px] w-[182px] h-[182px] shape-big rounded-tr-[80px] overflow-hidden shadow-lg">
            <img src={ktp1} alt="KTP 1" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[527px] left-[34px] w-[170px] h-[142px] shape-big rounded-bl-[80px] overflow-hidden shadow-md">
            <img src={trio} alt="Trio" className="object-cover w-full h-full" />
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
          <div className="absolute top-[80px] left-[435px] w-[106px] h-[150px] shape-big rounded-tr-[80px] overflow-hidden shadow-md">
            <img src={patrick} alt="Patrick" className="object-cover w-full h-full" />
          </div>
          <div className="absolute top-[462px] left-[298px] w-[130px] h-[130px] shape-big rounded-br-[80px] overflow-hidden shadow-md">
            <img src={yana} alt="Yana" className="object-cover w-full h-full" />
          </div>
        </div>
        <div className="max-w-lg text-left">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[#134b91]">
            Kappa Theta Pi
          </h1>
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          <div className="space-x-4">
            <Link to="/About">
              <button className="bg-[#134b91] text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                About us &#8250;
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="custom:hidden flex flex-col items-center justify-center px-4">
        <div className="max-w-lg text-left pt-8 pb-16">
          <h1 className="text-4xl font-bold mb-4 text-[#134b91]">
            Kappa Theta Pi
          </h1>
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          <div className="space-x-4">
            <Link to="/About">
              <button className="bg-[#134b91] text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                About us &#8250;
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* NETWORK SECTION */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#134b91]">Our Network</h2>
        
        <div className="max-w-screen-lg mx-auto grid grid-cols-6 gap-8 place-items-center">

          {/* Modify heights or styles as desired */}
          <img src={amazon} alt="Amazon" className="h-12" />
          <img src={bh} alt="Boston Hacks" className="h-8" />
          <img src={bny} alt="BNY Mellon" className="h-10" />
          <img src={comcast} alt="Comcast" className="h-8" />
          <img src={gd} alt="General Dynamics" className="h-6" />
          <img src={hancock} alt="John Hancock" className="h-8" />
          <img src={jp} alt="JP Morgan" className="h-12" />
          <img src={liberty} alt="Liberty Mutual" className="h-12" />
          <img src={microsoft} alt="Microsoft" className="h-6" />
          <img src={pwc} alt="PwC" className="h-10" />
          <img src={redhat} alt="Red Hat" className="h-14" />
          <img src={spark} alt="BU Spark" className="h-12" />
          <img src={stryker} alt="Stryker" className="h-8" />
          <img src={tiffany} alt="Tiffany & Co" className="h-15" />
          <img src={textron} alt="Textron" className="h-15" />
          <img src={nomura} alt="Nomura" className="h-5" />
          <img src={capitalOne} alt="Capital One" className="h-13" />
          <img src={citizens} alt="Citizens" className="h-5" />
          <img src={ey} alt="EY" className="h-10" />
          <img src={savvas} alt="Savvas Learning" className="h-11" />
          <img src={scotiabank} alt="Scotiabank" className="h-6" />
          <img src={mit} alt="MIT" className="h-8" />
          <img src={mbta} alt="MBTA" className="h-8" />
          <img src={fresenius} alt="Fresenius" className="h-8" />
        </div>
      </section>
    </div>
  );
}

export default Home;

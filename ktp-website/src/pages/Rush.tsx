import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import gsap from 'gsap';
import { ReactLenis } from 'lenis/react';
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";


function Rush() {
  const lenisRef = useRef<{ lenis?: { on: (event: string, handler: (e: any) => void) => void, raf: (time: number) => void } } | null>(null);
  const [, setScrollY] = useState(0);
  const dataContext = React.useContext(DataBaseDataContext);
  const userData = dataContext?.userData;
  const pictureData = dataContext?.pictureData;
  const vpOfRecruitment = userData?.find((user: { Eboard_Position: string; }) => user.Eboard_Position === 'VP of Recruitment');
  const vpOfRecruitmentPic = pictureData?.find((pic: { _id: string }) => pic._id === vpOfRecruitment?.websitePic);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    const handleScroll = (e: { scroll: React.SetStateAction<number>; }) => {
      setScrollY(e.scroll); // Update scroll position
    };

    lenisRef.current?.lenis?.on('scroll', handleScroll);
    gsap.ticker.add(update);


  }, []);


  return (
    <ReactLenis root>
      <div className="w-full h-[300vh] relative">
        <Canvas>
          <Scene />
        </Canvas>

        {window.innerWidth >= 1024 && (
          <>
            <div
              className="absolute top-[9.5%] left-[50%] transform -translate-x-1/2 text-white text-[13rem] font-sfpro"
              
            >
              RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
            </div>
            <div
              className="absolute top-[19%] left-[6.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
            >
              EST 2012
            </div>
            <div
              className="absolute top-[19%] left-[41.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro"
            >
              BOSTON
            </div>
            <div
              className="absolute top-[19%] right-[28.75%] transform translate-x-1/2 text-white text-[0.8rem] font-sfpro"
            >
              LAMBDA
            </div>
          </>
        )}
      </div>

      <div className="w-full">
  {/* Title Section */}
  <div className="flex flex-col items-center justify-center text-center">
    <div className="mt-10 text-gray-700 text-5xl font-sfpro font-bold mb-4">
      Welcome to{" "}
      <span className="bg-ktp-appblue text-white px-2 py-1 rounded inline-block leading-relaxed">
        Spring 2025
      </span>{" "}
      Rush!
    </div>
    <div className="mt-1 text-3xl text-gray-400 font-bold">
      Learn about joining KTP
    </div>
  </div>

  {/* Button Section */}
  <div className="mt-10 flex justify-center space-x-4">
    <button className="bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
      <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
        Interest Form{" "}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &#8250;
        </span>
      </a>
    </button>
    <button className="bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
      <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
        Application Form{" "}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &#8250;
        </span>
      </a>
    </button>
  </div>

  {/* VP Recruitment Section */}
  <div className="flex flex-col md:flex-row items-center justify-center my-20 px-10">
    {/* Image Section */}
    <div className="mb-6 md:mb-0">
      <img
      src={`data:image/jpeg;base64,${vpOfRecruitmentPic?.data}`}
      alt={`${vpOfRecruitment?.FirstName} ${vpOfRecruitment?.LastName}`}
      className="rounded-md shadow-lg object-cover w-60 h-120"
      />
    </div>

    {/* Text Section */}
    <div className="bg-gray-100 p-6 rounded-md md:ml-10">
      <h1 className="text-2xl text-ktp-appblue font-bold mb-4">
        Why Rush KTP?
      </h1>
      <p className="text-base mb-4">Dear Prospective Members,</p>
      <p className="text-base mb-4 max-w-prose">
        As the Vice President of Recruitment of Kappa Theta Pi, I invite you to
        Rush KTP and become part of our exceptional organization. As the first
        technology fraternity, we offer unique opportunities for members to
        develop skills, knowledge, and professional networks. Our community
        shares a strong passion and commitment for technology and innovation.
        We prioritize building a strong brotherhood and promoting social
        activities with members from a multitude of backgrounds. This
        multidisciplinary membership provides a unique opportunity for members
        to learn and advance from each other.
      </p>
      <p className="text-base">
        Sincerely,
        <br />
        {vpOfRecruitment?.FirstName} {vpOfRecruitment?.LastName}
        <br />
        {vpOfRecruitment?.Eboard_Position}
      </p>
    </div>
  </div>
</div>

    </ReactLenis>
  );
}

export default Rush;

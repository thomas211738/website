import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '../components/Scene';
import gsap from 'gsap';
import { ReactLenis } from 'lenis/react';
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";
import axios from 'axios';
import { RushEvents } from '../components/Timeline';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Define the type of your Rush Event if using TypeScript
interface RushEvent {
  _id?: string; // optional if coming from MongoDB
  Name: string;
  Day: string;
  Time: string;
  Location: string;
  Description: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-300 py-4 cursor-pointer" onClick={onClick}>
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">{question}</h3>
      <span className="text-blue-700 text-2xl">{isOpen ? '-' : '+'}</span>
    </div>
    {isOpen && <p className="text-gray-600 mt-2">{answer}</p>}
  </div>
);

function Rush() {
  const lenisRef = useRef<{
    lenis?: { on: (event: string, handler: (e: any) => void) => void; raf: (time: number) => void }
  } | null>(null);
  const [, setScrollY] = useState(0);
  const dataContext = React.useContext(DataBaseDataContext);
  const userData = dataContext?.userData;
  const pictureData = dataContext?.pictureData;
  const vpOfRecruitment = userData?.find(
    (user: { Eboard_Position: string }) => user.Eboard_Position === 'VP of Recruitment'
  );
  const vpOfRecruitmentPic = pictureData?.find(
    (pic: { _id: string }) => pic._id === vpOfRecruitment?.websitePic
  );

  const [openQuestion, setOpenQuestion] = useState(null);
  const faqs = [
    { question: "Who can rush KTP?", answer: "Anyone is allowed to rush — we gladly accept (and encourage) rushees from all disciplines! The only requirement is that you must have at least 3 semesters left in school after your pledging semester." },
    { question: "What is KTP looking for?", answer: "There’s no cookie cutter “ideal” rushee — if there were, Kappa Theta Pi wouldn’t be the multi-talented, interdisciplinary organization that it is! In our experience, the qualities you’re looking for are often what we’d love to have in new members. In the end, we are an org united by our love for technology, and people who are truly passionate about tech are the ones who usually fit in the best." },
    { question: "How would I benefit from KTP?", answer: "KTP offers a supportive community of undergraduates who are all passionate about technology! Among other things, we offer mentoring in areas such as career advising, interview prep, resume development, and coursework. Additionally, we have current members and alumni working everywhere from the brightest startups to the tech giants of the corporate world. We believe that networking is far more than just professionalism — it's a process built on friendship, trust, and brotherhood." },
    { question: "Which majors are represented in KTP?", answer: "KTP is made up of a diverse group of people from schools all across campus. Generally, our members tend to be computer science majors or in the School of Information, but we are proud to have actives with backgrounds in creative writing, philosophy, business, women’s studies, and entrepreneurship! We love (and encourage) rushees from all disciplines." },
    { question: "What types of social events does KTP have?", answer: "KTP aims to have at minimum one sober and one non-sober event per month. In the past, we have had barn dances, bowling nights, formals, Smash tournaments, and many more events." },
    { question: "How much of a time commitment is pledging?", answer: "As with all campus organizations, what you get out of the organization depends on what you put into it. We believe that our pledging process isn’t strenuous and could be accommodated by most schedules.\nIf you have any further questions or want to learn more about KTP before rush, feel free to send us an email at ktp-board@umich.edu or stop by our booths at Festifall and Northfest." },
  ];
  const toggleQuestion = (index: any) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  

  // 3) Use the same events state you set up
  const [events, setEvents] = useState<RushEvent[]>([]);
  const backendUrl1 = import.meta.env.VITE_BACKEND_URL1;

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    const handleScroll = (e: { scroll: React.SetStateAction<number> }) => {
      setScrollY(e.scroll); // Update scroll position
    };

    lenisRef.current?.lenis?.on('scroll', handleScroll);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Started Loading Data");
        const userResponse = await axios.get(`${backendUrl1}/events`);
        setEvents(userResponse.data.data);
      } catch (error) {
        console.error("Error fetching data in App:", error);
      }
    };
    fetchData();
  }, [backendUrl1]);

  return (
    <ReactLenis root>
      {/* Existing Hero / Canvas Section */}
      {window.innerWidth >= 1024 && (
        <div className="w-full h-[300vh] relative">
          <Canvas>
            <Scene />
          </Canvas>
          <div className="absolute top-[9.5%] left-[50%] transform -translate-x-1/2 text-white text-[13rem] font-sfpro">
            RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
          </div>
          <div className="absolute top-[19%] left-[6.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro">
            EST 2012
          </div>
          <div className="absolute top-[19%] left-[41.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro">
            BOSTON
          </div>
          <div className="absolute top-[19%] right-[28.75%] transform translate-x-1/2 text-white text-[0.8rem] font-sfpro">
            LAMBDA
          </div>
        </div>
      )}

      <div className="w-full">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mt-10 text-5xl font-sfpro font-bold mb-4">
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
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Interest Form{" "}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &#8250;
              </span>
            </a>
          </button>
          <button className="bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
            <a
              href="https://www.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
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
            {vpOfRecruitmentPic?.data ? (
              // Once the image data is available, render the image
              <img
                src={`data:image/jpeg;base64,${vpOfRecruitmentPic?.data}`}
                alt={`${vpOfRecruitment?.FirstName} ${vpOfRecruitment?.LastName}`}
                className="rounded-md shadow-lg object-cover w-60 h-120"
              />
            ) : (
              <Skeleton width={240} height={350} />
            )}
            
          </div>

          {/* Text Section */}
          <div className="bg-gray-100 p-6 rounded-md md:ml-10">
            <h1 className="text-2xl text-ktp-appblue font-bold mb-4">
              Why Rush KTP?
            </h1>
            <p className="text-base mb-4">Dear Prospective Members,</p>
            <p className="text-base mb-4 max-w-prose">
              As the Vice President of Recruitment of Kappa Theta Pi, I invite you
              to Rush KTP and become part of our exceptional organization. As the
              first technology fraternity, we offer unique opportunities for
              members to develop skills, knowledge, and professional networks. Our
              community shares a strong passion and commitment for technology and
              innovation. We prioritize building a strong brotherhood and
              promoting social activities with members from a multitude of
              backgrounds. This multidisciplinary membership provides a unique
              opportunity for members to learn and advance from each other.
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

        {/* 4) Rush Events Timeline Section (Bottom of Page) */}
        <div className="px-4 py-10">
          <h2 className="text-center text-2xl sm:text-4xl font-black text-ktp-appblue mb-10">
            Upcoming Rush Events
          </h2>
          {/* Pass your "events" state directly to RushEvents */}
          <RushEvents events={events} />
        </div>

        <div className="mt-16 mb-16 relative z-10">
          <h2 className="text-center text-2xl sm:text-4xl font-black text-ktp-appblue mb-10">Frequently Asked Questions</h2>
          <div className="space-y-8 px-20">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openQuestion === index}
                onClick={() => toggleQuestion(index)}
              />
            ))}
          </div>
        </div>

      </div>
    </ReactLenis>
  );
}

export default Rush;

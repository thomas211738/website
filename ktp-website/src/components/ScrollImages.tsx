import React, { useState, useEffect } from 'react';
import alpha_professional from '../img/2023 Spring 1.jpg';
import delta_initiation from '../img/delta initiation.jpeg';
import alpha_initiation from '../img/Alpha Initiation.jpg';
import YouTubeVideo from './YoutubeVideo';

const ScrollImages = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    const secondImageOffset = Math.max(0, scrollY - windowHeight);
    const thirdImageOffset = Math.max(0, scrollY - 2 * windowHeight);

    const secondImageStyle = {
        transform: `translateY(${Math.max(windowHeight - secondImageOffset, 0)}px)`,
    };

    const thirdImageStyle = {
        transform: `translateY(${Math.max(windowHeight - thirdImageOffset, 0)}px)`,
    };

    return (
        <div className="relative flex justify-center items-center">
            <img
                src={alpha_professional}
                alt="First"
                className="absolute w-auto h-60 object-cover"
            />

            <img
                src={delta_initiation}
                alt="Second"
                className="absolute w-auto h-60 object-cover transition-transform duration-300"
                style={secondImageStyle}
            />

            <img
                src={alpha_initiation}
                alt="Third"
                className="absolute w-auto h-60 object-cover transition-transform duration-300"
                style={thirdImageStyle}
            />

            <YouTubeVideo />
        </div>
    );
};

export default ScrollImages;

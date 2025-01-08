import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

const BackToTop = () =>{
    const {pathname: CurrentPath } = useLocation()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // Adds the smooth scrolling effect
          });


    }, [CurrentPath]);

    return null; // React components must return something, even if it's null
};

export default BackToTop;
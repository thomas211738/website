import { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ktplogo from "../img/KTPLogo.jpeg";
import { Link } from "react-router-dom";

const pages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Brothers", path: "/brothers" },
    { name: "Rush", path: "/rush" },
    { name: "Contact", path: "/contact" },
];

const Header = () => {
    /* Tracks page scrolling */
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Closes menu if window resizes > 640px */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setAnchorElNav(null);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* Handles menu toggle */
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <header
            className={`px-4 sm:px-12 py-2 sticky top-0 z-50 bg-white ${
                isScrolled ? "shadow-md" : ""
            } flex justify-between transition-shadow duration-300`}
        >
            {/* KTP Logo */}
            <Link to="/">
                <img src={ktplogo} alt="KTP Logo" className="w-14" />
            </Link>

            {/* Collapsed menu on small screens */}
            <div className="flex grow sm:hidden">
                <button className="ml-auto" onClick={handleOpenNavMenu}>
                    <MenuIcon className="text-black" fontSize="large" />
                </button>

                <Menu
                    id="menu-appbar"
                    className="block sm:hidden"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                >
                    {pages.map((page, index) => (
                        page.external ? (
                            <a
                                key={index}
                                href={page.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mx-4 my-2 text-black hover:text-ktp-appblue"
                                onClick={handleCloseNavMenu}
                            >
                                {page.name}
                            </a>
                        ) : (
                            <Link
                                key={index}
                                className="block mx-4 my-2 text-black hover:text-ktp-appblue"
                                to={page.path}
                                onClick={handleCloseNavMenu}
                            >
                                {page.name}
                            </Link>
                        )
                    ))}
                </Menu>
            </div>

            {/* Regular navbar */}
            <div className="m-auto hidden sm:flex grow justify-center align-middle space-x-10">
                {pages.map((page, index) => (
                    page.external ? (
                        <a
                            key={index}
                            href={page.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block my-2 text-base text-black hover:text-ktp-appblue"
                        >
                            {page.name}
                        </a>
                    ) : (
                        <Link
                            key={index}
                            className="block my-2 text-base text-black hover:text-ktp-appblue"
                            to={page.path}
                        >
                            {page.name}
                        </Link>
                    )
                ))}
            </div>
        </header>
    );
};
export default Header;

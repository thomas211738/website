/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                "ktp-darkblue": "#234c8b",
                "ktp-blue": "#458eff",
                "ktp-lightblue": "#8bb9ff",
                "ktp-darkgreen": "#538b52",
                "ktp-green": "#8dddd8",
                "ktp-lightgreen": "#baecab",
            },
            maxWidth: {
                "4/5": "80%",
            },
        },
    },
    plugins: [],
};

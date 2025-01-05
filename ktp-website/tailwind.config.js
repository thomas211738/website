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
            custom: "1220px", 
        },
        extend: {
            fontFamily: {
                sfpro: ['SF Pro', 'sans-serif'],
                monospace: ['Monaco', 'Courier New', 'monospace'],
                bebasneue: ['Bebas Neue']
            },
            colors: {
                ktp: {
                    darkblue: "#234c8b",
                    blue: "#458eff",
                    lightblue: "#8bb9ff",
                    appblue: "#134b91",
                    darkgreen: "#538b52",
                    green: "#8dddd8",
                    lightgreen: "#baecab",
                },
            },
            maxWidth: {
                "4/5": "80%",
            },
        },
    },
    plugins: [],
};

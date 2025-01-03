// src/pages/Home.tsx
import ChatWidget from "../components/ChatWidget";

function Home() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Home Page</h1>
            <p className="text-gray-700">
                Welcome to the Home page! This is where you can put any kind of
                intro or main content.
            </p>
            <ChatWidget />
        </div>
    );
}

export default Home;

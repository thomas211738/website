// src/App.tsx

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Brothers from "./pages/Brothers";
import Rush from "./pages/Rush";
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import Header from "./components/Header";
import Footer from "./components/Footer";

import ChatbotProvider from "./contexts/ChatbotContext";

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header at the top */}
            <Header />
            <ChatbotProvider>
                {/* Main content area (grow to fill) */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/brothers" element={<Brothers />} />
                        <Route path="/rush" element={<Rush />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/*" element={<Error />} />
                    </Routes>
                </main>
            </ChatbotProvider>
            {/* Footer at the bottom */}
            <Footer />
        </div>
    );
}

export default App;

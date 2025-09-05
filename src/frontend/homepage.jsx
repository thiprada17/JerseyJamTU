import { useRef, useEffect } from "react";
import SignIn from "./Login";
import SignUp from "./SignUp";
import "./homepage.css";
import cartImg from "../assets/cart.png";
import backgroundImg from "../assets/homepage.png";
import speakerImg from "../assets/speaker.png";


export default function Homepage() {
    const loginRef = useRef(null);
    const homeRef = useRef(null);
    const signupRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (homeRef.current) {
            homeRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";  
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="homepage-container">
            <div ref={loginRef} className="section login-section">
                <SignIn scrollToHome={() => scrollToSection(homeRef)} />
            </div>

            <div ref={homeRef} className="section home-section"
                style={{ backgroundImage: `url(${backgroundImg})` }}>
                <img src={cartImg} alt="cart" className="cart" />
                <img src={speakerImg} alt="speaker" className="speaker-icon"
                    onClick={() => speakText("Welcome to Jersey Jam T U Marketplace")}
                />
                <div className="action-buttons">
                    <button className="signup-btn" onClick={() => scrollToSection(signupRef)}> Sign Up </button>
                    <button className="login-btn" onClick={() => scrollToSection(loginRef)}> Login</button>
                </div>
            </div>

            <div ref={signupRef} className="section signup-section">
                <SignUp scrollToHome={() => scrollToSection(homeRef)} />
            </div>
        </div>
    );
}



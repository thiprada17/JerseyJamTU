import { useRef, useEffect, useState } from "react";
import SignIn from "./Login";
import SignUp from "./SignUp";
import "./homepage.css";
import cartImg from "../assets/cart.png";
import backgroundImg from "../assets/homepage.png";
import speakerImg from "../assets/speaker.png";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "./component/Toast";


export default function Homepage() {
    const loginRef = useRef(null);
    const homeRef = useRef(null);
    const signupRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);
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

    useEffect(() => {
        if (location.state?.showSuccessToast) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    }, [location.state]);


    return (
        <div className="homepage-container">
            {showToast && <Toast message="✅ Add Jersey success!" />}
            <div ref={loginRef} className="section login-section">
                <SignIn
                    scrollToHome={() => scrollToSection(homeRef)}
                    scrollToSignup={() => scrollToSection(signupRef)}
                />
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
                    <button className="login-btn" onClick={() => navigate('/sellerform')}> Seller </button>
                </div>
            </div>

            <div ref={signupRef} className="section signup-section">
                <SignUp
                    scrollToHome={() => scrollToSection(homeRef)}
                    scrollToLogIn={() => scrollToSection(loginRef)}
                />            </div>
        </div>
    );

}



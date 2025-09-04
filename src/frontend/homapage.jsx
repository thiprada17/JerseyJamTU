import { useRef, useEffect } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import "./homepage.css";
import cartImg from "../assets/cart.png";
import backgroundImg from "../assets/homepage.png";


export default function Homepage() {
    const loginRef = useRef(null);
    const homeRef = useRef(null);
    const signupRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // ✅ เริ่มต้นที่ section 2 (homeRef)
    useEffect(() => {
        if (homeRef.current) {
            homeRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, []);

    return (
        <div className="homepage-container">
            <div ref={loginRef} className="section login-section">
                <SignIn scrollToHome={() => scrollToSection(homeRef)} />
            </div>

            <div ref={homeRef} className="section home-section"
                style={{ backgroundImage: `url(${backgroundImg})` }}>
                <img src={cartImg} alt="cart" className="cart" />
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



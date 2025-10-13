import { useState, useEffect } from 'react';
import './shirtDisplay.css';
import defaultJerseyImage from '../assets/sampleShirt.png';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ShirtDisplay() {
    const navigate = useNavigate();
    const location = useLocation();
    const user_id = localStorage.getItem("user_id");
    const { id } = location.state;
    console.log(id)

    const handleBack = () => {
        navigate(-1); // ย้อนกลับไปอัน่ก่อน
    };
    const [shirtData, setshirtData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/shirt/info/get/${id}`, {
                    method: 'GET'
                });

                const data = await response.json();
                setshirtData(data[0]);

                console.log(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);



    const handleOrderClick = () => {
        window.open(shirtData.shirt_url, '_blank', 'noopener,noreferrer');
    };

    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        const CheckIsFavMai = async () => {
            try {
                const response = await fetch("http://localhost:8000/shirt/fav/check", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        shirt_id: id
                    })
                });

                const data = await response.json();
                setIsFavorited(data);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };
        CheckIsFavMai();
    }, []);

    const toggleFavorite = async () => {

        const favData = {
            user_id: user_id,
            shirt_id: shirtData.id,
            shirt_name: shirtData.shirt_name,
            shirt_pic: shirtData.shirt_pic
        };

        const favdelData = {
            user_id: user_id,
            shirt_id: shirtData.id,
        };
        try {
            if (!isFavorited) {
                const response = await fetch("http://localhost:8000/shirt/fav/post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(favData)
                });

                const data = await response.json();

                console.log(data);

            } else {
                const response = await fetch("http://localhost:8000/shirt/fav/del", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(favdelData)
                });


                const data = await response.json();

                console.log(data);
            }

            setIsFavorited(!isFavorited);

        } catch (error) {
            console.error("Fav posts:", error);
        }
    };


    return (
        <>
            <div className="shirtDisplay-topBar">
                <button className="shirtDisplay-backButton" onClick={handleBack}>
                    &lt; back
                </button>
            </div>
            {shirtData && (
                <div className="shirtDisplay-container" key={shirtData.id}>

                    <div className="shirtDisplay-wrapper">
                        <div className="shirtDisplay-left">
                            <button
                                className={`shirtDisplay-heartButton ${isFavorited ? 'active' : ''}`}
                                onClick={toggleFavorite}
                            >
                                {isFavorited ? '❤️' : '🤍'}
                            </button>
                            <h1 className="shirtDisplay-title">{shirtData.shirt_name}</h1>
                            <div className="shirtDisplay-priceWrapper">
                                <div className="shirtDisplay-priceLeft">
                                    <span className="shirtDisplay-priceLabel">price</span>
                                </div>
                                <div className="shirtDisplay-priceRight">
                                    <span className="shirtDisplay-priceValue">{shirtData.shirt_price}</span>
                                </div>
                            </div>
                            <div className="shirtDisplay-descriptionBox">
                                {shirtData.shirt_detail}
                            </div>

                            <div className="shirtDisplay-datesWrapper">
                                <div className="shirtDisplay-dateBox">
                                    <p>{shirtData.shirt_open_date}</p>
                                    <p>-----------------</p>
                                    <span>วันที่เปิดขาย</span>
                                </div>
                                <div className="shirtDisplay-separator"></div>
                                <div className="shirtDisplay-dateBox shirtDisplay-endDateBox">
                                    <p>{shirtData.shirt_close_date}</p>
                                    <p>-----------------</p>
                                    <span>วันที่ปิดขาย</span>
                                </div>
                            </div>
                            <button className="shirtDisplay-orderButton" onClick={handleOrderClick}>
                                Form สั่งซื้อเสื้อ
                            </button>
                        </div>
                        <div className="shirtDisplay-right">
                            <div className="shirtDisplay-imageContainer">
                                {/* <div className="shirtDisplay-countdownBadge">
                                    <span className="shirtDisplay-countdownTextTop">เหลืออีก</span>

                                    <div className="shirtDisplay-countdownRow">
                                        <div className="shirtDisplay-countdownCircle">
                                            <span className="shirtDisplay-countdownNumber">{shirtData.daysLeft}</span>
                                        </div>
                                        <span className="shirtDisplay-dayLabel">วัน</span>
                                    </div>

                                    <span className="shirtDisplay-countdownTextBottom">ก่อนปิดขาย</span>
                                </div> */}
                                <img
                                    src={shirtData.shirt_pic || defaultJerseyImage}
                                    alt="jersey"
                                    className="shirtDisplay-image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}

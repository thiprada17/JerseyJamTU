import { useState, useEffect } from 'react';
import './shirtDisplay.css';
import defaultJerseyImage from '../assets/sampleShirt.png';
import { useLocation } from 'react-router-dom';

export default function ShirtDisplay() {
    const location = useLocation();
    const { id } = location.state;
    console.log(id)

    const [shirtData, setshirtData] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/shirt/info/get/${id}`, {
                    method: 'GET'
                });

                const data = await response.json();
                setshirtData(data);

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

    return (
        <>

            <div className="shirtDisplay-topRedBar"></div>
            {shirtData.map((shirtData) => (
                <div className="shirtDisplay-container" key={shirtData.id}>

                    <div className="shirtDisplay-wrapper">
                        <div className="shirtDisplay-left">

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
            ))}
        </>
    );

}

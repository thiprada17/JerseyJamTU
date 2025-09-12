import React, { useState } from 'react';
import './shirtDisplay.css';
import defaultJerseyImage from '../assets/sampleShirt.png';

export default function ShirtDisplay() {
    const [shirtData] = useState({
        name: "Jersey name",
        price: 350,
        imageUrl: "",
        preorderStart: "10/5/68",
        preorderEnd: "31/5/68",
        daysLeft: 7,
        description: "รายละเอียด",
        orderFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfkjRQqC3VIlx6kvlN6HGnYjNi4UzhYWphdiRSweYpeAbAfGA/viewform?usp=header"
    });

    const handleOrderClick = () => {
        window.open(shirtData.orderFormUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <div className="shirtDisplay-topRedBar"></div>
            <div className="shirtDisplay-container">
                <div className="shirtDisplay-wrapper">
                    <div className="shirtDisplay-left">
                        <h1 className="shirtDisplay-title">{shirtData.name}</h1>
                        <div className="shirtDisplay-priceWrapper">
                            <div className="shirtDisplay-priceLeft">
                                <span className="shirtDisplay-priceLabel">price</span>
                            </div>
                            <div className="shirtDisplay-priceRight">
                                <span className="shirtDisplay-priceValue">{shirtData.price}</span>
                            </div>
                        </div>
                        <div className="shirtDisplay-descriptionBox">
                            {shirtData.description}
                        </div>

                        <div className="shirtDisplay-datesWrapper">
                            <div className="shirtDisplay-dateBox">
                                <p>{shirtData.preorderStart}</p>
                                <p>-----------------</p>
                                <span>วันที่เปิดขาย</span>
                            </div>
                            <div className="shirtDisplay-separator"></div> 
                            <div className="shirtDisplay-dateBox shirtDisplay-endDateBox">
                                <p>{shirtData.preorderEnd}</p>
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
                            <div className="shirtDisplay-countdownBadge">
                                <span className="shirtDisplay-countdownTextTop">เหลืออีก</span>

                                <div className="shirtDisplay-countdownRow">
                                    <div className="shirtDisplay-countdownCircle">
                                        <span className="shirtDisplay-countdownNumber">{shirtData.daysLeft}</span>
                                    </div>
                                    <span className="shirtDisplay-dayLabel">วัน</span>
                                </div>

                                <span className="shirtDisplay-countdownTextBottom">ก่อนปิดขาย</span>
                            </div>
                            <img
                                src={shirtData.imageUrl || defaultJerseyImage}
                                alt="jersey"
                                className="shirtDisplay-image"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}

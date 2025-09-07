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
                            <span className="shirtDisplay-priceLabel">price</span>
                            <span className="shirtDisplay-priceValue">{shirtData.price}</span>
                        </div>

                        <div className="shirtDisplay-descriptionBox">
                            {shirtData.description}
                        </div>

                        <div className="shirtDisplay-datesWrapper">
                            <div className="shirtDisplay-dateBox">
                                <p>{shirtData.preorderStart}</p>
                                <span>วันที่เปิดขาย</span>
                            </div>
                            <div className="shirtDisplay-dateBox shirtDisplay-endDateBox">
                                <p>{shirtData.preorderEnd}</p>
                                <span>วันที่ปิดขาย</span>
                            </div>
                        </div>

                        <button className="shirtDisplay-orderButton" onClick={handleOrderClick}>
                            Form สั่งซื้อเสื้อ
                        </button>
                    </div>

                    <div className="shirtDisplay-right">
                        <div className="shirtDisplay-countdownBadge">
                            <p className="shirtDisplay-countdownText">{shirtData.daysLeft}</p>
                            <span className="shirtDisplay-countdownSub">วัน<br />ก่อนปิดขาย</span>
                        </div>

                        <div className="shirtDisplay-imageContainer">
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

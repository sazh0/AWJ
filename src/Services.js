import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./services.css";
import BlueBox from "./assets/BlueBox.svg";
import RedBlueBox from "./assets/RedBlueBox.svg";
import AWJLOGO from "./assets/AWJLOGO.svg";
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { RiBuilding4Line, RiLightbulbLine } from 'react-icons/ri';

const Services = () => {
    const navigate = useNavigate();
    const [hoveredOption, setHoveredOption] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Initialize animations
    useEffect(() => {
        const contentElements = document.querySelectorAll('.fade-in');

        contentElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });

        // Show the subtext with slight delay
        setTimeout(() => {
            const subtext = document.querySelector('.text-wrapper-subtext');
            if (subtext) {
                subtext.style.opacity = '1';
                subtext.style.transform = 'translateY(0)';
            }
        }, 800);
    }, []);

    const handleService1Click = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedOption('existing');

        // Add a slight delay for the animation before navigation
        setTimeout(() => {
            navigate("/service-1");
            setIsAnimating(false);
        }, 600);
    };

    const handleService2Click = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedOption('new');

        // Add a slight delay for the animation before navigation
        setTimeout(() => {
            navigate("/service-2");
            setIsAnimating(false);
        }, 600);
    };

    return (
        <div className="services-page">
            <div
                className="back-arrow-container fade-in"
                onClick={() => navigate('/')}
                title="العودة إلى الصفحة الرئيسية"
            >
                <IoArrowBack className="back-arrow-n" />
                <span className="back-arrow-text">الرئيسية</span>
            </div>

            <img
                className="Logo fade-in"
                alt="شعار أوج"
                src={AWJLOGO}
                title="أوج"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />

            {/* Decorative elements */}
            <img className="BlueBox" alt="" src={BlueBox} aria-hidden="true" />
            <img className="RedBlueBox" alt="" src={RedBlueBox} aria-hidden="true" />

            <div className="text-wrapper fade-in">مرحبـــًا بـــك!</div>
            <div className="text-wrapper-1 fade-in">هل لديك شركة قائمة أم أنك رائد أعمال ترغب في بدء فكرة جديدة؟</div>
            <div className="text-wrapper-subtext fade-in">ستتمكن من الوصول إلى جميع خدماتنا بعد إنشاء حسابك</div>
            <div className="content-container">
                <div className="services-options-container">
                    <div className="services-cards-container">
                        <div
                            className={`service-card fade-in ${hoveredOption === 'existing' ? 'service-card-hovered' : ''} ${selectedOption === 'existing' ? 'service-card-selected' : ''}`}
                            onMouseEnter={() => setHoveredOption('existing')}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={handleService1Click}
                        >
                            <div className="service-card-icon">
                                <RiBuilding4Line className="icon" />
                            </div>
                            <h3 className="service-card-title">لدي شركة ناشئة قائمة</h3>
                            <p className="service-card-description">
                                تحسين استراتيجيتك واستمرارية نمو شركتك من خلال أداة التخطيط الاستراتيجي
                            </p>
                            {selectedOption === 'existing' && (
                                <div className="selected-indicator">
                                    <IoCheckmarkCircle style={{ color: 'white', fontSize: '20px' }} />
                                </div>
                            )}
                        </div>

                        <div
                            className={`service-card fade-in ${hoveredOption === 'new' ? 'service-card-hovered' : ''} ${selectedOption === 'new' ? 'service-card-selected' : ''}`}
                            onMouseEnter={() => setHoveredOption('new')}
                            onMouseLeave={() => setHoveredOption(null)}
                            onClick={handleService2Click}
                        >
                            <div className="service-card-icon">
                                <RiLightbulbLine className="icon" />
                            </div>
                            <h3 className="service-card-title">أرغب ببدء فكرة جديدة</h3>
                            <p className="service-card-description">
                                تحويل فكرتك إلى خطة عمل مفصلة وخارطة موضحة لبدء مشروعك الناشئ بثقة
                            </p>
                            {selectedOption === 'new' && (
                                <div className="selected-indicator">
                                    <IoCheckmarkCircle style={{ color: 'white', fontSize: '20px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
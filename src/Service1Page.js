import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./service1.css";
import BlueBox from "./assets/BlueBox.svg";
import RedBlueBox from "./assets/RedBlueBox.svg";
import AWJLOGO from "./assets/AWJLOGO.svg";
import GoalDecomposeIcon from "./assets/GoalDecomposeIcon.svg";
import BMICON from "./assets/BMICON.svg";

const Service1Page = () => {
    const navigate = useNavigate();

    // Add entrance animations
    useEffect(() => {
        const elements = document.querySelectorAll('.fade-in');

        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, []);

    return (
        <div className="service1-page">
            <img
                className="Logo"
                alt="شعار أوج"
                src={AWJLOGO}
                title="أوج"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />

            {/* Decorative elements */}
            <img className="BlueBox" alt="" src={BlueBox} aria-hidden="true" />
            <img className="RedBlueBox" alt="" src={RedBlueBox} aria-hidden="true" />

            <div className="text-wrapper-1 fade-in">هذه هي الخدمة المثالية لمرحلتك الحالية</div>
            <div className="services-available-note fade-in">ستتمكن من الوصول إلى جميع خدماتنا بعد إنشاء حسابك</div>

            <div className="service1-rectangle fade-in primary-service">
                <img
                    src={GoalDecomposeIcon}
                    alt="أيقونة تقسيم الأهداف"
                    className="service1-icon"
                />
                <h1 className="service1-heading">التخطيط الاستراتيجي</h1>
                <p className="service1-description">
                    تقسيم أهدافك الاستراتيجية إلى أهداف قصيرة المدى حتى يسهل تنفيذها، مع جداول
                    زمنية و توقع للمخاطر، أيضًا تعزيز التعاون مع أعضاء فريقك، وعرض تقدمك على
                    لوحة تحكم مخصصة لمتابعة الأداء.
                </p>
                <button
                    className="create-account-button1"
                    onClick={() => navigate("/create-account")}
                    aria-label="انشاء حساب"
                >
                    انشاء حساب
                </button>
            </div>

            <button
                className="back-button fade-in"
                onClick={() => navigate(-1)}
                aria-label="رجوع"
            >
                رجوع
            </button>
        </div>
    );
};

export default Service1Page;
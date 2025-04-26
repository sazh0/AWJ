import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./service1.css";
import BlueBox from "./assets/BlueBox.svg";
import RedBlueBox from "./assets/RedBlueBox.svg";
import AWJLOGO from "./assets/AWJLOGO.svg";
import BMICON from "./assets/BMICON.svg";
import GoalDecomposeIcon from "./assets/GoalDecomposeIcon.svg";

const Service2Page = () => {
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

            <div className="service2-rectangle fade-in primary-service">
                <img
                    src={BMICON}
                    alt="أيقونة نموذج العمل"
                    className="service2-icon"
                />
                <h1 className="service2-heading">بنــاء نــموذج عمــل</h1>
                <p className="service2-description">
                    بناء نموذج عمل مخصص يتناسب مع شركتك وميزانيتك، مما يسهم في تأسيس بنية أعمال متكاملة وقابلة للتنفيذ. أيضًا التعاون مع أعضاء فريقك، وعرض تقدمك على لوحة تحكم مخصصة لمتابعة الأداء.
                </p>
                <button
                    className="create-account-button2"
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

export default Service2Page;
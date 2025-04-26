import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CA.css";
import BlueBox from "./assets/BlueBox.svg";
import RedBlueBox from "./assets/RedBlueBox.svg";
import AWJLOGO from "./assets/AWJLOGO.svg";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { IoArrowBack } from 'react-icons/io5';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Terms And Conditions Modal Component
const TermsModal = ({ onClose, onAccept }) => {
    return (
        <div className="modal terms-modal" onClick={onClose}>
            <div className="modal-content-terms scale-in" onClick={(e) => e.stopPropagation()}>
                <h3>الشروط والأحكام</h3>
                <div className="terms-content">
                    <h4>1. مقدمة</h4>
                    <p>مرحبًا بك في منصة أوج. تحدد هذه الشروط والأحكام قواعد استخدام منصتنا.</p>

                    <h4>2. التسجيل وأمان الحساب</h4>
                    <p>عند إنشاء حساب، أنت مسؤول عن:</p>
                    <ul>
                        <li>تقديم معلومات دقيقة وكاملة</li>
                        <li>الحفاظ على سرية معلومات حسابك</li>
                        <li>إخطارنا بأي خرق أمني أو استخدام غير مصرح به لحسابك</li>
                    </ul>

                    <h4>3. خصوصية البيانات</h4>
                    <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقًا لقوانين حماية البيانات المعمول بها.</p>

                    <h4>4. قيود الاستخدام</h4>
                    <p>يحظر استخدام منصتنا في:</p>
                    <ul>
                        <li>أي نشاط غير قانوني</li>
                        <li>الإضرار بتجربة المستخدمين الآخرين</li>
                        <li>محاولة الوصول غير المصرح به إلى أنظمتنا</li>
                    </ul>

                    <h4>5. إنهاء الخدمة</h4>
                    <p>نحتفظ بالحق في تعليق أو إنهاء وصولك إلى منصتنا في حالة انتهاك هذه الشروط.</p>

                    <h4>6. التغييرات في الشروط</h4>
                    <p>قد نقوم بتحديث هذه الشروط من وقت لآخر. ستكون مسؤولاً عن مراجعة أي تغييرات.</p>

                    <h4>7. المسؤولية</h4>
                    <p>لن نكون مسؤولين عن أي خسائر تنتج عن استخدامك لمنصتنا، ما لم تكن ناتجة عن إهمال من جانبنا.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={onAccept} className="accept-terms-btn">
                        موافق على الشروط
                    </button>
                    <button onClick={onClose}>
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

// Enhanced Error Message Component
const ErrorMessage = ({ message }) => {
    return (
        <div className="error-message-enhanced">
            <div className="error-icon">
                <FaExclamationTriangle />
            </div>
            <div className="error-text">{message}</div>
        </div>
    );
};

// Password Instructions Component
const PasswordInstructions = ({ password }) => {
    const calculateStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 10) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const strength = calculateStrength(password);
    const isLengthValid = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return (
        <div className="password-instructions">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaInfoCircle style={{ marginLeft: '5px', color: '#1d3557' }} />
                <span>متطلبات كلمة المرور (يجب أن تكون متوسطة القوة على الأقل):</span>
            </div>
            <ul>
                <li className={isLengthValid ? 'satisfied' : ''}>
                    {isLengthValid ? <FaCheck style={{ marginLeft: '5px', color: '#4caf50' }} /> : <FaTimes style={{ marginLeft: '5px', color: '#e63a46' }} />}
                    على الأقل 6 أحرف
                </li>
                <li className={hasUpperCase ? 'satisfied' : ''}>
                    {hasUpperCase ? <FaCheck style={{ marginLeft: '5px', color: '#4caf50' }} /> : <FaTimes style={{ marginLeft: '5px', color: '#e63a46' }} />}
                    حرف كبير واحد على الأقل
                </li>
                <li className={hasNumber ? 'satisfied' : ''}>
                    {hasNumber ? <FaCheck style={{ marginLeft: '5px', color: '#4caf50' }} /> : <FaTimes style={{ marginLeft: '5px', color: '#e63a46' }} />}
                    رقم واحد على الأقل
                </li>
                <li className={hasSpecial ? 'satisfied' : ''}>
                    {hasSpecial ? <FaCheck style={{ marginLeft: '5px', color: '#4caf50' }} /> : <FaTimes style={{ marginLeft: '5px', color: '#e63a46' }} />}
                    رمز خاص واحد على الأقل
                </li>
            </ul>
        </div>
    );
};

// Form validation helper
const validateField = (field, value) => {
    // Skip validation for empty fields (except where explicitly required)
    if (value === null || value === undefined || value.trim() === '') {
        return null;
    }

    switch (field) {
        case 'firstName':
        case 'lastName':
            return value.trim().length > 1 ? null : 'يجب أن يتكون الاسم من حرفين على الأقل';

        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'البريد الإلكتروني غير صالح';

        case 'confirmEmail':
            return formData => formData.email === value ? null : 'البريد الإلكتروني غير متطابق';

        case 'password':
            // Calculate password strength
            let strength = 0;
            if (value.length >= 6) strength += 1;
            if (value.length >= 10) strength += 1;
            if (/[A-Z]/.test(value)) strength += 1;
            if (/[0-9]/.test(value)) strength += 1;
            if (/[^A-Za-z0-9]/.test(value)) strength += 1;

            // Only accept medium strength or higher (strength >= 2)
            return strength >= 2 ? null : 'يجب أن تكون كلمة المرور متوسطة القوة على الأقل';

        case 'confirmPassword':
            return formData => formData.password === value ? null : 'كلمة المرور غير متطابقة';

        case 'phoneNumber':
            // Saudi phone validation (either +966 format or 05xxxxxxxx format)
            return /^(\+966|05)\d{8,9}$/.test(value) ? null : 'يرجى إدخال رقم هاتف سعودي صالح';

        default:
            return null;
    }
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
    return (
        <div className={`notification ${type} notification-animate`}>
            <div className="notification-content">
                {type === 'error' && <FaExclamationTriangle />}
                {type === 'success' && <FaCheck />}
                {type === 'info' && <FaInfoCircle />}
                <p>{message}</p>
            </div>
            <button onClick={onClose} className="close-notification">×</button>
        </div>
    );
};

// Password Strength Component
const PasswordStrengthMeter = ({ password }) => {
    const calculateStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 10) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const strength = calculateStrength(password);

    return (
        <div className="password-strength">
            <div className="strength-meter">
                <div
                    className={`strength-fill strength-${strength}`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
            </div>
            <div className="strength-label">
                {strength === 0 && password && 'ضعيف جداً'}
                {strength === 1 && 'ضعيف'}
                {strength === 2 && 'متوسط'}
                {strength === 3 && 'جيد'}
                {strength === 4 && 'قوي'}
                {strength === 5 && 'ممتاز'}
            </div>
        </div>
    );
};

// Input Field Component
const FormField = ({
    name,
    label,
    type = 'text',
    icon,
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    error,
    required = false,
    readOnly = false,
    showCheckmark = false
}) => {
    return (
        <div className={`form-group ${error ? 'has-error' : ''}`}>
            <label>
                {icon}
                {label}
                {required && <span className="required">*</span>}
            </label>
            <div className="input-container">
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder || label}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required={required}
                    readOnly={readOnly}
                    className={readOnly ? 'readonly' : ''}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
                {showCheckmark && !error && <FaCheck className="check-icon" />}
                {error && <ErrorMessage message={error} />}
            </div>
        </div>
    );
};

const CreateAccountPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        companyRegistered: null,
        termsAccepted: false,
        securityKey: "",
    });

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [notification, setNotification] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showPasswordInstructions, setShowPasswordInstructions] = useState(false);
    const firstErrorRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "أوج | إنشاء حساب";

        // Validate form on data change if user has attempted submission
        if (formSubmitted) {
            validateForm();
        }
    }, [formData, formSubmitted]);

    // Scroll to first error after validation
    useEffect(() => {
        if (Object.keys(errors).length > 0 && firstErrorRef.current) {
            firstErrorRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [errors]);

    const validateForm = () => {
        const newErrors = {};

        // Validate each field
        Object.keys(formData).forEach(field => {
            const validation = validateField(field, formData[field]);

            if (typeof validation === 'function') {
                const error = validation(formData);
                if (error) newErrors[field] = error;
            } else if (validation) {
                newErrors[field] = validation;
            }
        });

        // Additional validations
        if (formData.companyRegistered === null) {
            newErrors.companyRegistered = 'يرجى تحديد ما إذا كانت شركتك مسجلة';
        }

        if (formData.companyRegistered === true && !formData.securityKey) {
            newErrors.securityKey = 'يرجى إدخال رمز الأمان';
        }

        // Terms validation
        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'يجب الموافقة على الشروط والأحكام';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Visual feedback for input
        if (e.target && e.target.parentNode) {
            e.target.parentNode.classList.add('input-active');
            setTimeout(() => {
                e.target.parentNode.classList.remove('input-active');
            }, 300);
        }
    };

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);

        // Show password instructions when password field is focused
        if (fieldName === 'password') {
            setShowPasswordInstructions(true);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setActiveField(null);

        // Always hide password instructions when the password field loses focus
        if (name === 'password') {
            setShowPasswordInstructions(false);
        }

        // Validate field on blur
        const validation = validateField(name, value);
        if (typeof validation === 'function') {
            const error = validation(formData);
            if (error) setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        } else if (validation) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: validation }));
        }
    };

    const handleCompanyRegistered = (status) => {
        setFormData(prevState => ({
            ...prevState,
            companyRegistered: status
        }));

        if (status === true) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }

        // Clear company registration error
        if (errors.companyRegistered) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.companyRegistered;
                return newErrors;
            });
        }
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowTermsModal(true);
    };

    const handleAcceptTerms = () => {
        // Use functional state update to ensure we're working with the latest state
        setFormData(prevState => ({
            ...prevState,
            termsAccepted: true
        }));

        // Clear terms error if it exists
        if (errors.termsAccepted) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.termsAccepted;
                return newErrors;
            });
        }

        setShowTermsModal(false);
    };

    // In CreateAccountPage.js, update the handleSubmit function
    const handleSubmit = async () => {
        if (formData.termsAccepted) {
            // Check for missing required fields
            if (
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.confirmEmail ||
                !formData.password ||
                !formData.confirmPassword ||
                !formData.phoneNumber ||
                formData.companyRegistered === null
            ) {
                alert("يرجى ملء جميع الحقول المطلوبة");
            } else {
                // Check if passwords and emails match
                if (formData.password !== formData.confirmPassword) {
                    alert("كلمات السر غير متطابقة");
                } else if (formData.email !== formData.confirmEmail) {
                    alert("البريد الإلكتروني غير متطابق");
                } else {
                    try {
                        // Get all existing user IDs
                        const usersSnapshot = await getDocs(collection(db, "User"));
                        const ids = usersSnapshot.docs.map(doc => doc.id);

                        const existingNumbers = ids
                            .map(id => {
                                const match = id.match(/^u(\d{3})$/);
                                return match ? parseInt(match[1]) : null;
                            })
                            .filter(n => n !== null)
                            .sort((a, b) => a - b);

                        let nextNumber = 1;
                        for (let i = 0; i < existingNumbers.length; i++) {
                            if (existingNumbers[i] !== nextNumber) break;
                            nextNumber++;
                        }

                        const nextId = `u${String(nextNumber).padStart(3, "0")}`;
                        localStorage.setItem("userId", nextId);

                        // If the user stores his phone number in +966 format it will be stored in 0.. format in the database (needed for sign in)
                        const normalizedPhone = formData.phoneNumber.startsWith("+966")
                            ? "0" + formData.phoneNumber.slice(4)
                            : formData.phoneNumber;

                        const userType = formData.companyRegistered ? "User" : "Manager";

                        // find the company document based on the entered SecurityKey
                        let companyRef = null;

                        if (formData.companyRegistered && formData.securityKey) {
                            const companiesSnapshot = await getDocs(collection(db, "Company"));
                            const matchedDoc = companiesSnapshot.docs.find(doc =>
                                doc.data().SecurityKey === formData.securityKey
                            );

                            if (matchedDoc) {
                                companyRef = doc(db, "Company", matchedDoc.id); // reference to the company doc
                            } else {
                                alert("رمز الأمان غير صحيح");
                                return;
                            }
                        }

                        // Save user in Firestore
                        const docRef = doc(db, "User", nextId);
                        await setDoc(docRef, {
                            FirstName: formData.firstName,
                            LastName: formData.lastName,
                            Email: formData.email,
                            Password: formData.password,
                            PhoneNumber: normalizedPhone,
                            CompanyID: companyRef,
                            UserType: userType,
                            CreatedAt: new Date(), // Add creation timestamp
                        });

                        console.log("User saved successfully");

                        // Redirect based on company registration status
                        if (formData.companyRegistered === true) {
                            console.log("Navigating to dashboard");
                            navigate("/dashboard");
                        } else {
                            console.log("Navigating to create-company-account");
                            navigate("/create-company-account");
                        }
                    } catch (error) {
                        console.error("Error saving user:", error);
                        alert("حدث خطأ أثناء حفظ الحساب. حاول مرة أخرى.");
                    }
                }
            }
        } else {
            alert("يجب الموافقة على الشروط والأحكام");
        }
    };

    const handleSecurityKeySubmit = () => {
        if (formData.securityKey.length === 5) {
            setShowModal(false);
        } else {
            showNotification("يرجى إدخال مفتاح مكون من 5 أرقام", "error");
        }
    };

    return (
        <div className="create-account-page" style={{ minHeight: '105vh', height: 'auto' }}>
            <IoArrowBack
                className="back-arrow"
                onClick={() => navigate('/services')}
                aria-label="العودة إلى الخدمات"
            />

            {/* Logo positioned at top right corner */}
            <div className="logo-container">
                <img
                    className="Logo"
                    alt="Logo"
                    src={AWJLOGO}
                />
            </div>

            {/* Title positioned above the form */}
            <div className="text-wrapper slide-down">
                إنشـاء حساب
            </div>

            <img
                className="BlueBox slide-in-left"
                alt="شكل هندسي أزرق"
                src={BlueBox}
            />

            <img
                className="RedBlueBox slide-in-right"
                alt="شكل هندسي أحمر وأزرق"
                src={RedBlueBox}
            />

            {/* Form Container - With improved layout and widths */}
            <form className="create-account-form slide-up" style={{ padding: '30px' }}>
                {/* Personal information section */}
                <FormField
                    name="firstName"
                    label="الاسم الأول"
                    icon={<FaUser style={{ marginLeft: '5px' }} />}
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('firstName')}
                    onBlur={handleBlur}
                    error={errors.firstName}
                    required={true}
                />

                <FormField
                    name="lastName"
                    label="الاسم الأخير"
                    icon={<FaUser style={{ marginLeft: '5px' }} />}
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('lastName')}
                    onBlur={handleBlur}
                    error={errors.lastName}
                    required={true}
                />

                <FormField
                    name="email"
                    label="البريد الإلكتروني"
                    type="email"
                    icon={<FaEnvelope style={{ marginLeft: '5px' }} />}
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    error={errors.email}
                    required={true}
                />

                <FormField
                    name="confirmEmail"
                    label="تأكيد البريد الإلكتروني"
                    type="email"
                    icon={<FaEnvelope style={{ marginLeft: '5px' }} />}
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmEmail')}
                    onBlur={handleBlur}
                    error={errors.confirmEmail}
                    required={true}
                    showCheckmark={formData.email && formData.confirmEmail && formData.email === formData.confirmEmail}
                />

                {/* Password section with improved visibility of instructions */}
                <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                    <label>
                        <FaLock style={{ marginLeft: '5px' }} />
                        الرقم السري
                        <span className="required">*</span>
                    </label>
                    <div className="input-container" style={{ width: '100%' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="الرقم السري"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => handleFocus('password')}
                            onBlur={handleBlur}
                            required
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                        {errors.password && <ErrorMessage message={errors.password} />}
                    </div>
                    {formData.password && <PasswordStrengthMeter password={formData.password} />}
                    {/* Always show password instructions when there's content */}
                    {showPasswordInstructions && <PasswordInstructions password={formData.password} />}
                </div>

                <FormField
                    name="confirmPassword"
                    label="تأكيد الرقم السري"
                    type="password"
                    icon={<FaLock style={{ marginLeft: '5px' }} />}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    required={true}
                    showCheckmark={formData.password && formData.confirmPassword && formData.password === formData.confirmPassword}
                />

                {/* Phone number field - positioned next to company question */}
                <FormField
                    name="phoneNumber"
                    label="رقم الجوال"
                    icon={<FaPhone style={{ marginLeft: '5px' }} />}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phoneNumber')}

                    onBlur={handleBlur}
                    error={errors.phoneNumber}
                    required={true}
                    placeholder="+966XXXXXXXX أو 05XXXXXXXX"
                />
                {/* Rearranged section - company and phone fields side by side */}
                <div>
                    {/* Company question */}
                    <div className={`company-question ${errors.companyRegistered ? 'has-error' : ''}`}>
                        <label>
                            <FaBuilding style={{ marginLeft: '5px' }} />
                            هل شركتك مسجلة فالمنصة؟
                            <span className="required">*</span>
                        </label>
                        <div className="company-buttons">
                            <button
                                type="button"
                                className={formData.companyRegistered === true ? "selected" : ""}
                                onClick={() => handleCompanyRegistered(true)}
                            >
                                نعم
                            </button>
                            <button
                                type="button"
                                className={formData.companyRegistered === false ? "selected" : ""}
                                onClick={() => handleCompanyRegistered(false)}
                            >
                                لا
                            </button>
                        </div>
                        {errors.companyRegistered && <ErrorMessage message={errors.companyRegistered} />}
                    </div>

                </div>
            </form>

            {/* Terms and Login in the same row */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '90%',
                maxWidth: '834px',
                margin: '20px auto 30px',
                position: 'relative'
            }}>
                {/* Terms Checkbox - Left side */}
                <div className={`terms ${errors.termsAccepted ? 'has-error' : ''}`}
                    style={{
                        animationFillMode: 'forwards',
                        margin: '0',
                        position: 'relative',
                        flex: '1',
                        minWidth: '300px'
                    }}
                >
                    <label htmlFor="terms-checkbox" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            id="terms-checkbox"
                            checked={formData.termsAccepted}
                            onChange={handleChange}
                            required
                            style={{ marginLeft: '10px', cursor: 'pointer', zIndex: 5 }}
                        />
                        <div className="terms-container">
                            <p>أوافق على </p>
                            <a
                                href="#"
                                className="terms-link"
                                onClick={handleTermsClick}
                            >
                                الشروط والأحكام
                            </a>
                            <span className="required">*</span>
                        </div>
                    </label>
                    {errors.termsAccepted && <ErrorMessage message={errors.termsAccepted} />}
                </div>

                {/* Login link - Right side */}
                <div className="login-link2" style={{
                    animationFillMode: 'forwards',
                    margin: '0',
                    position: 'relative',
                    bottom: 'auto',
                    textAlign: 'left',
                    minWidth: '200px'
                }}>
                    <a href="/signin">سجل دخولك</a>   لديك حساب؟
                </div>
            </div>

            {/* Enhanced Next button with better sizing */}
            <button
                type="button"
                className="submit-btn slide-up"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: 'auto', minWidth: '100px', padding: '15px 30px' }}
            >
                {loading ? (
                    <span className="loading-spinner">جاري المعالجة...</span>
                ) : (
                    <span>التالي</span>
                )}
            </button>

            {/* Modal for security key */}
            {
                showModal && (
                    <div className="modal fade-in" onClick={() => setShowModal(false)} style={{ animationFillMode: 'forwards' }}>
                        <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()} style={{ animationFillMode: 'forwards' }}>
                            <h3>الانضمام لحساب الشركة</h3>
                            <p>أدخل رمز الأمان المكون من 5 أحرف المقدم من مدير الشركة</p>
                            <input
                                type="text"
                                name="securityKey"
                                maxLength="5"
                                placeholder="أدخل رمز الأمان"
                                value={formData.securityKey}
                                onChange={handleChange}
                                className={errors.securityKey ? 'input-error' : ''}
                                autoFocus
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                            {errors.securityKey && <ErrorMessage message={errors.securityKey} />}
                            <button onClick={handleSecurityKeySubmit}>
                                تأكيد
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Terms and Conditions Modal */}
            {
                showTermsModal && (
                    <TermsModal
                        onClose={() => setShowTermsModal(false)}
                        onAccept={handleAcceptTerms}
                    />
                )
            }

            {/* Notification system */}
            {
                notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )
            }
        </div >
    );
};

export default CreateAccountPage;
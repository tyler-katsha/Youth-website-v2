import { useEffect, useState } from 'react';
import styles from '../modules/Auth.module.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../utils/API';
import { CustomPopup } from '../popups/CustomPopup';
import { useUser } from '../contexts/UserContext';
import type { LoginPayload, ToastResponse } from '../utils/types';
import { OAuthLogin } from '../components/OAuthLogin';
import { removeAll } from '../utils/Utils';

export const Login = () => {
    const navigate = useNavigate();
    const { fetchUser } = useUser();
    const [searchParams] = useSearchParams();

    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as ToastResponse,
        message: ''
    });
    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState<LoginPayload>({
        email: "",
        password: ""
    });

    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        account_disabled: "Your account has been disabled. Check email for verification link.",
        invalid_credentials: "Incorrect email or password.",
        account_locked: "Your account has been locked due to too many failed login attempts.",
        email_not_verified: "Please verify your email before signing in.",
        oauth_failed: "Google authentication failed. Please try again.",
        oauth_cancelled: "Google sign-in was cancelled.",
        server_error: "Something went wrong. Please try again later."
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }

    const handleFormEvent = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();
        removeAll();
        try {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            if (response.status === 423) {
                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: 'Account is Locked. Please continue as guest and contact an youth leader or admin or verify account before attempting to login.'
                });
                return;
            }

            if (!response.ok) {

                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: 'Invalid credentials'
                });
                return;
            }

            await fetchUser();

            setPopupConfig({
                isOpen: true,
                type: 'success',
                message: 'Login Successful!'
            });

            navigate('/')

        } catch (error) {
            setPopupConfig({
                isOpen: true,
                type: 'error',
                message: 'Something went wrong. Please try again'
            });
        } finally {
            removeAll()
        }
    }


    useEffect(() => {
        if (searchParams.has('error')) {
            const timer = setTimeout(() => {
                navigate('/login', { replace: true })
            }, 5000)

            return () => clearTimeout(timer)
        }

    }, [navigate, searchParams])
    return (
        <>
            {error && (
                <div className={styles.error}>
                    {errorMessages[error] ?? "An unexpected error occurred"}
                </div>
            )}

            <div className={styles.pageWrapper}>


                <CustomPopup
                    isOpen={popupConfig.isOpen}
                    type={popupConfig.type}
                    message={popupConfig.message}
                    onClose={closePopup}
                />

                <div className={styles.formContainer}>
                    <h1>Login</h1>
                    <form onSubmit={handleFormEvent} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <label>Email:</label>
                            <input type='email' className={styles.inputField} placeholder='example@email.com' name='email' value={data.email} onChange={handleChange} required />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Password:</label>
                            <input type={showPassword ? 'text' : 'password'} className={styles.inputField} name='password' placeholder='••••••••' value={data.password} onChange={handleChange} required />
                            <button type="button" className={styles.toggleBtn} onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                        </div>

                        <Link className={styles.linkText} to='/reset-email'>Forgot Password?</Link>

                        <button type="submit" className={styles.submitBtn}>Sign In</button>


                        <Link className={styles.linkText} to='/register'>Don't have an account? Register here</Link>


                    </form>


                    <OAuthLogin />

                </div>
            </div>
        </>
    )
}
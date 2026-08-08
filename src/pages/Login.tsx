import { useEffect, useState } from 'react';
import styles from '../modules/Auth.module.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../utils/API';
import { CustomPopup } from '../popups/CustomPopup';
import { useUser } from '../contexts/UserContext';
import { errorMessages, type LoginPayload, type ToastResponse } from '../utils/types';
import { OAuthLogin } from '../components/OAuthLogin';
import { removeAll } from '../utils/Utils';

export const Login = () => {
    
    localStorage.setItem('login-register-pages','true')
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
                headers: {
                    'content-type': 'application/json',
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
            
            const token = await response.text();
            localStorage.setItem('jwt-token',token);
              
            setPopupConfig({
                isOpen: true,
                type: 'success',
                message: 'Login Successful!'
            });

            await fetchUser();

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

            <div className={styles.pageWrapper}>


                <CustomPopup
                    isOpen={popupConfig.isOpen}
                    type={popupConfig.type}
                    message={popupConfig.message}
                    onClose={closePopup}
                />

                <div className={styles.formContainer}>

                    {error && (<div className={styles.error}>{errorMessages[error] ?? "An unexpected error occurred"}</div>)}

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
import { useState } from 'react';
import styles from '../modules/Auth.module.css'
import { API } from '../utils/API';
import { useNavigate } from 'react-router-dom';
import { CustomPopup } from '../popups/CustomPopup';
import type { ToastResponse } from '../utils/types';
import { PasswordRequirements } from '../components/PasswordRequirements';

export const ResetPassword = () => {

    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token')
    const email = queryParams.get('email');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('')

    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as ToastResponse,
        message: ''
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    const profilePage = () => navigate('/profile');

    const handleFormEvent = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if (password !== confirmPassword) {
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password are not the same"
            });
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password must contain at least 8 characters."
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(
                {
                    'email':email,
                    'password': password,
                    'token': token
                })
            })

            if (!response.ok) {

                const errMsg = await response.text();
                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: errMsg ?? 'Failed to send data'
                });
                return;
            }

            setPopupConfig({
                isOpen: true,
                type: 'success',
                message: 'Password updated successfully. Go back to login/profile page.'
            });


            navigate('/login')

        } catch (error) {
            setPopupConfig({
                isOpen: true,
                type: 'error',
                message: 'Something went wrong. Please try again'
            });
        } finally {
            setLoading(false);
        }

    };
    return (
        <div className={styles.pageWrapper}>

            <CustomPopup
                isOpen={popupConfig.isOpen}
                type={popupConfig.type}
                message={popupConfig.message}
                onClose={closePopup}
            />

            <div className={styles.formContainer}>
                <form className={styles.loginForm} onSubmit={handleFormEvent}>
                    <h1>Reset Password</h1>


                    <div className={styles.inputGroup}>
                        <label>New Password:</label>
                        <input type={showPassword ? 'text' : 'password'} className={styles.inputField} placeholder='••••••••' name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" className={styles.toggleBtn} onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Confirm New Password:</label>
                        <input type={showConfirmPassword ? 'text' : 'password'} className={styles.inputField} placeholder='••••••••' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="button" className={styles.toggleBtn} onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                    </div>

                    <PasswordRequirements passwordValue={password}/>

                    <button type="button" onClick={profilePage} className={styles.submitBtn} disabled={loading}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Resetting password..." : "Reset password"}</button>
                    
                </form>
            </div>
        </div>
    )
}
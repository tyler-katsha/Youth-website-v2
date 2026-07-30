import { useState } from 'react';
import styles from '../modules/Auth.module.css'
import type { ToastResponse } from '../utils/types';
import { CustomPopup } from '../popups/CustomPopup';
import { API } from '../utils/API';
import { useNavigate } from 'react-router-dom';

export const ResetEmail = () => {
    const navigate = useNavigate();

    const loginPage = () => navigate('/login');
    const [email,setEmail] = useState<string | null>(null);
    const [loading,setLoading] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
            isOpen: false,
            type: 'success' as ToastResponse,
            message: ''
        });
    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    const handleFormEvent = async (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        localStorage.setItem('email','true');
        setLoading(true);


        try{
            const response = await fetch(`${API}/email/reset-password`,{
                method:"POST",
                credentials:'include',
                headers: {'content-type':'application/json'},
                body:JSON.stringify({email:email})
            })

            if(!response.ok){
                setPopupConfig({
                isOpen:true,
                type:'error',
                message:'Unable to send email'
            })
            }

            setPopupConfig({
                isOpen:true,
                type:'success',
                message:'Successfully sent email. Please check your inbox.'
            })

        
        } catch(err){
            setPopupConfig({
                isOpen:true,
                type:'error',
                message:'Network issue occurred'
            })
        } finally{
            setLoading(false);
        }
    }
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
                        <label>Enter email:</label>
                        <input type='email' className={styles.inputField} placeholder='example@gmail.com' name='email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <button type="button" onClick={loginPage} className={styles.submitBtn} disabled={loading}>Cancel</button>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Sending..." : "Send email"}</button>
                    
                </form>
            </div>
        </div>
    )
}
import { useState } from 'react';
import styles from '../modules/Auth.module.css'
import type { ToastResponse } from '../utils/types';
import { CustomPopup } from '../popups/CustomPopup';
import { API } from '../utils/API';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/Utils';

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
        setLoading(true);

        try{
            const response = await fetch(`${API}/email/reset-password`,{
                method:"POST",
                credentials:'include',
                headers: {
                    'content-type':'application/json',
                    'Authorization':`Bearer ${getToken()}`
                },
                body:JSON.stringify({email:email})
            })

            const data = await response.json();

            if(!data.success){
                setPopupConfig({
                isOpen:true,
                type:'error',
                message: data.message ?? 'Unable to redirect user'
            })
                return;
            }
            if(!response.ok){
                setPopupConfig({
                isOpen:true,
                type:'error',
                message: data.message ?? 'Unable to redirect user'
            })
            return;
            }

            setPopupConfig({
                isOpen:true,
                type:'success',
                message:'Successfully'
            })

            window.location.href = data
        
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
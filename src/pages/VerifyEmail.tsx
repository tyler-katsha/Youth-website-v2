import { useEffect, useState } from 'react';
import { CustomPopup } from '../popups/CustomPopup';
import { API } from '../utils/API';

export const VerifyEmail = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your email...');
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');
    

    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        message: ''
    });

    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    const handleResend = async () => {
        try {
            const response = await fetch(`${API}/email/resend-verification`,{ 
                    method: 'POST',
                    body: JSON.stringify({email:email})
                },
            );

            if (response.ok) {
                setPopupConfig({
                    isOpen: true,
                    type: 'success',
                    message: 'Verification email resent!'
                });
            } else {
                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: 'Failed to resend email'
                });
            }
        } catch {
            setPopupConfig({
                isOpen: true,
                type: 'error',
                message: 'Network error'
            });
        }
    };
    const verifyToken = async (token:string) => {
            try {
                const response = await fetch(`${API}/auth/verify?token=${token}`,{
                    method:"GET",
                    credentials:'include'
                });

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage('Verification failed or token expired.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Network error. Please try again later.');
            }
        };
    useEffect(() => {
        
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification token.');
            return;
        }

        verifyToken(token);
    }, []);

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f7f6',
            fontFamily: 'Arial, sans-serif',
        },
        card: {
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
        },
        button: {
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
        },
    };


    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <CustomPopup 
                    {...popupConfig} 
                    onClose={closePopup} 
                />
                <h2>Email Verification</h2>
                <p>{message}</p>

                {status === 'success' && (
                    <button style={styles.button} onClick={() => window.location.href = '/login'}>
                        Go to Login
                    </button>
                )}
                {status === 'error' && (
                    <button style={styles.button} onClick={handleResend}>
                        Resend verification email
                    </button>
                )}
            </div>
        </div>
    );
};


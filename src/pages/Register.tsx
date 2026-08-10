import { Link } from 'react-router-dom';
import styles from '../modules/Auth.module.css';
import editModalStyles from '../modules/EditModal.module.css'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { API } from '../utils/API';
import { CustomPopup } from '../popups/CustomPopup';
import { FileUpload } from '../components/FileUpload';
import { acceptArray, type RegisterPayload, type ToastResponse } from '../utils/types';
import imageCompression from 'browser-image-compression';
import { PasswordRequirements } from '../components/PasswordRequirements';
import { OAuthLogin } from '../components/OAuthLogin';


export const Register = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [_previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState<RegisterPayload>({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        bio: '',
        profileImageUrl: null
    });

    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as ToastResponse,
        message: ''
    });
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    const handleFormEvent = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if (data.password !== data.confirmPassword) {
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password are not the same"
            });
            return;
        }

        if (data.password.length < 8) {
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password must contain at least 8 characters."
            });
            return;
        }

        if(!/[A-Z]/.test(data.password)){
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password must include at least one uppercase letter"
            });
            setLoading(false);
            return;
        }

        if(!/[a-z]/.test(data.password)){
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password must include at least one lowercase letter"
            });
            setLoading(false);
            return;
        }

        if(!/[0-9]/.test(data.password)){
            setPopupConfig({
                isOpen: true,
                type: "error",
                message: "Password must include at least one number"
            });
            setLoading(false);
            return;
        }

        if(!/[^A-Za-z0-9]/.test(data.password)){
            setPopupConfig({
                isOpen:true,
                type:'error',
                message:"Password must include at least one special character"
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();

        formData.append('name', `${data.firstName.trim()} ${data.lastName.trim()}`);
        formData.append('email', data.email.trim());
        formData.append('dateOfBirth', data.dateOfBirth);
        formData.append('password', data.password);
        if(data.bio){
            formData.append('bio',data.bio);
        }

        if (data.profileImageUrl) {

            const compressed = await imageCompression(data.profileImageUrl, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 512,
                useWebWorker: true
            })

            formData.append('profileImageUrl', compressed);
        }

        try {
            const response = await fetch(API + '/auth/register', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {

                const errMsg = await response.json();
                setPopupConfig({
                    isOpen: true,
                    type: 'error',
                    message: errMsg.message || 'Registeration Failed'
                });
                return;
            }

            const apiResponse = await response.json()
            setPopupConfig({
                isOpen: true,
                type: apiResponse ? 'success' : 'error',
                message: apiResponse.message ?? 'Registered Successful'
            });
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

    const handleFileSelect = useCallback((files: File[]) => {
        setData(prev => ({
            ...prev,
            profileImageUrl: files[0] ?? null
        }));
    }, []);

    useEffect(() => {

        if (!data.profileImageUrl) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.profileImageUrl);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.profileImageUrl])
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
                    <h1>Register</h1>

                    <div className={styles.inputGroup}>
                        <label>First Name:</label>
                        <input type='text' className={styles.inputField} placeholder='John' name='firstName' value={data.firstName} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Last Name:</label>
                        <input type='text' className={styles.inputField} name='lastName' placeholder='Doe' value={data.lastName} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email:</label>
                        <input type='email' className={styles.inputField} placeholder='example@email.com' name='email' value={data.email} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Date Of Birth:</label>
                        <input type='date' className={styles.inputField} name='dateOfBirth' value={data.dateOfBirth} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password:</label>
                        <input type={showPassword ? 'text' : 'password'} className={styles.inputField} placeholder='••••••••' name='password' value={data.password} onChange={handleChange} required />
                        <button type="button" className={styles.toggleBtn} onClick={togglePasswordVisibility}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Confirm Password:</label>
                        <input type={showConfirmPassword ? 'text' : 'password'} className={styles.inputField} placeholder='••••••••' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} required />
                        <button type="button" className={styles.toggleBtn} onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
                    </div>

                    <PasswordRequirements passwordValue={data.password}/>

                    <div className={styles.inputGroup}>
                        <label>Profile Image (Optional):</label>
                        <FileUpload accept={acceptArray.join(', ')} onFileSelect={handleFileSelect} />
                    </div>

                    <div className={editModalStyles.formGroup}>
                    <label htmlFor="bio">Add Bio</label>
                    <textarea
                        id="bio"
                        className={editModalStyles.textareaField}
                        value={data.bio}
                        maxLength={250}
                        onChange={(e) => setData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={5}
                    />
                    <div className={editModalStyles.bioFooter}>
                        <div className={editModalStyles.progressTrack}>
                            <div className={`${editModalStyles.progressFill} ${data.bio.length === 250 ? editModalStyles.danger : data.bio.length >= 225 ? editModalStyles.warning : ""}`} style={{width : `${(data.bio.length / 250) * 100}%`}}/>
                        </div>

                         <span className={`${editModalStyles.charCount} ${data.bio.length >= 225 ? editModalStyles.warningText : ""} ${data.bio.length === 250 ? editModalStyles.dangerText : ""}`}>{data.bio.length}/250</span>
                    </div>
                </div>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Registering..." : "Register"}</button>

                    <Link className={styles.linkText} to='/login'>Already have an account? Log in</Link>
                    
                </form>

                <OAuthLogin/>

            </div>
        </div>

    )
}
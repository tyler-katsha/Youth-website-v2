import { useState } from 'react';
import styles from '../modules/ContactPage.module.css';
import { API } from '../utils/API';
import { CustomPopup } from '../popups/CustomPopup';
import { useUser } from '../contexts/UserContext';
import { ContactSkeleton } from '../skeletons/pages/ContactSkeleton';
import { RedirectUser } from '../components/RedirectUser';

export const ContactPage = () => {

    const { user, isLoading } = useUser();
    const [isSending, setIsSending] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [popupConfig, setPopupConfig] = useState({
        isOpen: false,
        type: 'success' as 'success' | 'error',
        message: ''
    });
    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);

        setPopupConfig({
            isOpen: true,
            type: 'success',
            message: 'Sending your message...'
        });

        try {
            const response = await fetch(`${API}/email/send-email`, {
                method: "POST",
                headers: { 
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to send");

            // Success state
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setPopupConfig({ isOpen: true, type: 'success', message: 'Message sent successfully!' });
        } catch (error) {
            // Handle error
            setPopupConfig({ isOpen: true, type: 'error', message: 'Unable to send email. Please try again.' });
        } finally {
            setIsSending(false);
        }
    };


    if (isLoading) {
        return <ContactSkeleton />
    }
    if (!user) {
        return <RedirectUser />;
    }
    return (
        <>
            <div className={styles.pageWrapper}>

                <CustomPopup
                    isOpen={popupConfig.isOpen}
                    type={popupConfig.type}
                    message={popupConfig.message}
                    onClose={closePopup}
                />

                <div className={styles.contactCard}>

                    <div className={styles.infoBox}>
                        <h2>Get in Touch</h2>
                        <p>Have questions about Youth Group, upcoming outings? We'd love to hear from you.</p>

                        <div className={styles.contactDetail}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email Us</span>
                                <span className={styles.detailValue}>youth@engedichurch.com</span>
                            </div>

                            {/* <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Call Us</span>
                                <span className={styles.detailValue}>(555) 123-4567</span>
                            </div> */}

                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Youth Building</span>
                                <span className={styles.detailValue}>
                                    2 Burgundy street
                                    <br />
                                    Westrigde, Mitchells Plain
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: The Form */}
                    <div className={styles.formBox}>
                        <h3>Send a Message</h3>

                        {isSubmitted ? (
                            <div className={styles.successMessage}>
                                Thank you! Your message has been sent successfully. We will get back to you soon.
                            </div>
                        ) : (
                            <form className={styles.contactForm} onSubmit={handleSubmit}>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name">Your Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} required placeholder="John Doe" />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} required placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="subject">Subject</label>
                                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={styles.inputField} required placeholder="How can we help?" />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} className={styles.textareaField} required placeholder="Write your message here..."></textarea>
                                </div>

                                <button type="submit" className={styles.submitBtn}>{isSending ? "Sending..." : "Send Message"}</button>

                            </form>
                        )}
                    </div>

                </div>
            </div>

        </>
    );
};
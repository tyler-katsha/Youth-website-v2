import { useState } from "react";
import { CustomPopup } from "../popups/CustomPopup"
import { Toast, type PartialToast } from "../modals/Toast";

export const TestPopup = () => {

    const [popupConfig, setPopupConfig] = useState({
        isOpen: true,
        type: 'error' as 'success' | 'error',
        message: 'Registeration Failed'
    });

    const [toast, setToast] = useState<PartialToast | null>(null);

    const closePopup = () => setPopupConfig(prev => ({ ...prev, isOpen: false }))

    return <div>
        isOpen: true,
        type: 'error',
        message: errMsg || 'Registeration Failed'
        <CustomPopup
            isOpen={popupConfig.isOpen}
            type={popupConfig.type}
            message={popupConfig.message}
            onClose={closePopup}
        />

        {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />
        )}
    </div>
}
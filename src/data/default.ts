import type { AnnouncementProps } from "../types/announcement";
import type { PartialPlan } from "../types/event";
import type { EventType, ToastResponse } from "../types/types";

export const INITIAL_FORM_STATE: Omit<AnnouncementProps, 'id'> = {
    title: '',
    message: '',
    type: 'INFO',
    createdAt: 'Just now',
    expiresAt: '',
    isUrgent: false
};

export const DEFAULT_PARTIAL_PLAN: PartialPlan = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        color: '#2563eb',
        eventType: 'GENERAL' as EventType
    };

export const DEFAULT_CONTACT_FORM = {
        name: '',
        email: '',
        subject: '',
        message: ''
};

export const DEFAULT_LOGIN_PAYLOAD = {
        email: "",
        password: ""
}

export const DEFAULT_POPUP_CONFIG = {
        isOpen: false,
        type: 'success' as ToastResponse,
        message: ''
    }

export const DEFAULT_REGISTER_PAYLOAD = {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
        bio: '',
        profileImageUrl: null
}
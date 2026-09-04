import type { NotificationType } from "./types";

export interface functionalAnnouncementProps extends AnnouncementProps {
    removeAnnouncement: (announcement: AnnouncementProps) => void;
    editAnnouncement: (announcement: AnnouncementProps) => void;
}
export interface AnnouncementProps {
    id: number,
    type: NotificationType,
    title: string;
    message: string;
    createdAt: string;
    expiresAt: string;
    isUrgent: boolean;
}
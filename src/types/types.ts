export type AppRole = 'MEMBER' | 'YOUTH_LEADER' | 'GUEST' | 'ADMIN';
export type Providers = 'Google' | 'Facebook' | 'Instagram';
export type EventType = 'GENERAL' | 'MEETING' | 'WORSHIP' | 'URGENT' | 'ACTIVITY';
export type ViewMode = "table" | "dashboard" | "graph" | "cards";
export type ConnectionType = "CONNECT" | 'DISCONNECT' | 'CONTINUE_AS_GUEST'
export type Status = "ACTIVE" | "INACTIVE"
export type AuthProvider = 'LOCAL' | "OAUTH2"
export type ToastResponse = "success" | "error"
export type EmailTestTypes = null|'verify'| 'role-submitted'|'role-request'|'role-approved'|'role-rejected'|'event-created' |'event-cancelled'|'contact'
export type NotificationType = 'WARNING' | 'ERROR' | 'ANNOUNCEMENT' | 'SYSTEM' | 'ROLE_REQUEST' | 'EVENT' | 'SUCCESS' | 'INFO'



export const planColors = [
    { eventType: "GENERAL", label: "General", color: "#2563eb" },
    { eventType: "MEETING", label: "Meeting", color: "#10b981" },
    { eventType: "WORSHIP", label: "Worship", color: "#8b5cf6" },
    { eventType: "URGENT", label: "Urgent", color: "#ef4444" },
    { eventType: "ACTIVITY", label: "Activity", color: "#f59e0b" },
];

export const eventColors: Record<EventType, string> = {
    GENERAL: "#2563eb",
    MEETING: "#10b981",
    WORSHIP: "#8b5cf6",
    URGENT: "#ef4444",
    ACTIVITY: "#f59e0b",
};

export const times:string[] = [
    '00:00','00:30',
    '01:00','01:30',
    '02:00','02:30',
    '03:00','03:30',
    '04:00','04:30',
    '05:00','05:30',
    '06:00','06:30',
    '07:00','07:30',
    '08:00','08:30',
    '09:00','09:30',
    '10:00','10:30',
    '11:00','11:30',
    '12:00','12:30',
    '13:00','13:30',
    '14:00','14:30',
    '15:00','15:30',
    '16:00','16:30',
    '17:00','17:30',
    '18:00','18:30',
    '19:00','19:30',
    '20:00','20:30',
    '21:00','21:30',
    '22:00','22:30',
    '23:00','23:30'];
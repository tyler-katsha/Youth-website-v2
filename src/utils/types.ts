export interface UserPayload extends YouthProfileProps {
    createdAt:string;
}

export interface YouthProfileProps {
    name: string;
    age:number | null;
    roles: AppRole[];
    dateOfBirth:string;
    authProvider: AuthProvider;
    bio?: string;
    profileImageUrl?: string | undefined;
    email:string;
    enabled:boolean;
}

export interface functionalAnnouncementProps extends AnnouncementProps{
    removeAnnouncement: (announcement:AnnouncementProps) => void;
    editAnnouncement: (announcement:AnnouncementProps) => void;
}

export interface ProfileProps{
    name:string;
    dateOfBirth:string;
    roles:AppRole[],
    bio?:string;
}

export interface AuditLog {
    id: number;
    now: string;
    value: string;
    performedBy: string;
    status: 'SUCCESSFUL' | 'FAILED';
}
export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
    profileImageUrl: File | null;
}
export interface MemberListProps {
    title: string;
}

export interface AnnouncementProps{
    id: number, 
    type: NotificationType, 
    title: string;
    message: string;
    createdAt: string;
    expiresAt:string;
    isUrgent:boolean;
}
export interface NotificationProps{
    id: number, 
    type: NotificationType, 
    title: string, 
    message: string, 
    time: string, 
    isRead:boolean;
}
export interface GuestPayloadResponse{
    token:string;
}
export interface PasswordRequirementsProps{
    passwordValue: string;
}
export interface RuleProps{
    label:string;
    met:boolean;
}
export interface LoginPayload {
    email: string;
    password: string;
}

export type AppRole = 'MEMBER' | 'YOUTH_LEADER' | 'GUEST' | 'ADMIN';
export type Providers = 'Google' | 'Facebook' | 'Instagram';
export type EventType = 'GENERAL' | 'MEETING' | 'WORSHIP' | 'URGENT' | 'ACTIVITY';
export type ViewMode = "cards" | "table";
export type ConnectionType = "CONNECT" | 'ERROR' | 'REQUEST' | 'DISCONNECT' | 'TRAFFIC'
export type Status = "ACTIVE" | "INACTIVE"
export type AuthProvider = 'LOCAL' | "OAUTH2"
export type ToastResponse = "success" | "error"
export type EmailTestTypes = null|'verify'| 'role-submitted'|'role-request'|'role-approved'|'role-rejected'|'event-created' |'event-cancelled'|'contact'
export type NotificationType = 'WARNING' | 'ERROR' | 'ANNOUNCEMENT' | 'SYSTEM' | 'ROLE_REQUEST' | 'EVENT' | 'SUCCESS' | 'INFO'

export const appRoleArray = ['MEMBER','YOUTH_LEADER','GUEST','ADMIN']
export const providersArray = ['Google', 'Facebook', 'Instagram'];
export const requestsArray = ['Email','name']
export const acceptArray = ['image/png, image/jpeg, image/jpg']
export const connectionTypeArray = ['CONNECT', 'DISCONNECT', 'REQUEST', 'TRAFFIC', 'ERROR']

export const planColors = [
    { eventType: "GENERAL", label: "General", color: "#2563eb" },
    { eventType: "MEETING", label: "Meeting", color: "#10b981" },
    { eventType: "WORSHIP", label: "Worship", color: "#8b5cf6" },
    { eventType: "URGENT", label: "Urgent", color: "#ef4444" },
    { eventType: "ACTIVITY", label: "Activity", color: "#f59e0b" },
];

export const CHUNK_SIZE:number = 5 * 1024 * 1024; // 5mb

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
    '23:00','23:30']
import type { PartialPlan } from "../pages/CalendarPage";
import { type AppRole, type AuthProvider, type EventType, type UserPayload, type YouthProfileProps } from "./types";

export function splitFullName(name: string) {
    const nameParts = name.split(' ');
    const fn = nameParts[0];

    const ln = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

    return { firstName: fn, lastName: ln }
}

export function getAge(dateOfBirth: string): number | null {
    if (!dateOfBirth) return null;

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthday =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

    if (!hasHadBirthday) {
        age--;
    }

    return age;
}
export function ColorUtil() {

    const colors = ['#EF4444', '#10B981', '#F59E0B', '#06B6D4', '#3B82F6'];

    const storedColor = sessionStorage.getItem('profilePictureColor');

    if (storedColor) {
        return storedColor;
    }

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    sessionStorage.setItem('profilePictureColor', randomColor);

    return randomColor;
}

export function mapPayloadToProfile(payload: UserPayload): YouthProfileProps {
    return {
        name: payload.name,
        age: getAge(payload.dateOfBirth),
        roles: payload.roles.length > 0 ? payload.roles : ["GUEST"],
        dateOfBirth: payload.dateOfBirth,
        authProvider: payload.authProvider,
        bio: payload.bio,
        profileImageUrl: payload.profileImageUrl,
        email: payload.email,
        enabled: payload.enabled,
    };
}
export function formatTime(timeStr: string): string {
    if (!timeStr) return '';

    const [hour, minute] = timeStr.split(':').map(Number);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${String(minute).padStart(2, '0')} ${ampm}`;
};

export function formatRoles(roles: AppRole[]): string {
    return roles.map(formatRole).join(", ");
}
export function formatRole(role: string): string {
    return role
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
export function formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "N/A"
}

export function extractName(alt: string): string {
    if (!alt) return "";

    const parts = alt.split(' ');

    return parts.join('|');
}
export function getInitials(fullName: string): string {

    if (fullName.split(' ').length === 1) return fullName[0];

    const { firstName, lastName } = splitFullName(fullName);

    const firstLetter = firstName[0]

    const lastLetter = lastName[0]
    return firstLetter + lastLetter;
}
export function isPermitted(roles: AppRole[]): boolean {

    if (!roles) return false;
    return roles.includes('ADMIN') || roles.includes('YOUTH_LEADER')
}
export function validAdmin(roles: AppRole[]): boolean {
    if (!roles) return false;
    return roles.includes('ADMIN');
}
export function validGuest(isGuest: string | null, route: string): string {

    return isGuest ? '/login' : route
}

export function resetCalendarForm(): PartialPlan {
    return { title: '', description: '', startTime: '', endTime: '', color: '#2563eb', eventType: 'GENERAL' as EventType }
}
export function invalidDate(date: string): boolean {
    const parsedDate = new Date(date).getTime();

    if (isNaN(parsedDate)) {
        return true;
    }
    return parsedDate < Date.now();
}
export function removeAll() {
    localStorage.removeItem('isGuest')
    localStorage.removeItem('email')
}
export function isLocal(authProvider: AuthProvider): boolean {
    return authProvider === 'LOCAL';
}
export function getToken(): string | null {
    const token = localStorage.getItem('jwt-token');
    try {
    
        if (token === null) {
            throw new Error('No jwt token found')
        }
        
    } catch (err) {
        console.error(err)
    }
   
    return token;
}
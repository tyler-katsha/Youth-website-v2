import type { PartialPlan } from "../types/event";
import type { AppRole, EventType, AuthProvider } from "../types/types";
import type { EditProfileFormData, UserPayload, YouthProfileProps } from "../types/user";

export function splitFullName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts[parts.length - 1] };
}

export function extractName(alt: string): string {
    if (!alt) return "";

    const parts = alt.split(' ');

    return parts.join('|');
}

export function getInitials(fullName: string): string {
  if (!fullName || !fullName.trim()) return "";
  const { firstName, lastName } = splitFullName(fullName);
  if (!lastName) return firstName.charAt(0).toUpperCase();
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

export function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null;

  // Split to prevent UTC timezone drift on standard YYYY-MM-DD strings
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const birthDate = month && day ? new Date(year, month - 1, day) : new Date(dateOfBirth);
  
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  return hasHadBirthday ? age : age - 1;
}

const AVATAR_COLORS = ["#EF4444", "#10B981", "#F59E0B", "#06B6D4", "#3B82F6"];

export function getProfileColor(seed?: string): string {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  try {
    const storedColor = sessionStorage.getItem("profilePictureColor");
    if (storedColor) return storedColor;

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    sessionStorage.setItem("profilePictureColor", randomColor);
    return randomColor;
  } catch {
    return AVATAR_COLORS[0];
  }
}

export function mapPayloadToProfile(payload: UserPayload): YouthProfileProps {
  return {
    name: payload.name,
    age: getAge(payload.dateOfBirth),
    roles: payload.roles?.length ? payload.roles : ["GUEST"],
    dateOfBirth: payload.dateOfBirth,
    authProvider: payload.authProvider,
    bio: payload.bio,
    profileImageUrl: payload.profileImageUrl,
    email: payload.email,
    enabled: payload.enabled,
  };
}

export function mapProfilePayloadToProfile(
  profileData: EditProfileFormData,
  currentData: YouthProfileProps
): YouthProfileProps {
  return {
    ...currentData,
    bio: profileData.bio,
    profileImageUrl: profileData.previewUrl ?? undefined,
  };
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (isNaN(hour) || isNaN(minute)) return "";

  const ampm = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${String(minute).padStart(2, "0")} ${ampm}`;
}

export function formatRole(role: string): string {
  if (!role) return "";
  return role
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatRoles(roles: AppRole[]): string {
  return (roles || []).map(formatRole).join(", ");
}

export function formatDate(date: string): string {
  if (!date) return "N/A";
  const parsed = new Date(date);
  return isNaN(parsed.getTime())
    ? "N/A"
    : parsed.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function isPermitted(roles: AppRole[]): boolean {
  return Boolean(roles && (roles.includes("ADMIN") || roles.includes("YOUTH_LEADER")));
}

export function validAdmin(roles: AppRole[]): boolean {
  return Boolean(roles && roles.includes("ADMIN"));
}

export function validGuest(isGuest: string | null, route: string): string {
  return isGuest === "true" ? "/login" : route;
}

export function resetCalendarForm(): PartialPlan {
  return {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    color: "#2563eb",
    eventType: "GENERAL" as EventType,
  };
}

export function invalidDate(date: string): boolean {
  const parsedDate = new Date(date).getTime();
  return isNaN(parsedDate) || parsedDate < Date.now();
}

export function removeAll(): void {
  try {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("family-id");
    localStorage.removeItem("isGuest");
    localStorage.removeItem("email");
    localStorage.removeItem("login-register-pages");
  } catch (err) {
    console.error("Failed to clear localStorage:", err);
  }
}

export function isLocal(authProvider: AuthProvider): boolean {
  return authProvider === "LOCAL";
}

export function getToken(): string | null {
  try {
    return localStorage.getItem("jwt-token");
  } catch {
    return null;
  }
}

export function parseCreatedAt(createdAt: number[]): Date {
  const [year , month , day , hour , minute , second , nano ] = createdAt;
  return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1_000_000));
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  familyId: string;
}


export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  familyId: string;
}

export interface ProtectedRouteProps{
    children: React.ReactNode;
}

export interface GuestPayloadResponse{
    token:string;
}
export interface PasswordRequirementsProps{
    passwordValue: string;
    display?:boolean;
}
export interface RuleProps{
    label:string;
    met:boolean;
}
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
    profileImageUrl: File | null;
    bio:string;
}
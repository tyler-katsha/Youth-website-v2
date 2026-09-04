import type { AppRole, AuthProvider } from "./types";

export interface EditProfileFormData {
    name: string;
    bio: string;
    previewUrl: string | null;
    image: File | null;
}
export interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: YouthProfileProps;
    onSave: (data: EditProfileFormData) => Promise<void>;
}

export interface ProfileCompProps {
    name: string;
    profileImageUrl: string | undefined;
    link?: boolean;
}

export interface UserContextType {
    user: YouthProfileProps | null;
    isLoading: boolean;
    updateUser: (newData: YouthProfileProps) => YouthProfileProps;
    updatePartialUser: (profileData: ProfileProps) => void;
    continueAsGuest: () => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<YouthProfileProps | null>>
}

export interface Member {
    profileImageUrl?: string;
    name: string;
    roles: AppRole[]
    dateOfBirth: string;
    email?: string;
    enabled: boolean;
}

export interface MemberListProps {
    title: string;
}

export interface ProfileProps {
    name: string;
    dateOfBirth: string;
    roles: AppRole[],
    bio?: string;
}

export interface YouthProfileProps {
    name: string;
    age: number | null;
    roles: AppRole[];
    dateOfBirth: string;
    authProvider: AuthProvider;
    bio?: string;
    profileImageUrl?: string | undefined;
    email: string;
    enabled: boolean;
}

export interface UserPayload extends YouthProfileProps {
    createdAt: string;
}
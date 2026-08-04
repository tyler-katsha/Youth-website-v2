import { createContext, useEffect, useState, useContext } from "react";
import { API } from "../utils/API";
import { type ProfileProps, type YouthProfileProps } from "../utils/types";
import { HomeSkeleton } from "../skeletons/pages/HomeSkeleton";
import { getToken } from "../utils/Utils";


interface UserContextType {
    user: YouthProfileProps | null;
    isLoading: boolean;
    updateUser: (newData: YouthProfileProps) => void;
    updatePartialUser: (profileData: ProfileProps) => void;
    continueAsGuest: () => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<YouthProfileProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user;
    const isReady = !isLoading;

    const continueAsGuest = () => {
        setUser({
            name: 'Guest',
            email: '',
            age: 0,
            authProvider: 'LOCAL',
            roles: ['GUEST'],
            profileImage: '',
            dateOfBirth: '',
            bio: '',
            enabled: true
        } as YouthProfileProps)
    }

    const fetchUser = async () => {

        if(localStorage.getItem('email') === 'true'){
            setIsLoading(false);
            return;
        }
        if (localStorage.getItem("isGuest") === 'true') {
            continueAsGuest();
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API}/users/me`, {
                method: 'GET',
                credentials: 'include',
                headers: { 
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {

                setUser(null);
                setIsLoading(false);
                return;
            }

            const data = await response.json();

            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const updateUser = (newData: YouthProfileProps) => {
        setUser(newData);
    }

    const updatePartialUser = (newData: ProfileProps) => {
        setUser(prev => {
            if (!prev) return null;

            return { ...prev, ...newData }
        });
    }

    const logout = () => {
        setUser(null);
    }

    if (!isReady) return <HomeSkeleton />;

    return (
        <UserContext.Provider value={{ user, isLoading, updateUser, continueAsGuest, logout, fetchUser, updatePartialUser, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context;
}
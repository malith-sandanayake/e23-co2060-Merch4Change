import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { setAccessToken as syncTokenToApiClient, setLogoutCallback } from "../api/apiClient";

interface User {
    id: string;
    userName: string;
    email: string;
    accountType: string;
    role?: string;
    createdAt?: string;
}

interface AuthContextValue {
    accessToken: string | null;
    user: User | null;
    login: (accessToken: string, user: User) => void;
    loading: boolean;
    logout: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // accessToken saves in the react memory
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // login call updates
    const login = (newAccessToken: string, newUser: User) => {
        setAccessToken(newAccessToken);
        syncTokenToApiClient(newAccessToken); // keep apiClient in sync
        setUser(newUser);
    };

    // logout calls updates
    const logout = useCallback(() => {
        setAccessToken(null);
        syncTokenToApiClient(null); // clear apiClient token
        setUser(null);
    }, []);

    // Sync token to apiClient whenever it changes
    useEffect(() => {
        syncTokenToApiClient(accessToken);
    }, [accessToken]);

    // Register logout callback so apiClient can trigger logout on refresh failure
    useEffect(() => {
        setLogoutCallback(logout);
    }, [logout]);

    useEffect(() => {
        const attemptSilentRefresh = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
                    method: "POST",
                    credentials: "include",       // attach the refreshToken cookie 
                });

                // browser's fetch API
                // response.ok = true; {200-299}
                // response.ok = false; { 300, 400, 500 }
                if (!response.ok) {
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                if (data?.data?.accessToken) {
                    setAccessToken(data.data.accessToken);
                    syncTokenToApiClient(data.data.accessToken); // sync on silent refresh too
                    setUser(data.data.user);
                }
            } catch {
                setAccessToken(null);
                syncTokenToApiClient(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        attemptSilentRefresh();
    }, []);

    const value: AuthContextValue = {
        accessToken,
        user,
        login,
        loading,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// custom hook to check whether the AuthContext is not null
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
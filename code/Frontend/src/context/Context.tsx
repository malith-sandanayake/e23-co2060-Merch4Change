import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
    id: string;
    userName: string;
    email: string;
    accountType: string;
}

interface AuthContextValue {
    accessToken: string | null;
    user: User | null;
    login: (accessToken: string, user: User) => void;
    logout: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // accessToken saves in the react memory
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);

    // login call updates
    const login = (newAccessToken: string, newUser: User) => {
        setAccessToken(newAccessToken);
        setUser(newUser);
    };

    // logout calls updates
    const logout = () => {
        setAccessToken(null);
        setUser(null);
    };

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
                    // Note: user info isn't returned by /refresh yet — see explanation below
                }
            } catch {
                setAccessToken(null);
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
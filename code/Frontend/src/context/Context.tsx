import { createContext, useContext, useState, type ReactNode } from "react";

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

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // accessToken saves in the react memory
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

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
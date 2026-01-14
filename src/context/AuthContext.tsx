import React, {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

type User = {
    id: string;
    email: string | null;
    type?: string;
};

interface AuthContextType {
    user: User | null;
    loading: boolean;
    initializing: boolean;
    isRecovery: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    clearRecovery: () => void;
    setIsRecovery: (val: boolean) => void;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isRecovery, setIsRecovery] = useState(false);

    // 🧠 Helper: persist session
    const persistSession = async (session: any) => {
        try {
            if (session) {
                await AsyncStorage.setItem("supabase_session", JSON.stringify(session));
            } else {
                await AsyncStorage.removeItem("supabase_session");
            }
        } catch (err) {
            console.error("Error saving session:", err);
        }
    };

    // 🧠 Helper: restore session (only if found)
    const restoreSession = async () => {
        try {
            const sessionString = await AsyncStorage.getItem("supabase_session");

            if (sessionString) {
                console.log("🗂 Found stored Supabase session — restoring...");
                const savedSession = JSON.parse(sessionString);

                const { data, error } = await supabase.auth.setSession(savedSession);
                if (!error && data.session) {
                    setUser({
                        id: data.session.user.id,
                        email: data.session.user.email ?? null,
                        type: "normal",
                    });
                    setInitializing(false);
                    return true; // ✅ restored from storage
                }
            }

            console.log("ℹ️ No stored session found.");
            return false;
        } catch (err) {
            console.error("Error restoring session:", err);
            return false;
        }
    };

    // 🧩 Sign In
    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            if (data.session) {
                await persistSession(data.session);
                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email ?? null,
                    type: "normal",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // 🧩 Sign Up
    const signUp = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            if (data.session) await persistSession(data.session);
        } finally {
            setLoading(false);
        }
    };

    // 🧩 Sign Out
    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            await persistSession(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // 🧩 Forgot Password
    const forgotPassword = async (email: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "authflow://reset-password",
            });
            if (error) throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearRecovery = () => setIsRecovery(false);

    // 🧩 Optimized Initialization
    useEffect(() => {
        const init = async () => {
            const restored = await restoreSession();

            // 🧠 Only fetch from Supabase if nothing was in storage
            if (!restored) {
                console.log("📡 Fetching fresh session from Supabase...");
                const { data } = await supabase.auth.getSession();

                const session = data.session;
                if (session) {
                    await persistSession(session);
                    setUser({
                        id: session.user.id,
                        email: session.user.email ?? null,
                        type: "normal",
                    });
                }
            }

            setInitializing(false);
        };

        init();

        // Auth state listener — sync updates & refresh tokens
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth event:", event);
            await persistSession(session);
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? null,
                    type: "normal",
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                initializing,
                isRecovery,
                signIn,
                signUp,
                signOut,
                forgotPassword,
                clearRecovery,
                setIsRecovery,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

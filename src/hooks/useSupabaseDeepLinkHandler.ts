import { useEffect } from "react";
import { Linking } from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/useAuth";
import { navigate, resetTo } from "../navigation/NavigationRef";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { beginRecoverySession, startRecoveryMonitor } from "../lib/RecoverySessionManager";

export function useSupabaseDeepLinkHandler() {
    const { setIsRecovery, setUser } = useAuth();

    useEffect(() => {
        const handleDeepLink = async ({ url }: { url: string }) => {
            try {
                // Handle both hash and query style links
                const queryString = url.includes("#")
                    ? url.split("#")[1]
                    : url.split("?")[1];

                const params = Object.fromEntries(new URLSearchParams(queryString));
                console.log("🔗 Deep link params:", params);
                const { access_token, refresh_token, type } = params;

                // 🧠 Handle password recovery flow
                if (type === "recovery" && access_token) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token,
                    });

                    if (!error && data.session) {
                        const recoveryUser = {
                            id: data.session.user.id,
                            email: data.session.user.email ?? null,
                            type: "recovery",
                        };

                        await beginRecoverySession(data.session, recoveryUser);
                        startRecoveryMonitor(() => {
                            setUser(null);
                            setIsRecovery(false);
                        });

                        setUser(recoveryUser);
                        setIsRecovery(true);

                        // ✅ Navigation happens immediately here
                        navigate("ResetPassword");

                        Toast.show({
                            type: "success",
                            text1: "Recovery session restored!",
                        });
                    }
                }

                // 🧩 Handle OAuth or magic link sign-in
                await supabase.auth.exchangeCodeForSession(url);
            } catch (err) {
                console.error("Deep link error:", err);
            }
        };

        // Listen for incoming links
        const sub = Linking.addEventListener("url", handleDeepLink);

        // Handle cold starts
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });

        return () => sub.remove();
    }, [setIsRecovery, setUser]);
}

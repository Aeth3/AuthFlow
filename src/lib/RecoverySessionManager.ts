import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";
import { supabase } from "../lib/supabase";

/**
 * Keys used for persistence
 */
const SESSION_KEY = "supabase_session";
const USER_KEY = "supabase_user";
const RECOVERY_FLAG = "in_recovery_mode";

let appStateSubscription: { remove: () => void } | null = null;

/**
 * Initialize recovery monitoring.
 * Clears any session if the app is killed while in recovery mode.
 */
export function startRecoveryMonitor(onClear: () => void) {
    if (appStateSubscription) return; // already listening

    appStateSubscription = AppState.addEventListener(
        "change",
        async (nextState: AppStateStatus) => {
            const inRecovery = await AsyncStorage.getItem(RECOVERY_FLAG);
            if (inRecovery === "true" && (nextState === "inactive")) {
                console.log("💥 App closing during recovery — clearing session and user...");
                await clearRecoverySession();
                onClear?.();
            }
        }
    );
}

/**
 * Stop monitoring app state.
 */
export function stopRecoveryMonitor() {
    if (appStateSubscription) {
        appStateSubscription.remove();
        appStateSubscription = null;
    }
}

/**
 * Marks a recovery session and stores tokens + user.
 */
export async function beginRecoverySession(session: any, user: any) {
    try {
        await AsyncStorage.multiSet([
            [SESSION_KEY, JSON.stringify(session)],
            [USER_KEY, JSON.stringify({ ...user, type: "recovery" })],
            [RECOVERY_FLAG, "true"],
        ]);
        console.log("✅ Recovery session stored & flagged.");
    } catch (err) {
        console.error("Error starting recovery session:", err);
    }
}

/**
 * Clears all recovery data (session + user + flag)
 */
export async function clearRecoverySession() {
    try {
        await forceSupabaseLogout(); // 👈 important: clear Supabase internal cache
        await AsyncStorage.multiRemove([SESSION_KEY, USER_KEY, RECOVERY_FLAG]);
        console.log("🧹 Cleared recovery session and Supabase cache.");
    } catch (err) {
        console.error("Error clearing recovery session:", err);
    }
}

/**
 * Restores session only if not killed mid-recovery.
 */
export async function safeRestoreSession(): Promise<boolean> {
    try {
        const recoveryFlag = await AsyncStorage.getItem(RECOVERY_FLAG);

        // 🚫 If killed during recovery, purge everything including Supabase's cache
        if (recoveryFlag === "true") {
            console.log("🚫 Skipping session restore (was in recovery mode)");
            await clearRecoverySession(); // this now signs out of Supabase too
            return false;
        }

        const sessionString = await AsyncStorage.getItem(SESSION_KEY);
        if (!sessionString) return false;

        const savedSession = JSON.parse(sessionString);
        const { data, error } = await supabase.auth.setSession(savedSession);
        console.log("savedSession", savedSession);

        if (!error && data.session) {
            console.log("✅ Restored normal session.");
            return true;
        }

        return false;
    } catch (err) {
        console.error("Error restoring session safely:", err);
        return false;
    }
}

export async function forceSupabaseLogout() {
    try {
        console.log("🧨 Forcing Supabase logout — removing internal cache...");
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Supabase signOut error:", error.message);

        // 👇 Supabase SDK may also use AsyncStorage directly for session cache
        const allKeys = await AsyncStorage.getAllKeys();
        const supabaseKeys = allKeys.filter((k) => k.includes("supabase"));
        await AsyncStorage.multiRemove(supabaseKeys);

        console.log("✅ Cleared Supabase local cache keys:", supabaseKeys);
    } catch (err) {
        console.error("Error forcing Supabase logout:", err);
    }
}

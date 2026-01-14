import React, { useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../lib/supabase";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { globalStyles } from "../theme/globalStyles";
import { useAuth } from "../context/useAuth";
import {
    clearRecoverySession,
    stopRecoveryMonitor,
} from "../lib/RecoverySessionManager";

export default function ResetPasswordScreen() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { clearRecovery, signOut } = useAuth();

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Toast.show({ type: "error", text1: "Please fill in both fields." });
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({ type: "error", text1: "Passwords do not match" });
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setLoading(false);

        if (error) {
            console.error("Error resetting password:", error.message);
            Toast.show({
                type: "error",
                text1: "Failed to reset password",
                text2: error.message,
            });
            return;
        }

        Toast.show({
            type: "success",
            text1: "Password updated successfully!",
            text2: "You can now log in with your new password.",
        });

        // 🧹 Clear everything and log out completely
        await clearRecoverySession();
        stopRecoveryMonitor();
        clearRecovery();
        await signOut(); // 👈 Triggers RootNavigator to switch to AuthNavigator automatically
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={globalStyles.screen}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={globalStyles.screenPadding}>
                    <AuthHeader
                        title="Reset Password"
                        subtitle="Enter your new password below"
                    />

                    <AuthInput
                        label="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholder="Enter new password"
                    />

                    <AuthInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="Confirm new password"
                    />

                    <PrimaryButton
                        title="Update Password"
                        onPress={handleResetPassword}
                        loading={loading}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

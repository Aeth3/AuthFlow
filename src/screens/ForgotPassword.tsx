import React, { useState, useContext } from "react";
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../context/AuthContext"; // 👈 import your context
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { globalStyles } from "../theme/globalStyles";
import { isValidEmail } from "../lib/helpers";
import { colors, spacing, typography } from "../theme/theme";
import { useAuth } from "../context/useAuth";

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const { forgotPassword, loading } = useAuth();

    const handleSendReset = async () => {
        if (!isValidEmail(email)) {
            Toast.show({ type: "error", text1: "Please enter a valid email" });
            return;
        }

        try {
            await forgotPassword(email); // 👈 call from context
            Toast.show({ type: "success", text1: "Password reset email sent!" });
            navigation.navigate("Login"); // or stay on the screen
        } catch (error: any) {
            Toast.show({ type: "error", text1: "Error", text2: error.message });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={globalStyles.screen}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={globalStyles.screenPadding}>
                    <AuthHeader
                        title="Forgot Password"
                        subtitle="Enter your email to receive a reset link"
                    />
                    <AuthInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="example@email.com"
                    />
                    <PrimaryButton
                        title="Send Reset Email"
                        loading={loading}
                        onPress={handleSendReset}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    success: {
        ...typography.caption,
        color: colors.success,
        marginBottom: spacing.sm,
        textAlign: "center",
    },
});

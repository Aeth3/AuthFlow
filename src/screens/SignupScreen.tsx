import React, { useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    StyleSheet,
} from "react-native";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { globalStyles } from "../theme/globalStyles";
import { useAuth } from "../context/useAuth";
import { colors, spacing, typography } from "../theme/theme";
import Toast from "react-native-toast-message";
import { isValidEmail } from "../lib/helpers";
import { useNavigation } from "@react-navigation/core";

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading, signUp } = useAuth()
    const navigation = useNavigation();
    const handleSignup = async () => {
        if (!isValidEmail(email)) {
            Toast.show({
                type: "error",
                text1: "Enter a valid email address",
            });
            return;
        }
        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Passwords do not match",
            });
            return;
        }

        try {
            await signUp(email, password);

            Toast.show({
                type: "success",
                text1: "Account created",
                text2: "Check your email to verify your account",
            });

            // ✅ Clear fields AFTER success
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigation.goBack();
        } catch (err: unknown) {
            // console.error(err);
            
            Toast.show({
                type: "error",
                text1:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong",
            });
        }
    };


    return (
        <KeyboardAvoidingView
            style={globalStyles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={globalStyles.screenPadding}>
                    <AuthHeader
                        title="Create Account"
                        subtitle="Sign up to get started"
                    />

                    <View style={globalStyles.form}>
                        <AuthInput
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <AuthInput
                            label="Password"
                            placeholder="Create a password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <AuthInput
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <PrimaryButton
                            title="Sign up"
                            onPress={handleSignup}
                            loading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    error: {
        ...typography.caption,
        color: colors.error,
        marginBottom: spacing.sm,
        textAlign: "center",
    },
});
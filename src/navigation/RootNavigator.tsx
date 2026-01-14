import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthNavigator } from "./AuthNavigator";
import { AppNavigator } from "./AppNavigator";
import { useAuth } from "../context/useAuth";
import { useSupabaseDeepLinkHandler } from "../hooks/useSupabaseDeepLinkHandler";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

export const RootNavigator = () => {
    const { user, initializing, isRecovery } = useAuth();
    // return <ResetPasswordScreen />
    // Wait for both session & deep link
    if (initializing) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Recovery flow first
    if (isRecovery || user?.type === "recovery") {
        return <AuthNavigator initialRoute="ResetPassword" />;
    }

    if (user && user.type === "normal") {
        return <AppNavigator />;
    }

    return <AuthNavigator />;
};

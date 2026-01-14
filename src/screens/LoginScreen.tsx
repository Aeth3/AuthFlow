import {
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useState } from "react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { globalStyles } from "../theme/globalStyles";
import { TextLink } from "../components/TextLink";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/useAuth";
import Toast from "react-native-toast-message";
import { isValidEmail } from "../lib/helpers";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation<NavigationProp>()
    const { loading, signIn } = useAuth()
    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            Toast.show({
                type: "error",
                text1: "Enter a valid email address",
            });
            return;
        }
        try {
            await signIn(email, password);
        } catch (err) {
            Toast.show({
                type: "error",
                text1:
                    err instanceof Error
                        ? err.message
                        : "Unable to log in",
            });
        }
    }
    return (
        <KeyboardAvoidingView
            style={globalStyles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={globalStyles.screenPadding}>
                    <AuthHeader
                        title="Login"
                        subtitle="Please sign in to continue"
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
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextLink
                            title="Forgot password?"
                            align="right"
                            onPress={() => navigation.navigate("ForgotPassword")}
                        />
                        <PrimaryButton
                            title="Log in"
                            onPress={handleLogin}
                            loading={loading}
                        />
                        <TextLink
                            title="Don’t have an account? Create one"
                            onPress={() => navigation.navigate("Signup")}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

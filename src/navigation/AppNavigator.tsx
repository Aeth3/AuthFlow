import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
import { useAuth } from "../context/useAuth";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

export type AppStackParamList = {
    Home: undefined;
    ResetPassword: undefined
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const HomeScreen = () => {
    const { signOut } = useAuth();

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Home Screen</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    );
};
type Props = {
    initialRoute?: keyof AppStackParamList;
};

export const AppNavigator = ({ initialRoute = "Home" }: Props) => {
    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerTitle: "Home" }}
            />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

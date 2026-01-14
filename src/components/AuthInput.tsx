import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "../theme/theme";

interface AuthInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
}

export const AuthInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
}: AuthInputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={secureTextEntry}
                style={[
                    styles.input,
                    error && { borderColor: colors.error },
                ]}
            />

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    input: {
        height: 48,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.input.fontSize,
        borderWidth: 1,
        borderColor: colors.border,
    },
    error: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
});

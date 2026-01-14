import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { colors, radius, spacing, typography } from "../theme/theme";

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export const PrimaryButton = ({
    title,
    onPress,
    loading,
    disabled,
}: PrimaryButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
            style={[
                styles.button,
                isDisabled && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        backgroundColor: colors.primary, // ✅ theme blue
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.sm,
    },
    text: {
        ...typography.button,
        color: "#fff",
    },
    disabled: {
        backgroundColor: colors.primaryDark, // ✅ darker blue when disabled/loading
        opacity: 0.7,
    },
});

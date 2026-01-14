import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/theme";

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
        alignItems: "center", // 👈 centers children horizontally
    },
    title: {
        ...typography.title,
        color: colors.primary,
        marginBottom: spacing.xs,
        textAlign: "center", // 👈 centers text itself
    },
    subtitle: {
        ...typography.subtitle,
        color: colors.textSecondary,
        textAlign: "center", // 👈 centers text itself
    },
});

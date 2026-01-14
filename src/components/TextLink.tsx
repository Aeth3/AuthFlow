import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/theme";

interface TextLinkProps {
    title: string;
    onPress: () => void;
    align?: "center" | "right";
}

export const TextLink = ({ title, onPress, align = "center" }: TextLinkProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                align === "right" && { alignItems: "flex-end" },
            ]}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
        alignItems: "center",
    },
    text: {
        ...typography.caption,
        color: colors.primary,
    },
});

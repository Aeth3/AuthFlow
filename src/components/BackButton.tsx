import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, typography } from "../theme/theme";

export const BackButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.container}
        >
            <Text style={styles.arrow}>←</Text>
            <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    arrow: {
        fontSize: 20,
        color: colors.textPrimary,
        marginRight: spacing.xs,
    },
    text: {
        ...typography.caption,
        color: colors.textPrimary,
    },
});

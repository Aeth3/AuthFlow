import { StyleSheet } from "react-native";
import { colors, spacing } from "./theme";

export const globalStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    screenPadding: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl * 1.5,
    },

    form: {
        marginTop: spacing.lg,
    },

    center: {
        alignItems: "center",
        justifyContent: "center",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },
});

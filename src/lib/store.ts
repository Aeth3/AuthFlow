// src/lib/store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "app_"; // 👈 optional prefix to avoid key collisions

export const store = {
    /**
     * Save any JSON-serializable value
     */
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(PREFIX + key, jsonValue);
        } catch (err) {
            console.error(`[Store] Failed to set ${key}:`, err);
        }
    },

    /**
     * Retrieve a parsed item by key
     */
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(PREFIX + key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (err) {
            console.error(`[Store] Failed to get ${key}:`, err);
            return null;
        }
    },

    /**
     * Remove an item
     */
    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(PREFIX + key);
        } catch (err) {
            console.error(`[Store] Failed to remove ${key}:`, err);
        }
    },

    /**
     * Clear all app data
     */
    async clearAll(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const appKeys = allKeys.filter((k) => k.startsWith(PREFIX));
            await AsyncStorage.multiRemove(appKeys);
        } catch (err) {
            console.error("[Store] Failed to clear data:", err);
        }
    },
};

// src/navigation/navigationTypes.ts
import type { AuthStackParamList } from "./AuthNavigator";
import type { AppStackParamList } from "./AppNavigator";

export type RootStackParamList = AuthStackParamList & AppStackParamList;
// src/navigation/navigationRef.ts
import {
    createNavigationContainerRef,
    StackActions,
} from "@react-navigation/native";
import type { AuthStackParamList } from "./AuthNavigator";

export const navigationRef = createNavigationContainerRef<AuthStackParamList>();

// ✅ Strongly typed but simpler navigate
export function navigate(name: keyof AuthStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// ✅ Reset safely to a given screen
export function resetTo<RouteName extends keyof AuthStackParamList>(
    name: RouteName
) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            StackActions.replace(name as never) // replaces current route with target
        );
    }
}

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  initialize(): void;
  initializeSdk(): void;
  invokeEvent(eventName: string): void;
  enterScreen(screenName: string): void;
  leaveScreen(screenName: string): void;
  setUserId(userId: string): void;
  setUserTrait(traitName: string, traitValue: string): void;
  setWorkspaceKey(workspaceKey: string): void;
  reset(): void;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.get<Spec>("SurvicateBindings");

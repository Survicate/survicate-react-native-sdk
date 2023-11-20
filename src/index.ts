import { NativeModules } from "react-native";

const { SurvicateBindings } = NativeModules;

// @ts-expect-error
const isTurboModuleEnabled: boolean = global.__turboModuleProxy != null;

const survicate: any = isTurboModuleEnabled
  ? require("./NativeSurvicateModule").default
  : SurvicateBindings;

class Survicate {
  static initializeSdk(): void {
    survicate.initializeSdk();
  }

  static invokeEvent(eventName: string): void {
    survicate.invokeEvent(eventName);
  }

  static enterScreen(screenName: string): void {
    survicate.enterScreen(screenName);
  }

  static leaveScreen(screenName: string): void {
    survicate.leaveScreen(screenName);
  }

  static setUserId(userId: string): void {
    survicate.setUserId(userId);
  }

  static setUserTrait(traitName: string, traitValue: string): void {
    survicate.setUserTrait(traitName, traitValue);
  }

  static reset(): void {
    survicate.reset();
  }
}

export default Survicate;

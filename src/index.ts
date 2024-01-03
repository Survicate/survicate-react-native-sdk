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

  /**
  * @deprecated Use setUserTrait(userTrait: UserTrait) method instead.
  */
  static setUserTrait(traitName: string, traitValue: string): void;
  static setUserTrait(userTrait: UserTrait): void;
  static setUserTrait(traitNameOrUserTrait: string | UserTrait, traitValue?: string): void {
    if (typeof traitNameOrUserTrait === 'string' && traitValue !== undefined) {
      survicate.setUserTrait(traitNameOrUserTrait, traitValue);
    } else if (traitNameOrUserTrait instanceof UserTrait) {
      survicate.setUserTrait(traitNameOrUserTrait.key, traitNameOrUserTrait.value);
    }
  }

  static reset(): void {
    survicate.reset();
  }
}

export class UserTrait {
  key: string;
  value: string | null;

  constructor(key: string, value: string | number | boolean | Date | null) {
    this.key = key;
  
    if (value instanceof Date) {
      this.value = this.formatDateToTimeZoneIso(value);
    } else if (value !== null) {
      this.value = value.toString();
    } else {
      this.value = null;
    }
  }
  
  private formatDateToTimeZoneIso(date: Date): string {
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().slice(0, -5) + (offset > 0 ? "-" : "+") + offsetHours.toString().padStart(2, '0') + ":" + offsetMinutes.toString().padStart(2, '0');
  }
}

export default Survicate;

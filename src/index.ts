import { NativeModules, NativeEventEmitter } from "react-native";

const { SurvicateBindings } = NativeModules;

// @ts-expect-error
const isTurboModuleEnabled: boolean = global.__turboModuleProxy != null;

const survicate: any = isTurboModuleEnabled
  ? require("./NativeSurvicateModule").default
  : SurvicateBindings;

export class SurvicateIntegrations {}

class Survicate {
  static integrations = new SurvicateIntegrations();

  static setWorkspaceKey(workspaceKey: string): void {
    survicate.setWorkspaceKey(workspaceKey);
  }

  static initializeSdk(): void {
    survicate.initializeSdk();
  }

  static invokeEvent(
    eventName: string,
    eventProperties?: Record<string, string>
  ): void {
    survicate.invokeEvent(eventName, eventProperties || {});
  }

  static enterScreen(screenName: string): void {
    survicate.enterScreen(screenName);
  }

  static leaveScreen(screenName: string): void {
    survicate.leaveScreen(screenName);
  }

  /**
   * @deprecated Use setUserTrait(userTrait: UserTrait) method with `user_id' UserTrait instead.
   */
  static setUserId(userId: string): void {
    survicate.setUserId(userId);
  }

  /**
   * @deprecated Use setUserTrait(userTrait: UserTrait) method instead.
   */
  static setUserTrait(traitName: string, traitValue: string): void;
  static setUserTrait(userTrait: UserTrait): void;
  static setUserTrait(
    traitNameOrUserTrait: string | UserTrait,
    traitValue?: string
  ): void {
    if (typeof traitNameOrUserTrait === "string" && traitValue !== undefined) {
      survicate.setUserTrait(traitNameOrUserTrait, traitValue);
    } else if (traitNameOrUserTrait instanceof UserTrait) {
      survicate.setUserTrait(
        traitNameOrUserTrait.key,
        traitNameOrUserTrait.value
      );
    }
  }

  static reset(): void {
    survicate.reset();
  }

  static addSurvicateEventListener(
    listener: SurvicateEventListener
  ): () => void {
    const eventEmitter = new NativeEventEmitter(survicate);

    const onSurveyDisplayedCallback = (nativeEvent: any) => {
      let event: SurveyDisplayedEvent = { surveyId: nativeEvent.surveyId };
      if (listener.onSurveyDisplayed !== undefined) {
        listener.onSurveyDisplayed!(event);
      }
    };
    const onSurveyDisplayedListener = eventEmitter.addListener(
      "onSurveyDisplayed",
      (event) => onSurveyDisplayedCallback(event)
    );

    const onQuestionAnsweredCallback = (nativeEvent: any) => {
      let answer: SurvicateAnswer = {
        type: nativeEvent.answerType,
        id: nativeEvent.answerId,
        ids: nativeEvent.answerIds,
        value: nativeEvent.answerValue,
      };
      let event: QuestionAnsweredEvent = {
        surveyId: nativeEvent.surveyId,
        surveyName: nativeEvent.surveyName,
        visitorUuid: nativeEvent.visitorUuid,
        responseUuid: nativeEvent.responseUuid,
        questionId: nativeEvent.questionId,
        question: nativeEvent.question,
        answer: answer,
        panelAnswerUrl: nativeEvent.panelAnswerUrl,
      };
      if (listener.onQuestionAnswered !== undefined) {
        listener.onQuestionAnswered!(event);
      }
    };
    const onQuestionAnsweredListener = eventEmitter.addListener(
      "onQuestionAnswered",
      onQuestionAnsweredCallback
    );

    const onSurveyCompletedCallback = (nativeEvent: any) => {
      let event: SurveyCompletedEvent = { surveyId: nativeEvent.surveyId };
      if (listener.onSurveyCompleted !== undefined) {
        listener.onSurveyCompleted!(event);
      }
    };

    const onSurveyCompletedListener = eventEmitter.addListener(
      "onSurveyCompleted",
      onSurveyCompletedCallback
    );

    const onSurveyClosedCallback = (nativeEvent: any) => {
      let event: SurveyClosedEvent = { surveyId: nativeEvent.surveyId };
      if (listener.onSurveyClosed !== undefined) {
        listener.onSurveyClosed!(event);
      }
    };

    const onSurveyClosedListener = eventEmitter.addListener(
      "onSurveyClosed",
      onSurveyClosedCallback
    );

    return () => {
      onSurveyDisplayedListener.remove();
      onQuestionAnsweredListener.remove();
      onSurveyCompletedListener.remove();
      onSurveyClosedListener.remove();
    };
  }
  
  /**
   * Sets the preferred locale used for survey translations and targeting filters.
   * The specified locale takes priority over the device's default locale.
   *
   * This method affects only the Survicate SDK and does not change in any way the app locale settings.
   *
   * @param languageTag An IETF language tag such as:
   * - Two-letter ISO 639 language code (e.g., "en", "fr")
   * - Three-letter ISO 639 language code for languages without the two-letter code (e.g., "haw", "yue")
   * - Language with region (e.g., "en-US", "pt-BR")
   * - Language with script (e.g., "zh-Hans")
   */
  static setLocale(languageTag: string): void {
    survicate.setLocale(languageTag);
  }
}

export class UserTrait {
  key: string;
  value: string;

  constructor(key: string, value: string | number | boolean | Date) {
    if (key === null || value === null) {
      throw new Error("Key and value cannot be null");
    }

    this.key = key;

    if (value instanceof Date) {
      this.value = this.formatDateToTimeZoneIso(value);
    } else {
      this.value = value.toString();
    }
  }

  private formatDateToTimeZoneIso(date: Date): string {
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    date = new Date(date.getTime() - offset * 60 * 1000);
    return (
      date.toISOString().slice(0, -5) +
      (offset > 0 ? "-" : "+") +
      offsetHours.toString().padStart(2, "0") +
      ":" +
      offsetMinutes.toString().padStart(2, "0")
    );
  }
}

export type SurveyDisplayedEvent = {
  surveyId: string;
};

export type QuestionAnsweredEvent = {
  surveyId: string;
  surveyName: string;
  visitorUuid: string;
  responseUuid: string;
  questionId: string;
  question: string | null;
  answer: SurvicateAnswer;
  panelAnswerUrl: string;
};

export type SurvicateAnswer = {
  type: string | null;
  id: number | null;
  ids: number[];
  value: string | null;
};

export type SurveyCompletedEvent = {
  surveyId: string;
};

export type SurveyClosedEvent = {
  surveyId: string;
};

export interface SurvicateEventListener {
  onSurveyDisplayed?: (event: SurveyDisplayedEvent) => void;
  onQuestionAnswered?: (event: QuestionAnsweredEvent) => void;
  onSurveyCompleted?: (event: SurveyCompletedEvent) => void;
  onSurveyClosed?: (event: SurveyClosedEvent) => void;
}

export default Survicate;

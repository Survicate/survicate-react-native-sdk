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

  /**
   * Sets the theme mode for survey appearance.
   *
   * @param themeMode The theme mode to apply: ThemeMode.light, ThemeMode.dark, or ThemeMode.auto (default).
   */
  static setThemeMode(themeMode: ThemeMode): void {
    survicate.setThemeMode(themeMode);
  }

  /**
   * Sets custom fonts for use in surveys.
   *
   * @param fontSystem A font configuration to apply.
   */
  static setFonts(fontSystem: SurvicateFontSystem): void {
    survicate.setFonts(fontSystem);
  }

  /**
   * Shorthand version of {@link setResponseAttributes}.
   */
  static setResponseAttribute(attribute: ResponseAttribute): void {
    survicate.setResponseAttributes([{
      name: attribute.name,
      value: attribute.value,
      provider: attribute.provider ?? null,
    }]);
  }

  /**
   * Sets response attributes that will be attached to survey responses.
   *
   * These can be arbitrary key-value pairs. Unlike {@link UserTrait}s, response attributes
   * are session-scoped and are cleared upon a new app session. Response attributes are sent
   * to the system along with the user's answers to survey questions.
   *
   * To change a {@link ResponseAttribute} send the same key with a different value.
   */
  static setResponseAttributes(attributes: ResponseAttribute[]): void {
    const mapped = attributes.map((a) => ({
      name: a.name,
      value: a.value,
      provider: a.provider ?? null,
    }));
    survicate.setResponseAttributes(mapped);
  }
}

function formatDateToTimeZoneIso(date: Date): string {
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

export class UserTrait {
  key: string;
  value: string;

  constructor(key: string, value: string | number | boolean | Date) {
    if (key === null || value === null) {
      throw new Error("Key and value cannot be null");
    }

    this.key = key;

    if (value instanceof Date) {
      this.value = formatDateToTimeZoneIso(value);
    } else {
      this.value = value.toString();
    }
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

export enum ThemeMode {
  light = "light",
  dark = "dark",
  auto = "auto",
}

/**
 * Represents a complete set of fonts used by the SDK.
 *
 * @property regular Standard font for normal body text.
 * @property regularItalic Standard font with italic slant.
 * @property bold Bold style font for emphasized content.
 * @property boldItalic Bold style font with italic slant.
 */
export type SurvicateFontSystem = {
  regular: string;
  regularItalic: string;
  bold: string;
  boldItalic: string;
};

/**
 * Represents a response attribute attached to a survey response.
 *
 * @property name The attribute identifier.
 * @property value The attribute value.
 * @property provider Optional source or provider of the attribute.
 */
export class ResponseAttribute {
  name: string;
  value: string;
  provider?: string;

  constructor(
    name: string,
    value: string | number | boolean | Date,
    provider?: string
  ) {
    if (name === null || value === null) {
      throw new Error("Name and value cannot be null");
    }

    this.name = name;

    if (value instanceof Date) {
      this.value = formatDateToTimeZoneIso(value);
    } else {
      this.value = value.toString();
    }

    this.provider = provider;
  }
}

export default Survicate;

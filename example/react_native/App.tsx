import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import Survicate, {
  QuestionAnsweredEvent,
  ResponseAttribute,
  SurveyClosedEvent,
  SurveyCompletedEvent,
  SurveyDisplayedEvent,
  ThemeMode,
  UserTrait,
} from "@survicate/react-native-survicate";

type ActionButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

const ActionButton = ({ title, onPress, disabled }: ActionButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={title}
    accessibilityState={{ disabled: !!disabled }}
    style={({ pressed }) => [
      styles.button,
      pressed && !disabled && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ]}
  >
    <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
      {title}
    </Text>
  </Pressable>
);

type LogEntry = { id: number; ts: number; type: string; payload: unknown };
type TraitEntry = { id: number; key: string; value: string };
type AttrEntry = {
  id: number;
  name: string;
  value: string;
  provider?: string;
};
const LOG_LIMIT = 50;

const App = () => {
  const [workspaceKeyInput, setWorkspaceKeyInput] = useState("");
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [localeInput, setLocaleInput] = useState("");
  const [screenName, setScreenName] = useState("");
  const [eventName, setEventName] = useState("");
  const [propKey, setPropKey] = useState("");
  const [propValue, setPropValue] = useState("");
  const [eventProps, setEventProps] = useState<Map<string, string>>(new Map());
  const [traitKey, setTraitKey] = useState("");
  const [traitValue, setTraitValue] = useState("");
  const [traits, setTraits] = useState<TraitEntry[]>([]);
  const [attrName, setAttrName] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [attrProvider, setAttrProvider] = useState("");
  const [responseAttrs, setResponseAttrs] = useState<AttrEntry[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [logVisible, setLogVisible] = useState(true);
  const idRef = useRef(0);

  const appendLog = useCallback((type: string, payload: unknown) => {
    const id = ++idRef.current;
    setLog((prev) => [{ id, ts: Date.now(), type, payload }, ...prev].slice(0, LOG_LIMIT));
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!sdkInitialized) return;
    const subscription = Survicate.addSurvicateEventListener({
      onSurveyDisplayed: (event: SurveyDisplayedEvent) =>
        appendLog("onSurveyDisplayed", event),
      onQuestionAnswered: (event: QuestionAnsweredEvent) =>
        appendLog("onQuestionAnswered", event),
      onSurveyClosed: (event: SurveyClosedEvent) =>
        appendLog("onSurveyClosed", event),
      onSurveyCompleted: (event: SurveyCompletedEvent) =>
        appendLog("onSurveyCompleted", event),
    });
    return subscription;
  }, [sdkInitialized, appendLog]);

  const addEventProp = () => {
    if (!propKey) return;
    setEventProps((prev) => {
      const next = new Map(prev);
      next.set(propKey, propValue);
      return next;
    });
    setPropKey("");
    setPropValue("");
  };

  const removeEventProp = (key: string) => {
    setEventProps((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const invokeEvent = () => {
    const properties =
      eventProps.size === 0 ? undefined : Object.fromEntries(eventProps);
    if (properties) {
      Survicate.invokeEvent(eventName, properties);
    } else {
      Survicate.invokeEvent(eventName);
    }
    appendLog("→ invokeEvent", { eventName, properties });
  };

  const addTrait = () => {
    if (!traitKey) return;
    const trait = new UserTrait(traitKey, traitValue);
    Survicate.setUserTrait(trait);
    appendLog("→ setUserTrait", { key: trait.key, value: trait.value });
    setTraits((prev) => [
      ...prev,
      { id: ++idRef.current, key: trait.key, value: trait.value },
    ]);
    setTraitKey("");
    setTraitValue("");
  };

  const addResponseAttr = () => {
    if (!attrName) return;
    const attr = new ResponseAttribute(
      attrName,
      attrValue,
      attrProvider || undefined
    );
    Survicate.setResponseAttribute(attr);
    appendLog("→ setResponseAttribute", {
      name: attr.name,
      value: attr.value,
      provider: attr.provider,
    });
    setResponseAttrs((prev) => [
      ...prev,
      {
        id: ++idRef.current,
        name: attr.name,
        value: attr.value,
        provider: attr.provider,
      },
    ]);
    setAttrName("");
    setAttrValue("");
    setAttrProvider("");
  };

  const resetAll = () => {
    Survicate.reset();
    setLocaleInput("");
    setScreenName("");
    setEventName("");
    setPropKey("");
    setPropValue("");
    setEventProps(new Map());
    setTraitKey("");
    setTraitValue("");
    setTraits([]);
    setAttrName("");
    setAttrValue("");
    setAttrProvider("");
    setResponseAttrs([]);
    setExpandedIds(new Set());
    setLog([{ id: ++idRef.current, ts: Date.now(), type: "→ reset", payload: {} }]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Survicate RN Example</Text>

        <Text style={styles.sectionTitle}>Workspace key</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="workspaceKey"
            value={workspaceKeyInput}
            onChangeText={setWorkspaceKeyInput}
            autoCapitalize="none"
            editable={!sdkInitialized}
            placeholderTextColor="#999"
          />
          <ActionButton
            title="Initialize SDK"
            onPress={() => {
              Survicate.setWorkspaceKey(workspaceKeyInput);
              Survicate.initializeSdk();
              setSdkInitialized(true);
              appendLog("→ initializeSdk", { workspaceKey: workspaceKeyInput });
            }}
            disabled={!workspaceKeyInput || sdkInitialized}
          />
        </View>

        <Text style={styles.sectionTitle}>Events</Text>
        <TextInput
          style={styles.input}
          placeholder="eventName"
          value={eventName}
          onChangeText={setEventName}
          placeholderTextColor="#999"
        />
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="key"
            value={propKey}
            onChangeText={setPropKey}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.inputFlex}
            placeholder="value"
            value={propValue}
            onChangeText={setPropValue}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <ActionButton
            title="Add"
            onPress={addEventProp}
            disabled={!sdkInitialized || !propKey}
          />
        </View>
        {Array.from(eventProps).map(([k, v]) => (
          <View key={k} style={styles.listRow}>
            <Text style={styles.listRowText}>
              {k}: {v}
            </Text>
            <ActionButton
              title="Remove"
              onPress={() => removeEventProp(k)}
              disabled={!sdkInitialized}
            />
          </View>
        ))}
        <ActionButton
          title="Invoke Event"
          onPress={invokeEvent}
          disabled={!sdkInitialized || !eventName}
        />

        <Text style={styles.sectionTitle}>User Traits</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="key"
            value={traitKey}
            onChangeText={setTraitKey}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.inputFlex}
            placeholder="value"
            value={traitValue}
            onChangeText={setTraitValue}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <ActionButton
            title="Set"
            onPress={addTrait}
            disabled={!sdkInitialized || !traitKey}
          />
        </View>
        {traits.map((t) => (
          <View key={t.id} style={styles.listRow}>
            <Text style={styles.listRowText}>
              {t.key}: {t.value}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Screens</Text>
        <TextInput
          style={styles.input}
          placeholder="screenName"
          value={screenName}
          onChangeText={setScreenName}
          placeholderTextColor="#999"
        />
        <View style={styles.row}>
          <ActionButton
            title="Enter Screen"
            onPress={() => {
              Survicate.enterScreen(screenName);
              appendLog("→ enterScreen", { screenName });
            }}
            disabled={!sdkInitialized || !screenName}
          />
          <ActionButton
            title="Leave Screen"
            onPress={() => {
              Survicate.leaveScreen(screenName);
              appendLog("→ leaveScreen", { screenName });
            }}
            disabled={!sdkInitialized || !screenName}
          />
        </View>

        <Text style={styles.sectionTitle}>Response Attributes</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="name"
            value={attrName}
            onChangeText={setAttrName}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.inputFlex}
            placeholder="value"
            value={attrValue}
            onChangeText={setAttrValue}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.inputFlex}
            placeholder="provider"
            value={attrProvider}
            onChangeText={setAttrProvider}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <ActionButton
            title="Set"
            onPress={addResponseAttr}
            disabled={!sdkInitialized || !attrName}
          />
        </View>
        {responseAttrs.map((a) => (
          <View key={a.id} style={styles.listRow}>
            <Text style={styles.listRowText}>
              {a.name}: {a.value}
              {a.provider ? ` (${a.provider})` : ""}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.row}>
          <ActionButton
            title="Light"
            onPress={() => {
              Survicate.setThemeMode(ThemeMode.light);
              appendLog("→ setThemeMode", { themeMode: "light" });
            }}
            disabled={!sdkInitialized}
          />
          <ActionButton
            title="Dark"
            onPress={() => {
              Survicate.setThemeMode(ThemeMode.dark);
              appendLog("→ setThemeMode", { themeMode: "dark" });
            }}
            disabled={!sdkInitialized}
          />
          <ActionButton
            title="Auto"
            onPress={() => {
              Survicate.setThemeMode(ThemeMode.auto);
              appendLog("→ setThemeMode", { themeMode: "auto" });
            }}
            disabled={!sdkInitialized}
          />
        </View>

        <Text style={styles.sectionTitle}>Locale</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.inputFlex}
            placeholder="languageTag (e.g. en-US)"
            value={localeInput}
            onChangeText={setLocaleInput}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          <ActionButton
            title="Apply"
            onPress={() => {
              Survicate.setLocale(localeInput);
              appendLog("→ setLocale", { languageTag: localeInput });
            }}
            disabled={!sdkInitialized || !localeInput}
          />
        </View>

        <Pressable onPress={() => setLogVisible((v) => !v)}>
          <Text style={styles.sectionTitle}>
            {logVisible ? "▾" : "▸"} Event Log{log.length > 0 ? ` (${log.length})` : ""}
          </Text>
        </Pressable>
        {logVisible && (
          <>
            <ActionButton
              title="Clear log"
              onPress={() => {
                setLog([]);
                setExpandedIds(new Set());
              }}
              disabled={!sdkInitialized || log.length === 0}
            />
            {log.length === 0 ? (
              <Text style={styles.logEmpty}>No events yet.</Text>
            ) : (
              log.map((entry) => {
                const expanded = expandedIds.has(entry.id);
                return (
                  <Pressable
                    key={entry.id}
                    onPress={() => toggleExpanded(entry.id)}
                    style={styles.logEntry}
                  >
                    <Text style={styles.logHeader}>
                      {expanded ? "▾" : "▸"} {new Date(entry.ts).toLocaleTimeString()} · {entry.type}
                    </Text>
                    {expanded && (
                      <Text style={styles.logPayload}>
                        {JSON.stringify(entry.payload, null, 2)}
                      </Text>
                    )}
                  </Pressable>
                );
              })
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>Reset</Text>
        <ActionButton title="Reset" onPress={resetAll} disabled={!sdkInitialized} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollView: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16, color: "#000" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
    color: "#000",
  },
  inputFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  listRowText: { flex: 1, color: "#000" },
  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  buttonDisabled: { backgroundColor: "#d0d0d0" },
  buttonPressed: { backgroundColor: "#0063CC" },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  buttonTextDisabled: { color: "#888" },
  logEmpty: { fontStyle: "italic", color: "#999", marginVertical: 8 },
  logEntry: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logHeader: { fontWeight: "600", fontSize: 12, color: "#000" },
  logPayload: {
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "Courier",
    }),
    fontSize: 11,
    color: "#333",
  },
});

export default App;

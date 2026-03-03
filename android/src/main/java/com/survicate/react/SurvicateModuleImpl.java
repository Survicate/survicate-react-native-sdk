package com.survicate.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.survicate.surveys.ResponseAttribute;
import com.survicate.surveys.Survicate;
import com.survicate.surveys.ThemeMode;
import com.survicate.surveys.FontSource;
import com.survicate.surveys.SurvicateFontSystem;
import com.survicate.surveys.traits.UserTrait;

import com.survicate.react.SurvicateModule;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class SurvicateModuleImpl extends SurvicateModule {

    public static final String NAME = "SurvicateBindings";

    private final ReactApplicationContext reactContext;
    private final SurvicateRNEventListener eventListener;

    private int listenerCount = 0;
    private boolean isInitialized = false;

    public SurvicateModuleImpl(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.eventListener = new SurvicateRNEventListener(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void enterScreen(String screenName) {
        if (!isInitialized) {
            return;
        }
        Survicate.enterScreen(screenName);
    }

    @ReactMethod
    public void leaveScreen(String screenName) {
        if (!isInitialized) {
            return;
        }
        Survicate.leaveScreen(screenName);
    }

    @ReactMethod
    public void invokeEvent(String eventName, ReadableMap eventProperties) {
        if (!isInitialized) {
            return;
        }
        Map<String, String> properties = new HashMap<>();
        for (Map.Entry<String, Object> entry : eventProperties.toHashMap().entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue().toString();
            properties.put(key, value);
        }

        Survicate.invokeEvent(eventName, properties);
    }

    @ReactMethod
    public void setUserId(String userId) {
        if (!isInitialized) {
            return;
        }

        Survicate.setUserTrait(new UserTrait("user_id", userId));
    }

    @ReactMethod
    public void setUserTrait(String userTrait, String value) {
        if (!isInitialized) {
            return;
        }
        Survicate.setUserTrait(new UserTrait(userTrait, value));
    }

    @ReactMethod
    public void initializeSdk() {
        Survicate.init(reactContext);
        isInitialized = true;
    }

    @ReactMethod
    public void reset() {
        if (!isInitialized) {
            return;
        }
        Survicate.reset();
    }

    @ReactMethod
    public void setWorkspaceKey(String workspaceKey) {
        Survicate.setWorkspaceKey(workspaceKey);
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (!isInitialized) {
            return;
        }
        if (listenerCount == 0) {
            Survicate.addEventListener(eventListener);
        }

        listenerCount++;
    }

    @ReactMethod
    public void removeListeners(int count) {
        if (!isInitialized) {
            return;
        }
        listenerCount -= count;

        if (listenerCount == 0) {
            Survicate.removeEventListener(eventListener);
        }
    }

    @ReactMethod
    public void removeListeners(double count) {
        removeListeners((int) count);
    }

    @ReactMethod
    public void setLocale(String locale) {
        if (!isInitialized) {
            return;
        }
        Survicate.setLocale(locale);
    }

    @ReactMethod
    public void setResponseAttributes(ReadableArray attributes) {
        if (!isInitialized) {
            return;
        }
        List<ResponseAttribute> list = new ArrayList<>();
        for (int i = 0; i < attributes.size(); i++) {
            ReadableMap map = attributes.getMap(i);
            String name = map.getString("name");
            String value = map.getString("value");
            String provider = map.hasKey("provider") && !map.isNull("provider")
                ? map.getString("provider") : null;
            list.add(new ResponseAttribute(name, value, provider));
        }
        Survicate.setResponseAttributes(list);
    }

    @ReactMethod
    public void setFonts(ReadableMap fontSystem) {
        SurvicateFontSystem fonts = new SurvicateFontSystem(
            new FontSource.AssetPath(fontSystem.getString("regular")),
            new FontSource.AssetPath(fontSystem.getString("regularItalic")),
            new FontSource.AssetPath(fontSystem.getString("bold")),
            new FontSource.AssetPath(fontSystem.getString("boldItalic"))
        );
        Survicate.setFonts(fonts);
    }

    @ReactMethod
    public void setThemeMode(String themeMode) {
        if (!isInitialized) {
            return;
        }
        ThemeMode mode;
        switch (themeMode) {
            case "light":
                mode = ThemeMode.LIGHT;
                break;
            case "dark":
                mode = ThemeMode.DARK;
                break;
            default:
                mode = ThemeMode.AUTO;
                break;
        }
        Survicate.setThemeMode(mode);
    }
}

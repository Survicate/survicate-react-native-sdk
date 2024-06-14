package com.survicate.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.survicate.surveys.Survicate;
import com.survicate.surveys.traits.UserTrait;

import com.survicate.react.SurvicateModule;

import java.util.Map;
import java.util.HashMap;

public class SurvicateModuleImpl extends SurvicateModule {

    public static final String NAME = "SurvicateBindings";

    private final ReactApplicationContext reactContext;
    private final SurvicateRNEventListener eventListener;

    private int listenerCount = 0;

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
        Survicate.enterScreen(screenName);
    }

    @ReactMethod
    public void leaveScreen(String screenName) {
        Survicate.leaveScreen(screenName);
    }

    @ReactMethod
    public void invokeEvent(String eventName, ReadableMap eventProperties) {
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
        Survicate.setUserTrait(new UserTrait.UserId(userId));
    }

    @ReactMethod
    public void setUserTrait(String userTrait, String value) {
        Survicate.setUserTrait(new UserTrait(userTrait, value));
    }

    @ReactMethod
    public void initializeSdk() {
        Survicate.init(reactContext);
    }

    @ReactMethod
    public void reset() {
        Survicate.reset();
    }

    @ReactMethod
    public void setWorkspaceKey(String workspaceKey) {
        Survicate.setWorkspaceKey(workspaceKey);
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount == 0) {
            Survicate.addEventListener(eventListener);
        }

        listenerCount++;
    }

    @ReactMethod
    public void removeListeners(int count) {
        listenerCount -= count;

        if (listenerCount == 0) {
            Survicate.removeEventListener(eventListener);
        }
    }

    @ReactMethod
    public void removeListeners(double count) {
        removeListeners((int) count);
    }
}

package com.survicate.react;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class SurvicateModule extends ReactContextBaseJavaModule {

    public SurvicateModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public abstract void enterScreen(String screenName);
    public abstract void leaveScreen(String screenName);
    public abstract void invokeEvent(String eventName);
    public abstract void setUserId(String userId);
    public abstract void setUserTrait(String userTrait, String value);
    public abstract void initialize();
    public abstract void initializeSdk();
    public abstract void reset();
    public abstract void setWorkspaceKey(String workspaceKey);
}

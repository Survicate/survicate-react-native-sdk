package com.survicate.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.survicate.surveys.Survicate;
import com.survicate.surveys.traits.UserTrait;

import com.survicate.react.SurvicateModule;

public class SurvicateModuleImpl extends SurvicateModule {

    public static final String NAME = "SurvicateBindings";

    private final ReactApplicationContext reactContext;

    public SurvicateModuleImpl(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
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
    public void invokeEvent(String eventName) {
        Survicate.invokeEvent(eventName);
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
    public void initialize() {
        Survicate.init(reactContext);
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
}

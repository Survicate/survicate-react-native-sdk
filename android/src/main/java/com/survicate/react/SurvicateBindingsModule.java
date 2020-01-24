package com.survicate.react;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.survicate.surveys.Survicate;
import com.survicate.surveys.traits.UserTrait;

public class SurvicateBindingsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public SurvicateBindingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SurvicateBindings";
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
    public void reset() {
        Survicate.reset();
    }
}

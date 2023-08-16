package com.survicate.react;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.survicate.surveys.Survicate;
import com.survicate.surveys.SurvicateAnswer;
import com.survicate.surveys.SurvicateEventListener;
import com.survicate.surveys.traits.UserTrait;

public class SurvicateBindingsModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private int listenerCount = 0;

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

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

    @ReactMethod
    public void setWorkspaceKey(String workspaceKey) {
        Survicate.setWorkspaceKey(workspaceKey);
    }

    @ReactMethod
    public void addListener(String eventName) {
        if (listenerCount > 0) {
            return;
        }

        listenerCount += 1;

        Survicate.setEventListener(new SurvicateEventListener() {
            @Override
            public void onSurveyDisplayed(@NonNull String surveyId) {
                WritableMap params = Arguments.createMap();

                params.putString("surveyId", surveyId);

                sendEvent(reactContext, "onSurveyDisplayed", params);
            }

            @Override
            public void onQuestionAnswered(@NonNull String surveyId, long questionId, @NonNull SurvicateAnswer answer) {
                WritableMap params = Arguments.createMap();

                params.putString("surveyId", surveyId);
                params.putDouble("questionId", questionId);
                params.putString("type", answer.getType());

                if (answer.getId() != null) {
                    params.putDouble("id", answer.getId());
                }

                if (answer.getIds() != null) {
                    WritableArray ids = Arguments.createArray();
                    for(long id: answer.getIds()) {
                        ids.pushDouble(id);
                    }
                    params.putArray("ids", ids);
                }

                if (answer.getValue() != null) {
                    params.putString("value", answer.getValue());
                }

                sendEvent(reactContext, "onQuestionAnswered", params);
            }

            @Override
            public void onSurveyClosed(@NonNull String surveyId) {
                WritableMap params = Arguments.createMap();

                params.putString("surveyId", surveyId);

                sendEvent(reactContext, "onSurveyClosed", params);
            }

            @Override
            public void onSurveyCompleted(@NonNull String surveyId) {
                WritableMap params = Arguments.createMap();

                params.putString("surveyId", surveyId);

                sendEvent(reactContext, "onSurveyCompleted", params);
            }
        });
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        if (listenerCount <= 0) {
            return;
        }

        listenerCount -= count;

        // TODO: We should remove the listeners here but the Android SDK doesn't support this
    }
}

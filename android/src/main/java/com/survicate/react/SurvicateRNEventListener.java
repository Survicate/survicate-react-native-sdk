package com.survicate.react;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.survicate.surveys.SurvicateAnswer;
import com.survicate.surveys.SurvicateEventListener;

import javax.annotation.Nullable;

class SurvicateRNEventListener extends SurvicateEventListener {

    private static final String SURVEY_ID = "surveyId";
    private static final String QUESTION_ID = "questionId";
    private static final String ANSWER_TYPE = "answerType";
    private static final String ANSWER_ID = "answerId";
    private static final String ANSWER_IDS = "answerIds";
    private static final String ANSWER_VALUE = "answerValue";

    private ReactApplicationContext reactContext;

    public SurvicateRNEventListener(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onSurveyDisplayed(@NonNull String surveyId) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, surveyId);
        sendEvent(reactContext, "onSurveyDisplayed", params);
    }

    @Override
    public void onQuestionAnswered(@NonNull String surveyId, long questionId, @NonNull SurvicateAnswer answer) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, surveyId);
        params.putDouble(QUESTION_ID, questionId);

        if (answer.getType() != null) {
            params.putString(ANSWER_TYPE, answer.getType());
        } else {
            params.putNull(ANSWER_TYPE);
        }

        if (answer.getId() != null) {
            params.putDouble(ANSWER_ID, answer.getId());
        } else {
            params.putNull(ANSWER_ID);
        }

        if (answer.getIds() != null) {
            WritableArray ids = Arguments.createArray();
            for (long id : answer.getIds()) {
                ids.pushDouble(id);
            }
            params.putArray(ANSWER_IDS, ids);
        } else {
            params.putArray(ANSWER_IDS, Arguments.createArray());
        }

        if (answer.getValue() != null) {
            params.putString(ANSWER_VALUE, answer.getValue());
        } else {
            params.putNull(ANSWER_VALUE);
        }

        sendEvent(reactContext, "onQuestionAnswered", params);
    }

    @Override
    public void onSurveyClosed(@NonNull String surveyId) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, surveyId);
        sendEvent(reactContext, "onSurveyClosed", params);
    }

    @Override
    public void onSurveyCompleted(@NonNull String surveyId) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, surveyId);
        sendEvent(reactContext, "onSurveyCompleted", params);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

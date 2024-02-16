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
import com.survicate.surveys.SurveyDisplayedEvent;
import com.survicate.surveys.QuestionAnsweredEvent;
import com.survicate.surveys.SurveyClosedEvent;
import com.survicate.surveys.SurveyCompletedEvent;

import javax.annotation.Nullable;

class SurvicateRNEventListener extends SurvicateEventListener {

    private static final String SURVEY_ID = "surveyId";
    private static final String SURVEY_NAME = "surveyName";
    private static final String RESPONSE_UUID = "responseUuid";
    private static final String VISITOR_UUID = "visitorUuid";
    private static final String QUESTION_ID = "questionId";
    private static final String QUESTION = "question";
    private static final String ANSWER_TYPE = "answerType";
    private static final String ANSWER_ID = "answerId";
    private static final String ANSWER_IDS = "answerIds";
    private static final String ANSWER_VALUE = "answerValue";
    private static final String PANEL_ANSWER_URL = "panelAnswerUrl";

    private ReactApplicationContext reactContext;

    public SurvicateRNEventListener(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onSurveyDisplayed(@NonNull SurveyDisplayedEvent event) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, event.getSurveyId());
        sendEvent(reactContext, "onSurveyDisplayed", params);
    }

    @Override
    public void onQuestionAnswered(@NonNull QuestionAnsweredEvent event) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, event.getSurveyId());
        params.putString(SURVEY_NAME, event.getSurveyName());
        params.putString(RESPONSE_UUID, event.getResponseUuid());
        params.putString(VISITOR_UUID, event.getVisitorUuid());
        params.putString(PANEL_ANSWER_URL, event.getPanelAnswerUrl());
        params.putDouble(QUESTION_ID, event.getQuestionId());
        params.putString(QUESTION, event.getQuestionText());

        if (event.getAnswer().getType() != null) {
            params.putString(ANSWER_TYPE, event.getAnswer().getType());
        } else {
            params.putNull(ANSWER_TYPE);
        }

        if (event.getAnswer().getId() != null) {
            params.putDouble(ANSWER_ID, event.getAnswer().getId());
        } else {
            params.putNull(ANSWER_ID);
        }

        if (event.getAnswer().getIds() != null) {
            WritableArray ids = Arguments.createArray();
            for (long id : event.getAnswer().getIds()) {
                ids.pushDouble(id);
            }
            params.putArray(ANSWER_IDS, ids);
        } else {
            params.putArray(ANSWER_IDS, Arguments.createArray());
        }

        if (event.getAnswer().getValue() != null) {
            params.putString(ANSWER_VALUE, event.getAnswer().getValue());
        } else {
            params.putNull(ANSWER_VALUE);
        }

        sendEvent(reactContext, "onQuestionAnswered", params);
    }

    @Override
    public void onSurveyClosed(@NonNull SurveyClosedEvent event) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, event.getSurveyId());
        sendEvent(reactContext, "onSurveyClosed", params);
    }

    @Override
    public void onSurveyCompleted(@NonNull SurveyCompletedEvent event) {
        WritableMap params = Arguments.createMap();
        params.putString(SURVEY_ID, event.getSurveyId());
        sendEvent(reactContext, "onSurveyCompleted", params);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}

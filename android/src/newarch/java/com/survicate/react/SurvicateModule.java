package com.survicate.react;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;

public abstract class SurvicateModule extends NativeSurvicateModuleSpec {
    public SurvicateModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }
}

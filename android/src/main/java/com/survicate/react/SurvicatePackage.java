package com.survicate.react;

import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import com.survicate.react.SurvicateModule;
import java.util.HashMap;
import java.util.Map;

public class SurvicatePackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(String name, ReactApplicationContext reactApplicationContext) {
        if (SurvicateModuleImpl.NAME.equals(name)) {
            return new SurvicateModuleImpl(reactApplicationContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            moduleInfos.put(
                    SurvicateModuleImpl.NAME,
                    new ReactModuleInfo(
                            SurvicateModuleImpl.NAME,
                            SurvicateModuleImpl.NAME,
                            false, // canOverrideExistingModule
                            false, // needsEagerInit
                            true, // hasConstants
                            false, // isCxxModule
                            isTurboModule // isTurboModule
                    ));
            return moduleInfos;
        };
    }
}

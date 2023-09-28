#import "SurvicateBindings.h"
#import <Survicate/Survicate-Swift.h>

@implementation SurvicateBindings

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(enterScreen:(NSString *)screenName)
{
    [[SurvicateSdk shared] enterScreenWithValue:screenName];
}

RCT_EXPORT_METHOD(leaveScreen:(NSString *)screenName)
{
    [[SurvicateSdk shared] leaveScreenWithValue:screenName];
}

RCT_EXPORT_METHOD(invokeEvent:(NSString *)eventName)
{
    [[SurvicateSdk shared] invokeEventWithName:eventName];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [[SurvicateSdk shared] setUserTraitWithName:@"user_id" value:userId];
}

RCT_EXPORT_METHOD(setUserTrait:(NSString *)traitName traitValue:(NSString *)traitValue)
{
    [[SurvicateSdk shared] setUserTraitWithName:traitName value:traitValue];
}

RCT_EXPORT_METHOD(initialize)
{
    [[SurvicateSdk shared] initialize];
}

RCT_EXPORT_METHOD(initializeSdk)
{
    [[SurvicateSdk shared] initialize];
}

RCT_EXPORT_METHOD(reset)
{
    [[SurvicateSdk shared] reset];
}

RCT_EXPORT_METHOD(setWorkspaceKey:(NSString *)workspaceKey)
{
    NSError *error;
    [[SurvicateSdk shared] setWorkspaceKey:workspaceKey error: &error];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSurvicateModuleSpecJSI>(params);
}
#endif

@end

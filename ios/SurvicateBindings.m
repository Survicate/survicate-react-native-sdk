#import "SurvicateBindings.h"
@import Survicate;

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

RCT_EXPORT_METHOD(setUserTrait:(NSString *)traitName value:(NSString *)value)
{
    [[SurvicateSdk shared] setUserTraitWithName:traitName value:value];
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

@end

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
    [[Survicate shared] enterScreenWithValue:screenName];
}

RCT_EXPORT_METHOD(leaveScreen:(NSString *)screenName)
{
    [[Survicate shared] leaveScreenWithValue:screenName];
}

RCT_EXPORT_METHOD(invokeEvent:(NSString *)eventName)
{
    [[Survicate shared] invokeEventWithName:eventName];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [[Survicate shared] setUserTraitWithName:@"user_id" value:userId];
}

RCT_EXPORT_METHOD(setUserTrait:(NSString *)traitName value:(NSString *)value)
{
    [[Survicate shared] setUserTraitWithName:traitName value:value];
}

RCT_EXPORT_METHOD(initialize)
{
    [[Survicate shared] initialize];
}

RCT_EXPORT_METHOD(reset)
{
    [[Survicate shared] reset];
}

@end

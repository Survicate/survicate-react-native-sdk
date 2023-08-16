#import "SurvicateBindings.h"

@import Survicate;

@implementation SurvicateBindings
{
  bool hasListeners;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSArray<NSString*> *)supportedEvents {
    return @[@"onQuestionAnswered", @"onSurveyClosed", @"onSurveyCompleted", @"onSurveyDisplayed"];
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

- (void)questionAnsweredWithSurveyId:(NSString * _Nonnull)surveyId questionId:(NSInteger)questionId answer:(SurvicateAnswer * _Nonnull)answer {
    if (hasListeners) {
        [self sendEventWithName:@"onQuestionAnswered" body:@{@"surveyId": surveyId}];
    }
}

- (void)surveyClosedWithSurveyId:(NSString * _Nonnull)surveyId {
    if (hasListeners) {
        [self sendEventWithName:@"onSurveyClosed" body:@{@"surveyId": surveyId}];
    }
}

- (void)surveyCompletedWithSurveyId:(NSString * _Nonnull)surveyId {
    if (hasListeners) {
        [self sendEventWithName:@"onSurveyCompleted" body:@{@"surveyId": surveyId}];
    }
}

- (void)surveyDisplayedWithSurveyId:(NSString * _Nonnull)surveyId {
    if (hasListeners) {
        [self sendEventWithName:@"onSurveyDisplayed" body:@{@"surveyId": surveyId}];
    }
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
    [[SurvicateSdk shared] setDelegate:self];
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

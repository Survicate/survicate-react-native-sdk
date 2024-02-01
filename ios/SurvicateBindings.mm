#import "SurvicateBindings.h"
#import <Survicate/Survicate-Swift.h>

@implementation SurvicateBindings
{
    bool hasListeners;
}

- (NSArray<NSString*> *)supportedEvents {
    return @[@"onQuestionAnswered", @"onSurveyClosed", @"onSurveyCompleted", @"onSurveyDisplayed"];
}

- (void)startObserving {
    hasListeners = YES;
    [[SurvicateSdk shared] setDelegate:self];
}

- (void)stopObserving {
    hasListeners = NO;
    [[SurvicateSdk shared] setDelegate:nil];
}

- (void)questionAnsweredWithSurveyId:(NSString * _Nonnull)surveyId questionId:(NSInteger)questionId answer:(SurvicateAnswer * _Nonnull)answer {
    if (hasListeners) {
        [self sendEventWithName:@"onQuestionAnswered" body:
         @{@"surveyId": surveyId,
           @"questionId": @(questionId),
           @"answerValue": answer.value ?: [NSNull null],
           @"answerId": answer.id ?: [NSNull null],
           @"answerType": answer.type ?: [NSNull null],
           @"answerIds": answer.ids ?: @[]}];
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

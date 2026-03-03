#import "SurvicateBindings.h"
#import <Survicate/Survicate-Swift.h>
#import <CoreText/CoreText.h>

static NSString* postScriptNameForPath(NSString *relativePath)
{
    // Build absolute path to the font file inside the app bundle
    NSString *fullPath = [[NSBundle mainBundle].bundlePath
        stringByAppendingPathComponent:[relativePath lastPathComponent]];

    NSURL *fontURL = [NSURL fileURLWithPath:fullPath];

    // Read font descriptors from the file to extract metadata
    CFArrayRef descriptors = CTFontManagerCreateFontDescriptorsFromURL((__bridge CFURLRef)fontURL);
    if (!descriptors || CFArrayGetCount(descriptors) == 0) {
        if (descriptors) CFRelease(descriptors);
        return @"";
    }

    // Extract the PostScript name from the first font face in the file
    CTFontDescriptorRef descriptor = (CTFontDescriptorRef)CFArrayGetValueAtIndex(descriptors, 0);
    NSString *postScriptName = (__bridge_transfer NSString *)
        CTFontDescriptorCopyAttribute(descriptor, kCTFontNameAttribute);
    CFRelease(descriptors);
    
    return postScriptName ?: @"";
}

@implementation SurvicateBindings
{
    bool hasListeners;
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

RCT_EXPORT_METHOD(invokeEvent:(NSString *)eventName eventProperties:(NSDictionary *) eventProperties)
{
    [[SurvicateSdk shared] invokeEventWithName:eventName with:eventProperties];
}

RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [[SurvicateSdk shared] setUserTraitWithName:@"user_id" value:userId];
}

RCT_EXPORT_METHOD(setUserTrait:(NSString *)traitName traitValue:(NSString *)traitValue)
{
    [[SurvicateSdk shared] setUserTraitWithName:traitName value:traitValue];
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

RCT_EXPORT_METHOD(setLocale:(NSString *)locale)
{
    [[SurvicateSdk shared] setLocale:locale];
}

RCT_EXPORT_METHOD(setResponseAttributes:(NSArray *)attributes)
{
    NSMutableArray<ResponseAttribute *> *list = [NSMutableArray array];
    for (NSDictionary *dict in attributes) {
        NSString *name = dict[@"name"];
        NSString *value = dict[@"value"];
        NSString *provider = dict[@"provider"] == [NSNull null] ? nil : dict[@"provider"];
        ResponseAttribute *attr = [[ResponseAttribute alloc] initWithName:name value:value provider:provider];
        [list addObject:attr];
    }
    [[SurvicateSdk shared] setResponseAttributes:list];
}

RCT_EXPORT_METHOD(setThemeMode:(NSString *)themeMode)
{
    ThemeMode mode = ThemeModeAuto;
    if ([themeMode isEqualToString:@"light"]) {
        mode = ThemeModeLight;
    } else if ([themeMode isEqualToString:@"dark"]) {
        mode = ThemeModeDark;
    }
    [[SurvicateSdk shared] setThemeMode:mode];
}

RCT_EXPORT_METHOD(setFonts:(NSDictionary *)fontSystem)
{
    SurvicateFontSystem *fonts = [[SurvicateFontSystem alloc]
        initWithRegular:postScriptNameForPath(fontSystem[@"regular"])
        regularItalic:postScriptNameForPath(fontSystem[@"regularItalic"])
        bold:postScriptNameForPath(fontSystem[@"bold"])
        boldItalic:postScriptNameForPath(fontSystem[@"boldItalic"])];
    [[SurvicateSdk shared] setFonts:fonts];
}

- (NSArray<NSString*> *)supportedEvents {
    return @[@"onQuestionAnswered", @"onSurveyClosed", @"onSurveyCompleted", @"onSurveyDisplayed"];
}

- (void)startObserving {
    hasListeners = YES;
    [[SurvicateSdk shared] addListener:self];
}

- (void)stopObserving {
    hasListeners = NO;
    [[SurvicateSdk shared] removeListener:self];
}

- (void)surveyDisplayedWithEvent:(SurveyDisplayedEvent * _Nonnull)event {
    if (!hasListeners) return;
    [self sendEventWithName:@"onSurveyDisplayed" body:@{@"surveyId": event.surveyId}];
}

- (void)questionAnswered:(QuestionAnsweredEvent * _Nonnull)event {
    if (!hasListeners) return;
    [self sendEventWithName:@"onQuestionAnswered" body:
         @{@"surveyId": event.surveyId,
           @"surveyName": event.surveyName,
           @"visitorUuid": event.visitorUUID,
           @"responseUuid": event.responseUUID,
           @"questionId": @(event.questionID),
           @"question": event.question,
           @"answerValue": event.answer.value ?: [NSNull null],
           @"answerId": event.answer.id ?: [NSNull null],
           @"answerType": event.answer.type ?: [NSNull null],
           @"answerIds": event.answer.ids ?: @[],
           @"panelAnswerUrl": event.panelAnswerUrl,
         }
    ];
}

- (void)surveyCompletedWithEvent:(SurveyCompletedEvent * _Nonnull)event {
    if (!hasListeners) return;
    [self sendEventWithName:@"onSurveyCompleted" body:@{@"surveyId": event.surveyId}];
}

- (void)surveyClosedWithEvent:(SurveyClosedEvent * _Nonnull)event {
    if (!hasListeners) return;
    [self sendEventWithName:@"onSurveyClosed" body:@{@"surveyId": event.surveyId}];
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

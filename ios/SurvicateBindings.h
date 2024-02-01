#import <Survicate/Survicate-Swift.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSurvicateSpec.h"

@interface SurvicateBindings : RCTEventEmitter<NativeSurvicateModuleSpec, SurvicateDelegate>
#else
#import <React/RCTBridgeModule.h>

@interface SurvicateBindings : RCTEventEmitter<RCTBridgeModule, SurvicateDelegate>
#endif

@end

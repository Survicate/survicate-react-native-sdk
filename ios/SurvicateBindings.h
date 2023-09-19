#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSurvicateSpec.h"

@interface SurvicateBindings : NSObject <NativeSurvicateModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface SurvicateBindings : NSObject <RCTBridgeModule>
#endif

@end

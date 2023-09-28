import { NativeModules } from 'react-native';

const { SurvicateBindings } = NativeModules;
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const survicate = isTurboModuleEnabled ?
require("./NativeSurvicateModule").default :
SurvicateBindings;

export default survicate;

import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";
import { SurvicatePluginProps } from "./types";
import { withSurvicateAndroidManifest, withSurvicateAndroidMavenRepository } from "./withSurvicateAndroid";
import { withSurvicateIosInfoPlist } from "./withSurvicateiOS";

const withSurvicateReactNative: ConfigPlugin<SurvicatePluginProps> = (
  config,
  props
) => {
  let newConfig = config;
  newConfig = withSurvicateAndroidManifest(newConfig, props);
  newConfig = withSurvicateAndroidMavenRepository(newConfig);
  newConfig = withSurvicateIosInfoPlist(newConfig, props);
  return newConfig;
};

const configPlugin = (pkg: { name: string; version: string }) =>
  createRunOncePlugin(withSurvicateReactNative, pkg.name, pkg.version);

export default configPlugin;

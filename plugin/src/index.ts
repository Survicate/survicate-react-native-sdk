import { ConfigPlugin } from "@expo/config-plugins";
import { ConfigProps } from "./types";
import { withReactNativeSurvicateAndroid } from "./withSurvicateAndroid";
import { withReactNativeSurvicateiOS } from "./withSurvicateiOS";

const withReactNativeSurvicate: ConfigPlugin<ConfigProps> = (
  config,
  _props
) => {
  const props = _props || { workspaceKey: "" };

  config = withReactNativeSurvicateAndroid(config, props);
  config = withReactNativeSurvicateiOS(config, props);

  return config;
};

export default withReactNativeSurvicate;

import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { ConfigProps } from "./types";

export const withReactNativeSurvicateiOS: ConfigPlugin<ConfigProps> = (
  expoConfig,
  { workspaceKey = "YOUR_WORKSPACE_KEY" } = {}
) => {
  return withInfoPlist(expoConfig, (config) => {
    config.modResults.Survicate = {
      WorkspaceKey: workspaceKey,
    };
    return config;
  });
};

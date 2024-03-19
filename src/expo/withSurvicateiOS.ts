import { ConfigPlugin, withInfoPlist } from 'expo/config-plugins';
import {SurvicatePluginProps} from './types';

export const withSurvicateIosInfoPlist: ConfigPlugin<SurvicatePluginProps> = (config, props: SurvicatePluginProps) => {
    return withInfoPlist(config, (config) => {
        config.modResults.Survicate = {
          WorkspaceKey: props.workspaceKey,
        };
        return config;
    });
};

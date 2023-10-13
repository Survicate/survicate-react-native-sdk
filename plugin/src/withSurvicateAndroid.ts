import {
  ConfigPlugin,
  withAndroidManifest,
  AndroidConfig,
  withProjectBuildGradle,
} from "@expo/config-plugins";
import {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
} from "@expo/config-plugins/build/android/Manifest";
import { ConfigProps } from "./types";
import {
  MergeResults,
  createGeneratedHeaderComment,
  removeGeneratedContents,
} from "@expo/config-plugins/build/utils/generateCode";

const GRADLE_APPEND_ID = "react-native-survicate";
const BUILDSCRIPT_LEVEL_GRADLE = `allprojects { repositories { maven { url 'https://repo.survicate.com' } } }`;

async function setCustomConfigAsync(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  workspaceKey: string
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  const appId = "com.survicate.surveys.workspaceKey";
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(mainApplication, appId, workspaceKey);

  return androidManifest;
}

// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
function appendContents({
  src,
  newSrc,
  tag,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  comment: string;
}): MergeResults {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);
  if (!src.includes(header)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    const contentsToAdd = [
      header,
      newSrc,
      `${comment} @generated end ${tag}`,
    ].join("\n");

    return {
      contents: sanitizedTarget ?? src + contentsToAdd,
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

export const withReactNativeSurvicateAndroid: ConfigPlugin<ConfigProps> = (
  expoConfig,
  { workspaceKey = "YOUR_WORKSPACE_KEY" } = {}
) => {
  withProjectBuildGradle(expoConfig, async (config) => {
    config.modResults.contents = await appendContents({
      tag: GRADLE_APPEND_ID,
      src: config.modResults.contents,
      newSrc: BUILDSCRIPT_LEVEL_GRADLE,
      comment: "//",
    }).contents;
    return config;
  });

  return withAndroidManifest(expoConfig, async (config) => {
    config.modResults = await setCustomConfigAsync(
      config.modResults,
      workspaceKey
    );
    return config;
  });
};

import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withProjectBuildGradle,
} from "expo/config-plugins";
import { ExpoConfig } from "expo/config";
import { SurvicatePluginProps } from "./types";
import {
  MergeResults,
  createGeneratedHeaderComment,
  removeGeneratedContents,
} from "@expo/config-plugins/build/utils/generateCode";

// Using helpers keeps error messages unified and helps cut down on XML format changes.
const { addMetaDataItemToMainApplication, getMainApplicationOrThrow } =
  AndroidConfig.Manifest;

export const withSurvicateAndroidManifest: ConfigPlugin<
  SurvicatePluginProps
> = (config: ExpoConfig, props: SurvicatePluginProps) => {
  return withAndroidManifest(config, async (config) => {
    // Modifiers can be async, but try to keep them fast.
    config.modResults = await setCustomConfigAsync(
      config.modResults,
      props.workspaceKey
    );
    return config;
  });
};

async function setCustomConfigAsync(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  workspaceKey: string
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  // Get the <application /> tag and assert if it doesn't exist.
  const mainApplication = getMainApplicationOrThrow(androidManifest);

  addMetaDataItemToMainApplication(
    mainApplication,
    // value for `android:name`
    "com.survicate.surveys.workspaceKey",
    // value for `android:value`
    workspaceKey
  );

  return androidManifest;
}

export const withSurvicateAndroidMavenRepository: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, async (config) => {
    if (config.modResults.language !== "groovy") {
      console.warn(
        "Unsupported language for build.gradle. Only 'groovy' is supported."
      );
      return config;
    }

    config.modResults.contents = await appendContents({
      src: config.modResults.contents,
      newSrc: `allprojects { repositories { maven { url 'https://repo.survicate.com' } } }`,
      tag: "@survicate/react-native-survicate",
      comment: "//",
    }).contents;
    return config;
  });
};

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
      // @something
      header,
      // contents
      newSrc,
      // @end
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

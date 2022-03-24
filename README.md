# @survicate/react-native-survicate [![npm version](https://badge.fury.io/js/%40survicate%2Freact-native-survicate.svg)](https://badge.fury.io/js/%40survicate%2Freact-native-survicate)

## Requirements:
- iOS at least on version 10.0
- Android at least on version 4.4
- React Native at least on version 0.59.10

## Getting started

`$ npm install @survicate/react-native-survicate --save`

### Mostly automatic installation

`$ react-native link @survicate/react-native-survicate`

### Configuring Survicate Bindings for iOS
- Add your Survicate workspace key to `Info.plist`
```
	<key>Survicate</key>
	<dict>
		<key>WorkspaceKey</key>
		<string>YOUR_WORKSPACE_KEY</string>
	</dict>
```
- run command `pod install` in your `ios` directory

### Configuring Survicate Bindings for Android

- Add maven repository to your project `build.gradle` located under `android` directory
```
allprojects {
    repositories {
        // ...
        maven { url 'https://repo.survicate.com' }
    }
}
```
- Add your Survicate workspace key to `AndroidManifest.xml`
```java
<application
    android:name=".MyApp"
>
    <!-- ... -->
    <meta-data android:name="com.survicate.surveys.workspaceKey" android:value="YOUR_WORKSPACE_KEY"/>
</application>
```

## Usage
```javascript
import Survicate from '@survicate/react-native-survicate';

Survicate.initialize();
Survicate.invokeEvent("eventName");
Survicate.enterScreen("screenName");
Survicate.leaveScreen("screenName");
Survicate.setUserId("screenName");
Survicate.setUserTrait("traitName", "traitValue");
Survicate.reset();
```

## Changelog

Changes specific for React Native bindings can be find below. For changes concerning native version of the Survicate SDK please refer to the [changelog](https://developers.survicate.com/mobile-sdk/changelog/)

- **1.1.6** Bumping up references: Android to 1.5.12 and iOS to 1.6.7 + clean up build.gradle file for `maven-publish`.
- **1.1.5** Bumping up references: Android to 1.5.9 and iOS to 1.6.5 + use maven-publish to support React Native 0.67.1
- **1.1.4** Bumping up references: Android to 1.5.6
- **1.1.3** Bumping up references: Android to 1.5.5
- **1.1.2** Bumping up references: Android to 1.5.2 and iOS to 1.6.1
- **1.1.2** Bumping up references: Android to 1.5.2 and iOS to 1.6.1
- **1.1.1** Bumping up references: Android to 1.4.5 and iOS to 1.5.8
- **1.1.0** Bumping up references: Android to 1.3.0 and iOS to 1.5.5 + iOS SDK distributed as xcframework
- **1.0.5** Bumping up references: Android to 1.2.6
- **1.0.4** version deprecated, please don't use it
- **1.0.3** Bumping up references: Android to 1.2.4 and iOS to 1.4.3
- **1.0.2** Bumping up references: Android to 1.2.0 and iOS to 1.4.0
- **1.0.1** Bumping up references: Android to 1.1.2
- **1.0.0** Initial version of the SDK, with references to the native Survicate SDKs as follows: Android - 1.0.19 and iOS to 1.3.0
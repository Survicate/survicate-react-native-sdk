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

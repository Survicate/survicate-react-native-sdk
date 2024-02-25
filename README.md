# @survicate/react-native-survicate [![npm version](https://badge.fury.io/js/%40survicate%2Freact-native-survicate.svg)](https://badge.fury.io/js/%40survicate%2Freact-native-survicate)

## Requirements:
- iOS at least on version 12.0
- Android at least on version 5
- React Native at least on version 0.60.0

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
import Survicate, {UserTrait} from '@survicate/react-native-survicate';

Survicate.initializeSdk();
Survicate.invokeEvent("eventName");
Survicate.enterScreen("screenName");
Survicate.leaveScreen("screenName");
const userIdTrait = new UserTrait('user_id', 'id');
Survicate.setUserTrait(userIdTrait);
const textTrait = new UserTrait('name', 'John');
const numberTrait = new UserTrait('age', 25);
const booleanTrait = new UserTrait('isPremium', true);
const dateTrait = new UserTrait('lastLogin', new Date());
const timeIntervalTrait = new UserTrait('timeOfPurchase', new Date());
const listener: SurvicateEventListener = {
    onSurveyDisplayed(event: SurveyDisplayedEvent) {},
    onQuestionAnswered(event: QuestionAnsweredEvent) {},
    onSurveyClosed(event: SurveyClosedEvent) {},
    onSurveyCompleted(event: SurveyCompletedEvent) {},
}
const removeListnerFunc = Survicate.addSurvicateEventListener(listener);
Survicate.reset();
```

## Changelog

The Survicate Mobile SDK change log can be found [here](https://developers.survicate.com/mobile-sdk/react-native/#changelog)

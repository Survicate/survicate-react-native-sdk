# @survicate/react-native-survicate ![npm version](https://img.shields.io/npm/v/%40survicate%2Freact-native-survicate)

Integrate Survicate into your React Native application to collect user feedback seamlessly.

## Requirements:
- iOS at least on version 14.0
- Android at least on version 5
- React Native at least on version 0.60.0

## Installation
This package can be installed using npm or yarn. If you're using Expo, follow the Expo-specific instructions.

### Using npm
```sh
npm install @survicate/react-native-survicate --save
```

### Using yarn
```sh
yarn add @survicate/react-native-survicate
```

### Using expo
> Please note that due to custom native code in this package "Expo Go" is not available.

To use @survicate/react-native-survicate in an Expo managed project use npm, yarn or expo-cli.
```sh
expo install @survicate/react-native-survicate
```

## Configuration

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

### Configuring Survicate Bindings for Expo
- Add [config plugin](https://docs.expo.dev/config-plugins/introduction/) to `plugins` array of your `app.json` or `app.config.js`
```json
{
  "expo": {
    "plugins": [
      [
        "@survicate/react-native-survicate",
        {
          "workspaceKey": "YOUR_WORKSPACE_KEY"
        }
      ]
    ]
  }
}
```
> Please note that every time you change the props or plugins, you'll need to [rebuild](https://docs.expo.dev/workflow/customizing/) the native app.


## Usage
```javascript
import Survicate, {
  UserTrait,
  ThemeMode,
  ResponseAttribute,
  SurvicateFontSystem,
  SurvicateEventListener,
  SurveyDisplayedEvent,
  QuestionAnsweredEvent,
  SurveyClosedEvent,
  SurveyCompletedEvent,
} from '@survicate/react-native-survicate';

// Initialization
Survicate.setWorkspaceKey('WORKSPACE_KEY');
Survicate.initializeSdk();

// Events
Survicate.invokeEvent("eventName");
Survicate.invokeEvent("eventName", { property1: "value1", property2: "value2" });

// Screens
Survicate.enterScreen("screenName");
Survicate.leaveScreen("screenName");

// User traits
Survicate.setUserTrait(new UserTrait('user_id', 'id'));
Survicate.setUserTrait(new UserTrait('name', 'John'));
Survicate.setUserTrait(new UserTrait('age', 25));
Survicate.setUserTrait(new UserTrait('isPremium', true));
Survicate.setUserTrait(new UserTrait('lastLogin', new Date()));

// Locale
Survicate.setLocale('en-US');

// Theme
Survicate.setThemeMode(ThemeMode.auto); // ThemeMode.auto | ThemeMode.light | ThemeMode.dark

// Custom Fonts
Survicate.setFonts({
  regular: 'fonts/MyFont-Regular.ttf',
  regularItalic: 'fonts/MyFont-RegularItalic.ttf',
  bold: 'fonts/MyFont-Bold.ttf',
  boldItalic: 'fonts/MyFont-BoldItalic.ttf',
});

// Response attributes
Survicate.setResponseAttribute(new ResponseAttribute('plan', 'premium'));
Survicate.setResponseAttributes([
  new ResponseAttribute('plan', 'premium'),
  new ResponseAttribute('seats', 10),
  new ResponseAttribute('isEnterprise', true),
  new ResponseAttribute('renewalDate', new Date()),
]);

// Event listeners
const listener: SurvicateEventListener = {
  onSurveyDisplayed(event: SurveyDisplayedEvent) {},
  onQuestionAnswered(event: QuestionAnsweredEvent) {},
  onSurveyClosed(event: SurveyClosedEvent) {},
  onSurveyCompleted(event: SurveyCompletedEvent) {},
};
const removeListener = Survicate.addSurvicateEventListener(listener);
removeListener();

// Reset
Survicate.reset();
```

## Issues

Got an Issue?

To make things more streamlined, we’ve transitioned our issue reporting to our customer support platform. If you encounter any bugs or have feedback, please reach out to our customer support team. Your insights are invaluable to us, and we’re here to help ensure your experience is top-notch!

Contact us via Intercom in the application, or drop us an email at: [support@survicate.com]

Thank you for your support and understanding!

## Changelog

The Survicate Mobile SDK change log can be found [here](https://developers.survicate.com/mobile-sdk/react-native/#changelog)

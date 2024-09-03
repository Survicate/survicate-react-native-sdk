import React, { useEffect } from "react";
import { Button, Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
// import Survicate, {SurveyDisplayedEvent, QuestionAnsweredEvent, SurveyClosedEvent, SurveyCompletedEvent, UserTrait} from "@survicate/react-native-survicate";

const App = () => {
  // useEffect(() => {
  //   // Initialize the SDK
  //   Survicate.initializeSdk();

  //   const listener = {
  //     onSurveyDisplayed: (event: SurveyDisplayedEvent) => {
  //       // onSurveyDisplayed
  //     },
  //     onQuestionAnswered: (event: QuestionAnsweredEvent) => {
  //       // onQuestionAnswered
  //     },
  //     onSurveyClosed: (event: SurveyClosedEvent) => {
  //       // onSurveyClosed
  //     },
  //     onSurveyCompleted: (event: SurveyCompletedEvent) => {
  //       // onSurveyCompleted
  //     },
  //   };

  //   const subscription = Survicate.addSurvicateEventListener(listener);
  //   return subscription;
  // }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>
          Example App
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Enter Screen: Home"
            onPress={() => {
              // Survicate.enterScreen("Home");
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Leave Screen: Home"
            onPress={() => {
              // Survicate.leaveScreen("Home");
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Invoke Event: Event"
            onPress={() => {
              // Survicate.invokeEvent("Event");
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Invoke Event with Properties: Event"
            onPress={() => {
              const properties = {
                property1: "value1",
                property2: "value2",
              };
              // Survicate.invokeEvent("Event", properties);
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Set User Trait"
            onPress={() => {
              // const trait = new UserTrait('name', 'John');
              // Survicate.setUserTrait(trait);
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Reset"
            onPress={() => {
              // Survicate.reset();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default App;

import React from "react";
import { StyleSheet } from "react-native";
import { AuthProvider } from "./src/contexts/authContext";
import RootNavigator from "./src/navigations/rootNavigator";

const App = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});

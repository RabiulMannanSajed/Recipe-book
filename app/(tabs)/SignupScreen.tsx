import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signup } from "@/utils/api";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await signup(email, password, name);
      Alert.alert("Success", "Account created!");
      navigation.replace("LoginScreen");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Button
        title="Login Instead"
        onPress={() => navigation.navigate("LoginScreen")}
      />
    </View>
  );
}

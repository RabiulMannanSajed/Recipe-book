import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";

export default function AddRecipe() {
  const [name, setName] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [recipeDetails, setRecipeDetails] = useState("");

  const handleSubmit = async () => {
    const recipeData = {
      name,
      recipeName,
      recipeDetails,
    };

    console.log(recipeData);
    try {
      const response = await fetch("http://localhost:5000/addRecipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (result.insertedId) {
        Alert.alert("Success", "Recipe added successfully!");
        setName("");
        setRecipeName("");
        setRecipeDetails("");
      } else {
        Alert.alert("Failed", "Could not add recipe.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Your Recipes</Text>
      <View style={styles.inputFiled}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Recipe Name"
          value={recipeName}
          onChangeText={setRecipeName}
        />
      </View>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Recipe Details"
        value={recipeDetails}
        onChangeText={setRecipeDetails}
        multiline
      />

      <Button title="Submit Recipe" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  inputFiled: {
    flexDirection: "row",
    gap: 10, // If gap doesn’t work in your RN version, use marginRight
    marginBottom: 15,
  },
});

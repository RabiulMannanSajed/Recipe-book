import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Recipe {
  _id: string;
  name: string;
  recipeName: string;
  recipeDetails: string;
}

export default function AddRecipe() {
  const [name, setName] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [recipeDetails, setRecipeDetails] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [getRecipes, setGetRecipes] = useState<Recipe[]>([]);
  const storedName = AsyncStorage.getItem("name");
  const storedEmail = AsyncStorage.getItem("email");

  const fetchUserInfo = async () => {
    const storedNamed = await AsyncStorage.getItem("name");
    if (storedNamed) setName(storedNamed);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSubmit = async () => {
    const recipeData = {
      name,
      recipeName,
      recipeDetails,
    };

    try {
      // Determine if we're adding or updating the recipe
      // condition ? true : false
      const url = editingId
        ? `http://localhost:5000/addRecipes/${editingId}`
        : "http://localhost:5000/addRecipes";

      const method = editingId ? "PATCH" : "POST";

      // Make the request
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text(); // Get error details if any
        console.error("Error Response:", errorText);
        Alert.alert("Error", "Failed to save recipe, please try again later.");
        return;
      }

      // Attempt to parse the response as JSON
      const result = await response.json();

      // Show success message based on whether we're updating or creating
      if (editingId) {
        Alert.alert("Success", "Recipe updated successfully!");
      } else {
        Alert.alert("Success", "Recipe added successfully!");
      }

      // Reset form and fetch updated list
      setRecipeName("");
      setRecipeDetails("");
      setEditingId(null);
      fetchRecipes(); // Make sure this function fetches the updated list of recipes
    } catch (error) {
      console.error("Error occurred:", error);
      Alert.alert("Error", "Something went wrong! Please try again.");
    }
  };

  // get data from database
  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:5000/addRecipes");
      const data = await response.json();
      setGetRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      if (isMounted) {
        fetchRecipes();
      }
    }, 2000);

    fetchRecipes();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/addRecipes/${id}`, {
        method: "DELETE",
      });
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setRecipeName(recipe.recipeName);
    setRecipeDetails(recipe.recipeDetails);
    setEditingId(recipe._id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        {editingId ? "Edit Recipe" : "Add Your Recipes"}
      </Text>

      <View style={styles.inputFiled}>
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
      <Button
        title={editingId ? "Update Recipe" : "Submit Recipe"}
        onPress={handleSubmit}
      />

      <FlatList
        data={getRecipes}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.recipeTitle}>
                  {JSON.stringify(item.recipeName)}
                </Text>
                <Text style={styles.recipeAuthor}>
                  Name:{JSON.stringify(item.name)}
                </Text>
                <Text>{JSON.stringify(item.recipeDetails)}</Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  onPress={() => handleDelete(item._id)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.editBtn}
                >
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  inputFiled: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  recipeCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  recipeTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  recipeAuthor: {
    fontStyle: "italic",
    color: "#555",
    marginBottom: 5,
  },
  deleteBtn: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#4d88ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});

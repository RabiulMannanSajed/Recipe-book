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

//* define the types
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

  const [getRecipes, setGetRecipes] = useState<Recipe[]>([]);
  const storedName = AsyncStorage.getItem("name");
  const storedEmail = AsyncStorage.getItem("email");

  const handleSubmit = async () => {
    const recipeData = {
      name: storedName,
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

  //!this is called get method  this part is for the fetch the user posted data
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
    }, 2000); // Fetch every 2 seconds

    // Initial fetch
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
      fetchRecipes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Add Your Recipes</Text>

      {/* Form Section */}
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
      <Button title="Submit Recipe" onPress={handleSubmit} />

      {/* Scrollable FlatList */}
      {/*  this part is for the show the data to the ui  */}
      <FlatList
        data={getRecipes}
        // keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{item.recipeName}</Text>
            <Text style={styles.recipeAuthor}>Name: {item.name}</Text>
            <Text>{item.recipeDetails}</Text>

            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
              style={styles.deleteBtn}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Delete
              </Text>
            </TouchableOpacity>
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
    flex: 1, // important for FlatList to scroll
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
});

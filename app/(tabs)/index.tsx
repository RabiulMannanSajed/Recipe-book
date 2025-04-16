import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Recipe {
  _id: string;
  name: string;
  recipeName: string;
  recipeDetails: string;
}

export default function HomeScreen() {
  const [recipes, setRecipe] = useState<Recipe[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/addRecipes")
      .then((res) => res.json())
      .then((data) => setRecipe(data));
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe List</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.recipeName}</Text>
            <Text style={styles.author}>By: {item.name}</Text>
            <Text style={styles.details}>{item.recipeDetails}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    color: "gray",
  },
  details: {
    fontSize: 14,
    marginTop: 5,
  },
});

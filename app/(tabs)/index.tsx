import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
interface Recipe {
  _id: string;
  name: string;
  recipeName: string;
  recipeDetails: string;
}
// data => banckend => fonte
export default function HomeScreen() {
  const [recipes, setRecipe] = useState<Recipe[]>([]);

  // ()=> {} arrow function

  useEffect(() => {
    fetch("http://localhost:5000/addRecipes")
      .then((res) => res.json())
      .then((data) => setRecipe(data));
  }, []);
  console.log(recipes);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe List</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          console.log("Rendering item:", item); // See what’s in each item

          return (
            <View style={styles.card}>
              <Text style={styles.title}>
                {JSON.stringify(item.recipeName)}
              </Text>
              <Text style={styles.author}>By: {JSON.stringify(item.name)}</Text>
              <Text style={styles.details}>
                {JSON.stringify(item.recipeDetails)}
              </Text>
            </View>
          );
        }}
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

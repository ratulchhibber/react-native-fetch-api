import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
} from "react-native";

const ProductCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

const ProductListingScreen = () => {
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    const URL = "https://fakestoreapi.com/products";
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ProductListingScreen</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});

export default ProductListingScreen;

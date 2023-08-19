import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState } from "recoil";
import {
  productsState,
  isLoadingState,
  errorMessageState,
  pageState,
  searchQueryState,
} from "../atom/ProductState";

const ProductCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.title}>${item.price}</Text>
    </View>
  );
};

const ProductListingScreen = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [errorMessage, setErrorMessage] = useRecoilState(errorMessageState);
  const [page, setPage] = useRecoilState(pageState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  const handleEndReached = () => {
    if (searchQuery === "") {
      setPage(page + 1);
      getProducts();
    }
  };

  const renderContent = () => {
    let content;
    if (isLoading) {
      content = (
        <ActivityIndicator
          color={"gray"}
          size={"large"}
          style={styles.activityIndicator}
        />
      );
    } else if (errorMessage !== "") {
      content = (
        <View style={styles.error}>
          <Text>{errorMessage}</Text>
        </View>
      );
    } else {
      const dataWithLoader =
        searchQuery === "" ? products.concat([{}]) : products;
      content = (
        <FlatList
          data={dataWithLoader}
          renderItem={({ item }) =>
            item.id ? (
              <ProductCard item={item} />
            ) : (
              <ActivityIndicator
                color={"gray"}
                size={"large"}
                style={styles.activityIndicator}
              />
            )
          }
          keyExtractor={() => uuidv4()}
          onEndReached={handleEndReached}
        />
      );
    }
    return content;
  };

  const getProducts = () => {
    const URL = `https://fakestoreapi.com/products?page=${page}`;
    fetch(URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
        setProducts([...products, ...data]);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getProducts();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      // Clear search but keep the current products and pagination
      getProducts();
    } else {
      // Perform local search on the existing products
      const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(() => "");
    setPage(() => 1);
    setProducts(() => []);
    getProducts();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>ProductListingScreen</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search product"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {renderContent()}
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
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  clearButton: {
    color: "blue",
    marginLeft: 10,
  },
});

export default ProductListingScreen;

import { StyleSheet, Text, View } from "react-native";
import ProductListingScreen from "./screens/ProductListingScreen";
import { RecoilRoot } from "recoil";

export default function App() {
  return (
    <RecoilRoot>
      <ProductListingScreen />
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({});

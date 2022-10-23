import Spinner from "react-native-loading-spinner-overlay";
import React from "react";
import { primaryColor } from "../../theme/colors";
import { StyleSheet } from "react-native";

function Loader({ loading, text }: { loading: boolean; text: string }) {
  return (
    <Spinner
      visible={loading}
      textContent={text}
      textStyle={styles.spinnerTextStyle}
      color={primaryColor}
      animation="fade"
      overlayColor="rgba(0, 0, 0, 0.5)"
    />
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default Loader;

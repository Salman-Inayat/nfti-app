import { HStack } from "native-base";
import React, { useState } from "react";
import { View, Text, StyleSheet, ViewStyle, Dimensions } from "react-native";

interface PropTypes {
  text: string;
  containerStyle?: ViewStyle;
  targetLines?: number;
}
const TextLessMoreView = ({ targetLines, text }) => {
  const [textShown, setTextShown] = useState(false); //To show your remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [triggerTextLocation, setTriggerTextLocation] = useState({
    top: 0,
    right: 0,
  });
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };
  const screenWidth = Dimensions.get("window").width;
  const onTextLayout = (e: { nativeEvent: { lines: any } }) => {
    const { lines } = e.nativeEvent;
    if (lines && Array.isArray(lines) && lines.length > 0) {
      let tempTxtLocaation = {
        top: (lines.length - 1) * lines[0].height,
        right: screenWidth - lines[lines.length - 1].width - 10,
      };
      setTriggerTextLocation(tempTxtLocaation);
      setLengthMore(lines.length >= targetLines);
    }
  };
  return (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : targetLines || 1}
      >
        {text}
      </Text>
      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={[
            {
              textDecorationLine: "underline",
              color: "grey",
            },
          ]}
        >
          {textShown ? " Less" : "More"}{" "}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  //   mainBody: { marginTop: 15 },
  txtStyle: {
    flex: 1,
  },
});
export default TextLessMoreView;

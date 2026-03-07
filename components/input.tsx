import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends Omit<TextInputProps, "style"> {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  style?: any;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  style,
  ...props
}: InputProps) {
  const [inputValue, setInputValue] = React.useState(value || "");

  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <IconSymbol
        name="paperplane.fill"
        size={20}
        color="#8A9BB8"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A9BB8"
        value={inputValue}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        enablesReturnKeyAutomatically={true}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#2A3B5C",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F4F7FF",
    fontSize: 16,
    fontWeight: "400",
    height: "100%",
  },
});

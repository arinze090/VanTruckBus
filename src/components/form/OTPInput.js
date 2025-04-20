import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "../../themes/themes";

const OTPInput = ({ code, setCode, maxLength }) => {
  const codeDigitArray = new Array(maxLength).fill(0);

  const textInputRef = useRef(null);

  // monitoring input focus
  const [inputContainerIsFocused, setinputContainerIsFocused] = useState(false);

  const handleOnPress = () => {
    setinputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const handleBlur = () => {
    setinputContainerIsFocused(false);
  };

  const toCodeDigitInput = (_value, index) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    // formatting
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    const StyledOTPInput =
      inputContainerIsFocused && isDigitFocused
        ? styles.otpInputFocused
        : styles.singleInput;

    return (
      <View
        style={
          inputContainerIsFocused && isDigitFocused
            ? styles.otpInputFocused
            : styles.singleInput
        }
        key={index}
      >
        <Text style={styles.otpText}>{digit}</Text>
      </View>
    );
  };
  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.otpInputSection}
    >
      <TouchableOpacity style={styles.container} onPress={handleOnPress}>
        {codeDigitArray?.map(toCodeDigitInput)}
      </TouchableOpacity>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.hiddenTextInput}
          value={code}
          onChangeText={setCode}
          maxLength={maxLength}
          keyboardType="number-pad"
          ref={textInputRef}
          onBlur={handleBlur}
        />
      </View>
    </TouchableOpacity>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  otpInputSection: {
    //   otpinputsection
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignContent: 'center',
    alignSelf: 'center',
    // backgroundColor: 'green',
  },
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  singleInput: {
    //   otpinput
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    //   otpinputText
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    marginRight: 20,
  },
  hiddenTextInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpInputFocused: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    borderColor: COLORS.vtbBtnColor,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

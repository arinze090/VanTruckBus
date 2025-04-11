import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {COLORS} from '../../themes/themes';

const FormInput = ({
  leftIcon,
  iconColor = '#000',
  rightIcon,
  inputStyle,
  containerStyle,
  placeholderTextColor = '#ccc',
  handlePasswordVisibility,
  onPress,
  autoCapitalize,
  keyboardType,
  maxLength,
  editable,
  width,
  formInputTitle,
  multiLine,
  numberOfLines,
  height,
  placeholder,
  marginBottom,
  errorMessage,
  formWidth,
  ...rest
}) => {
  // This sets the color of the textInput field, default value is #1E1E1E4D
  const [inputBg, setInputBg] = useState('#1E1E1E4D');

  // this function changes the textInput field color when it's on focus
  const customOnFocus = () => {
    setInputBg(COLORS.vtbBtnColor);
  };

  // this function changes the textInput field color when it's on blur
  const customOnBlur = () => {
    setInputBg('#1E1E1E4D');
  };
  return (
    <View
      style={[
        styles.auth,
        {
          marginBottom: marginBottom ? marginBottom : 20,
          width: formWidth ? formWidth : null,
        },
      ]}>
      <Text style={styles.inputTitle}>{formInputTitle}</Text>
      <View
        style={[
          styles.container,
          containerStyle,
          {
            borderColor: inputBg,
            width: windowWidth / (width || 1.1),
            // height: height ? height : null,
            height: height
              ? height
              : Platform.OS == 'android'
              ? 46
              : windowHeight / 16,
          },
        ]}
        onPress={onPress}
        onBlur={customOnBlur}
        onFocus={customOnFocus}>
        {leftIcon ? (
          <TouchableOpacity style={{padding: 6}}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={iconColor}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
        ) : null}
        <TextInput
          {...rest}
          autoCorrect={false}
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, inputStyle]}
          onBlur={customOnBlur}
          onFocus={customOnFocus}
          autoCapitalize={'none'}
          // autoComplete={false}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          multiline={multiLine}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
        />
        {rightIcon ? (
          <TouchableOpacity
            style={{padding: 6}}
            onPress={handlePasswordVisibility}
            activeOpacity={0.9}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={iconColor}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {errorMessage && (
        <Text style={styles.validationError}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  auth: {
    width: windowWidth / 1.1,
    alignSelf: 'center',
    // marginTop: 30,
    // marginBottom: 10,
    // backgroundColor: 'red',
  },
  inputTitle: {
    marginBottom: 10,
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '600',
  },
  container: {
    borderRadius: 4,
    flexDirection: 'row',
    padding: Platform.OS == 'android' ? 3 : 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 0,
    height: Platform.OS == 'android' ? 46 : windowHeight / 16,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    color: 'black',
    // backgroundColor: 'red',
    height: Platform.OS == 'android' ? 40 : null,
  },
  rightIcon: {
    marginLeft: 10,
    alignSelf: 'center',
  },
  validationError: {
    color: 'red',
    fontWeight: '500',
    marginBottom: 5,
    fontSize: 13,
    // textAlign: 'center',
  },
});

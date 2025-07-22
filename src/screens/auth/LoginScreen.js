import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

import SafeAreaViewComponent from '../../components/common/SafeAreaViewComponent';
import FixedBottomContainer from '../../components/common/FixedBottomContainer';
import {COLORS} from '../../themes/themes';
import FormButton from '../../components/form/FormButton';
import {emailValidator} from '../../Library/Validation';
import FormInput from '../../components/form/FormInput';
import {windowWidth} from '../../utils/Dimensions';
import {
  getUser,
  saveAccessToken,
  saveLoginTime,
  saveRefreshToken,
  saveUserPreferences,
  saveUserRole,
  setUserDestination,
} from '../../redux/features/user/userSlice';
import {useDispatch} from 'react-redux';
import KeyboardAvoidingComponent from '../../components/form/KeyboardAvoidingComponent';
import axiosInstance from '../../utils/api-client';
import {RNToast} from '../../Library/Common';
import {checkPointFromLogin} from '../../utils/helper';

const LoginScreen = ({navigation, route}) => {
  const item = route?.params;
  console.log('hgsgs', item);

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const [rightIcon, setRightIcon] = useState('eye-outline');

  const [loading, setLoading] = useState(false);

  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // This function handles the password visibility displaying the icons
  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye-outline') {
      setRightIcon('eye-off-outline');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off-outline') {
      setRightIcon('eye-outline');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const login = async () => {
    const loginData = {
      identifier: email,
      password: password,
    };

    console.log('loginData', loginData);

    if (!email) {
      setEmailError('Please provide your email or username');
      setFormError('Invalid Login details, please try again');
    } else if (!password) {
      setPasswordError('Please provide your password');
      setFormError('Invalid Login details, please try again');
    } else {
      setLoading(true);
      try {
        await axiosInstance({
          url: 'api/auth/login',
          method: 'POST',
          data: loginData,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            console.log('res', res?.data);
            setLoading(false);

            if (res?.data) {
              console.log('Login data', res?.data);
              dispatch(saveUserRole(res?.data?.role));

              if (res?.data?.role == 'User') {
                checkUserProfile(
                  res?.data?.access_token,
                  res?.data?.refresh_token,
                );
              }

              // navigation.navigate("HomeScreen", { screen: "HomeScreen" });
            } else {
              console.log('message', res?.data?.message);
              setFormError('Invalid Details, please try again later');
              Alert.alert(
                'Login Failed',
                'It seems the credentials are not registered with us, please register to enjoy our services',
              );
            }
          })
          .catch(err => {
            console.log('Login err', err?.response);
            setFormError('Invalid Login details, please try again');

            setLoading(false);

            if (err?.response?.status == 401) {
              Alert.alert(
                'Login Failed',
                'Invalid login credentials, please provide the valid credentials to continue using our services',
              );
            }
            // setFormError(err?.response?.data?.message);
          });
      } catch (error) {
        console.log('Login error', error);
      }
    }
  };

  const checkUserProfile = async (access_token, refresh_token) => {
    try {
      if (!access_token) {
        navigation.navigate('LoginScreen');
        return;
      }

      // save the AccessToken and RefreshToken to redux here immediately
      dispatch(saveAccessToken(access_token));
      dispatch(saveRefreshToken(refresh_token));
      dispatch(saveLoginTime(Date.now()));

      const profileResponse = await axiosInstance({
        url: 'api/profile/profile',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('profdd', profileResponse);

      if (profileResponse?.data) {
        dispatch(getUser(profileResponse?.data));
        RNToast(Toast, 'Login Successful. Welcome Back! 😇');

        checkPointFromLogin(navigation, profileResponse?.data, item);
      } else {
        navigation.navigate('OnboardingFlow');
      }
    } catch (error) {
      console.error('checkUserProfile check error:', error?.response);
      navigation.navigate('OnboardingFlow');
    }
  };

  return (
    <SafeAreaViewComponent>
      <KeyboardAvoidingComponent>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/VTBLogo.png')}
            style={styles.ndonuLogo}
          />
        </View>

        <View style={{marginBottom: 20, padding: 20}}>
          <Text
            style={{
              color: COLORS.black,
              fontSize: 24,
              fontWeight: '600',
              lineHeight: 24,
              marginBottom: 10,
            }}>
            Welcome,
          </Text>
          <Text style={{color: '#1E1E1EB2', fontSize: 16, fontWeight: '400'}}>
            Sign In to access your account.{' '}
          </Text>
        </View>

        <FormInput
          formInputTitle={'Email'}
          value={email}
          placeholder="Enter your email or username"
          width={1.1}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={txt => {
            setEmail(txt);
            setFormError('');
            setEmailError('');
            // if (!emailValidator(txt)) {
            //   setEmailError("Please enter a valid email");
            // } else {
            //   setEmailError("");
            // }
          }}
          // placeholderTextColor="#ccc"
          errorMessage={emailError}
        />

        <FormInput
          formInputTitle={'Password'}
          value={password}
          placeholder="Password"
          width={1.1}
          autoCorrect={false}
          rightIcon={rightIcon}
          iconColor="black"
          // placeholderTextColor="#000"
          autoCapitalize="none"
          secureTextEntry={passwordVisibility}
          textContentType="password"
          onChangeText={txt => {
            setPassword(txt);
            setFormError('');
          }}
          handlePasswordVisibility={handlePasswordVisibility}
          marginBottom={0}
          errorMessage={passwordError}
        />

        <Text
          onPress={() => {
            navigation.navigate('ForgetPassword');
          }}
          style={{
            color: COLORS.vtbBtnColor,
            fontWeight: '700',
            justifyContent: 'center',
            alignContent: 'flex-end',
            alignSelf: 'flex-end',
            padding: 0,
            marginRight: 20,
          }}>
          Forget Password ?
        </Text>

        <FixedBottomContainer top={1.5}>
          <FormButton
            title={'Sign In'}
            width={1.1}
            onPress={login}
            disabled={!email || !password || loading}
            formError={formError}
            loading={loading}
          />

          <View style={styles.alreadySection}>
            <Text style={[styles.alreadyText]}>
              Don’t have an account?{'  '}
            </Text>
            <TouchableOpacity
              style={styles.signup}
              onPress={() => {
                dispatch(setUserDestination('Login'));
                navigation.navigate('Register');
              }}>
              <Text
                style={{
                  color: COLORS.vtbBtnColor,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </FixedBottomContainer>
      </KeyboardAvoidingComponent>
    </SafeAreaViewComponent>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 40,
    marginBottom: 20,
    // backgroundColor: 'red',
  },
  ndonuLogo: {
    width: windowWidth / 1.4,
    height: 84,
    objectFit: 'contain',
  },
  alreadySection: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    marginTop: 20,
  },
  alreadyText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
  },
  signup: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: "red",
    // marginTop: 10,
  },
});

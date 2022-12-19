import React, { useState, useEffect, useContext, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"
import { Icon } from "react-native-elements"
import {
  COLORS,
  FONT1BOLD,
  FONT1LIGHT,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD,
  FONT3REGULAR
} from "../../constants"
import { AppButton } from "../../components"
import { loginUser, signupUser } from "../../api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import AppContext from "../../store/Context"
import Toast from "react-native-simple-toast"
import { SvgXml } from "react-native-svg"
import logo from "../../assets/svg/logo.svg"
import apple from "../../assets/svg/apple.svg"
import google from "../../assets/svg/google.svg"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { API_URL } from "../../api/config"
import {
  getError,
  validateEmail,
  validateName
} from "../../utils/ValidateEmail"

function LoginScreen({ navigation, route }) {
  const isType = route?.params?.isType
  let passwordRef = useRef()
  let emailRef = useRef()
  let password1Ref = useRef()
  let password2Ref = useRef()
  // Context
  const context = useContext(AppContext)
  const { setUser, requestUserPermission } = context

  const [state, setState] = useState({
    email: "",
    name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    isEmailValid: false,
    invalidPass: false,
    loading: false,
    showPassword: false,
    isChecked: false,
    showConfirmPassword: false,
    active: 0,
    isAdmin: false
  })

  const {
    loading,
    showPassword,
    password,
    active,
    invalidPass,
    name,
    isChecked,
    email
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleLogin = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        email,
        password
      }
      const res = await loginUser(payload)
      handleChange("loading", false)
      console.warn("loginUser", res?.data)
      setUser(res?.data?.user)
      await AsyncStorage.setItem("token", res?.data?.token)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user))
      navigation.navigate("AuthLoading")
      Toast.show("Logged in Successfully!", Toast.SHORT)
    } catch (error) {
      handleChange("loading", false)
      console.warn("err", error)
      getError(error)
    }
  }

  const _isEmailValid = () => {
    if (email) {
      const isValid = validateEmail(email)
      if (!isValid) {
        handleChange("email", "")
        Toast.show("Email is not valid!")
      } else {
        handleChange("isEmailValid", true)
      }
    }
  }

  const _isNameValid = () => {
    if (onlySpaces(name)) {
      Toast.show("Please enter name", Toast.LONG)
      handleChange("name", "")
      return
    }
    if (name) {
      const isValid = validateName(name)
      if (!isValid) {
        handleChange("name", "")
        Toast.show("Username is not valid!")
      }
    }
  }

  useEffect(async () => {
    const email = await AsyncStorage.getItem("email")
    const password = await AsyncStorage.getItem("password")
    if (email) {
      handleChange("email", email)
    }
    if (password) {
      handleChange("password", password)
    }
  }, [])

  function onlySpaces(str) {
    return /^\s*$/.test(str)
  }

  const handleSignup = async () => {
    try {
      const env = await AsyncStorage.getItem("env")
      handleChange("loading", true)
      const payload = {
        email,
        password,
        type: env
      }

      const res = await signupUser(payload)
      handleChange("loading", false)
      setUser(res?.data?.user)
      await AsyncStorage.setItem("token", res?.data?.token)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user))
      navigation.navigate("AuthLoading")
      // requestUserPermission(true)
      Toast.show("Signed up Successfully!", Toast.SHORT)
    } catch (error) {
      handleChange("loading", false)
      getError(error)
    }
  }

  function _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "487069185100-qsifiakpmm7s8rltmmodipk8klifbbql.apps.googleusercontent.com",
      iosClientId:
        "487069185100-4311thbhtrlpcbi5ukenhhnhikff0a5l.apps.googleusercontent.com",
      offlineAccess: false
    })
  }

  useEffect(() => {
    _configureGoogleSignIn()
  }, [])

  const handleApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })
    if (appleAuthRequestResponse?.identityToken) {
      const payload = {
        access_token: appleAuthRequestResponse.authorizationCode,
        id_token: appleAuthRequestResponse.identityToken
      }
      const headers = {
        "content-type": "application/json"
      }
      fetch(API_URL() + "modules/social-auth/apple/login/", {
        method: "POST", // or 'PUT'
        headers: headers,
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(async res => {
          console.log("Success:", res)
          if (
            JSON.stringify(res)?.includes(
              "User is already registered with this e-mail address."
            )
          ) {
            handleChange("loading", false)
            alert(
              "User is already registered with this e-mail address. Please login with manually or Social Logins!"
            )
            return
          }
          if (res?.user) {
            handleChange("loading", false)
            setUser(res?.user)
            // requestUserPermission(true)
            await AsyncStorage.setItem("token", res?.token)
            await AsyncStorage.setItem("user", JSON.stringify(res?.user))
            navigation.navigate("AuthLoading")
            Toast.show("Logged in Successfully!")
          } else {
            console.warn("else res", res)
            handleChange("loading", false)
            Toast.show("Something went wrong!")
          }
        })
        .catch(error => {
          handleChange("loading", false)
          console.warn("errcaaaaa", error)
          getError(error)
        })
        .catch(error => {
          handleChange("loading", false)
          console.warn("errss", error)
          getError(error)
        })
    }
  }

  const handleGoogle = async () => {
    // try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const userInfo = await GoogleSignin.signIn()
    const userInfoToken = await GoogleSignin.getTokens()
    const payload = {
      type: "Client",
      access_token: userInfoToken.accessToken
    }
    const headers = {
      "content-type": "application/json"
    }
    fetch(API_URL() + "modules/social-auth/google/login/", {
      method: "POST", // or 'PUT'
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(async res => {
        console.log("Success:", res)
        if (
          JSON.stringify(res)?.includes(
            "User is already registered with this e-mail address."
          )
        ) {
          handleChange("loading", false)
          alert(
            "User is already registered with this e-mail address. Please login with manually or Facebook Login!"
          )
          return
        }
        if (res?.user) {
          handleChange("loading", false)
          setUser(res?.user)
          // requestUserPermission(true)
          await AsyncStorage.setItem("token", res?.token)
          await AsyncStorage.setItem("user", JSON.stringify(res?.user))
          navigation.navigate("AuthLoading")
          Toast.show("Logged in Successfully!")
        } else {
          console.warn("else res", res)
          handleChange("loading", false)
          Toast.show("Something went wrong!")
        }
      })
      .catch(error => {
        handleChange("loading", false)
        getError(error)
      })
      .catch(error => {
        handleChange("loading", false)
        getError(error)
      })
  }

  const checkPass = () => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    if (regex.test(password)) {
      if (password != "") {
        handleChange("invalidPass", false)
      } else {
        handleChange("password", "")
      }
    } else {
      handleChange("invalidPass", true)
    }
  }

  return (
    // <View style={styles.container}>
    <KeyboardAwareScrollView
      style={styles.container}
      enableAutomaticScroll={true}
      onScrollAnimationEnd
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View style={styles.top}>
        <View style={styles.logoTop}>
          <SvgXml xml={logo} width={100} style={{ marginBottom: 20 }} />
          <View style={[styles.tabs, { justifyContent: "center" }]}>
            <TouchableOpacity
              style={active === 0 ? styles.activeTab : styles.tab}
              onPress={() => handleChange("active", 0)}
            >
              <Text
                style={active === 0 ? styles.activeTabText : styles.tabText}
              >
                {"Sign in"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={active === 1 ? styles.activeTab : styles.tab}
              onPress={() => handleChange("active", 1)}
            >
              <Text
                style={active === 1 ? styles.activeTabText : styles.tabText}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {active === 0 ? (
          <>
            <Text style={styles.label}>Email</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                onSubmitEditing={() => passwordRef?.current?.focus()}
                placeholder={"Email"}
                returnKeyType="go"
                caretHidden={false}
                keyboardType={"email-address"}
                autoFocus={true}
                value={email}
                // onBlur={_isEmailValid}
                autoCapitalize="none"
                onChangeText={text => handleChange("email", text)}
                placeholderTextColor={COLORS.navy}
                style={styles.textInput}
              />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                label={"Your password"}
                placeholder={"Your password"}
                ref={passwordRef}
                onBlur={checkPass}
                style={styles.textInput}
                onChangeText={text => handleChange("password", text)}
                value={password}
                placeholderTextColor={COLORS.navy}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => handleChange("showPassword", !showPassword)}
              >
                {showPassword ? (
                  <Icon
                    name={"eye-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={"eye-off-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            {invalidPass && (
              <View style={styles.textFieldContainer}>
                <Text style={styles.errorText}>
                  Password at least 8 characters which contain at least one
                  lowercase letter, one uppercase letter, one numeric digit, and
                  one special character
                </Text>
              </View>
            )}

            <View style={[styles.remeberContainer, { marginBottom: 10 }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot password</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.buttonWidth, { marginTop: 50 }]}>
              <AppButton
                title={"Sign in"}
                loading={loading}
                disabled={!email || !password}
                onPress={handleLogin}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Email</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                onSubmitEditing={() =>
                  password1Ref.current && password1Ref.current?.focus()
                }
                ref={emailRef}
                caretHidden={false}
                placeholder={"Email"}
                returnKeyType="go"
                keyboardType={"email-address"}
                value={email}
                onBlur={_isEmailValid}
                autoCapitalize="none"
                onChangeText={text => handleChange("email", text)}
                placeholderTextColor={COLORS.navy}
                style={styles.textInput}
              />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                label={"Create password"}
                ref={password1Ref}
                onSubmitEditing={() =>
                  password2Ref.current && password2Ref.current?.focus()
                }
                placeholder={"Create password"}
                onBlur={checkPass}
                value={password}
                style={styles.textInput}
                placeholderTextColor={COLORS.navy}
                onChangeText={text => handleChange("password", text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => handleChange("showPassword", !showPassword)}
              >
                {showPassword ? (
                  <Icon
                    name={"eye-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                ) : (
                  <Icon
                    name={"eye-off-outline"}
                    color={COLORS.black}
                    type={"ionicon"}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
            {invalidPass && (
              <View style={styles.textFieldContainer}>
                <Text style={styles.errorText}>
                  Password at least 8 characters which contain at least one
                  lowercase letter, one uppercase letter, one numeric digit, and
                  one special character
                </Text>
              </View>
            )}
            <View
              style={{
                width: "85%",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.darkBlack}
                unfillColor={COLORS.white}
                disableBuiltInState
                isChecked={isChecked}
                text=""
                innerIconStyle={{
                  backgroundColor: isChecked ? COLORS.primary : COLORS.white
                }}
                iconStyle={{ borderColor: COLORS.darkBlack, borderRadius: 20 }}
                textStyle={{
                  fontFamily: FONT1REGULAR,
                  fontSize: hp(2),
                  color: COLORS.darkBlack,
                  textDecorationLine: "none"
                }}
                onPress={() => handleChange("isChecked", !isChecked)}
              />
              <Text
                style={{
                  width: "90%",
                  fontFamily: FONT3REGULAR,
                  fontSize: hp(1.6)
                }}
              >
                I have read{" "}
                <Text
                  onPress={() => navigation.navigate("TermsCondtions")}
                  style={{ textDecorationLine: "underline" }}
                >
                  Terms and conditions
                </Text>{" "}
                and
                <Text
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                  style={{ textDecorationLine: "underline" }}
                >
                  {" "}
                  Privacy policy
                </Text>
              </Text>
            </View>
            <View style={[styles.buttonWidth, { marginTop: 50 }]}>
              <AppButton
                title={"Sign up"}
                loading={loading}
                disabled={invalidPass || !isChecked || !email || !password}
                onPress={handleSignup}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.hLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.hLine} />
            </View>

            <TouchableOpacity style={styles.socialBox} onPress={handleGoogle}>
              <View style={styles.row}>
                <SvgXml
                  xml={google}
                  style={{ width: hp("15%"), height: hp("15%") }}
                />
                <Text style={styles.continueText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
            {appleAuth.isSupported && (
              <TouchableOpacity style={styles.socialBox} onPress={handleApple}>
                <View style={styles.row}>
                  <SvgXml
                    xml={apple}
                    style={{ width: hp("15%"), height: hp("15%") }}
                  />
                  <Text style={styles.continueText}>Continue with Apple</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        <TouchableOpacity
          onPress={() => handleChange("active", active ? 0 : 1)}
        >
          <Text style={styles.dontacount}>
            {active ? "Already have an account" : "Don’t have an account?"}{" "}
            <Text style={styles.signUp}>{active ? "Sign in" : "Sign up"}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
    // </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
    backgroundColor: COLORS.backgroud,
    height: "100%"
  },
  errorText: { width: "100%", marginBottom: 20 },
  textFieldContainer: { width: "85%" },
  top: {
    width: "100%",
    alignItems: "center"
  },
  logoTop: {
    width: "100%",
    backgroundColor: COLORS.white,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    alignItems: "center"
  },
  buttonWidth: { width: "90%", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  continueText: {
    fontFamily: FONT3REGULAR,
    marginLeft: 10,
    color: COLORS.darkBlack
  },
  socialBox: {
    borderWidth: 1,
    marginVertical: 10,
    width: "90%",
    borderColor: COLORS.borderColor1,
    height: hp(7),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    width: "85%",
    fontFamily: FONT3REGULAR,
    color: COLORS.borderColor,
    fontSize: hp(2)
  },
  textInputContainer: {
    marginBottom: hp(3),
    height: hp(8),
    backgroundColor: COLORS.backgroud,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLORS.borderColor,
    width: "90%"
  },
  remeberContainer: {
    alignItems: "flex-end",
    width: "90%",
    marginTop: -10
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: hp(2),
    marginRight: 20,
    fontFamily: FONT3REGULAR
  },
  signUpText: {
    marginTop: 20
  },
  loginText: {
    color: COLORS.primary,
    fontSize: hp(3),
    width: "90%",
    marginBottom: "5%",
    fontFamily: FONT1SEMIBOLD
  },
  backContainer: { width: "90%", alignItems: "flex-start", marginBottom: 30 },
  signUp: {
    color: COLORS.secondary,
    fontFamily: FONT1BOLD,
    textDecorationLine: "underline"
  },
  line: {
    width: "100%",
    backgroundColor: COLORS.grey,
    height: 5
  },
  activeline: {
    width: "100%",
    backgroundColor: COLORS.darkBlack,
    height: 5
  },
  tabs: {
    width: "90%",
    paddingHorizontal: 5,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tab: {
    width: "45%",
    alignItems: "center"
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 2,
    width: "45%",
    justifyContent: "center",
    height: hp(5),
    alignItems: "center"
  },
  tabText: {
    color: COLORS.darkGrey,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  activeTabText: {
    color: COLORS.darkBlack,
    fontSize: hp(2),
    fontFamily: FONT1MEDIUM
  },
  row: { flexDirection: "row", alignItems: "center" },
  hLine: { height: 1, width: "40%", backgroundColor: COLORS.grey },
  orText: {
    color: COLORS.darkBlack,
    fontFamily: FONT3REGULAR,
    marginHorizontal: 10
  },
  dontacount: {
    color: COLORS.darkBlack,
    fontFamily: FONT3REGULAR,
    marginBottom: 20
  },
  signUp: { color: COLORS.primary, textDecorationLine: "underline" },
  textInput: {
    color: COLORS.inputText,
    width: "90%",
    fontFamily: FONT1LIGHT,
    fontSize: hp(1.8)
  }
})

export default LoginScreen

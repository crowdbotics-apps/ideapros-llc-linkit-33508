import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Splash from "../screens/Splash"
import LoginScreen from "../screens/LoginScreen"
import ForgotPassword from "../screens/ForgotPassword"
import GettingStarted from "../screens/GettingStarted"
import AuthLoading from "../screens/AuthLoading"
import Welcome from "../screens/Splash/Welcome"
import Home from "../screens/Home"
import TermsCondtions from "../screens/TCPP/TermsCondtions"
import PrivacyPolicy from "../screens/TCPP/PrivacyPolicy"
import CreateProfile from "../screens/Profile/CreateProfile"

const Stack = createStackNavigator()
function MainStackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card"
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="GettingStarted" component={GettingStarted} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="AuthLoading" component={AuthLoading} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="TermsCondtions" component={TermsCondtions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="Drawers" component={Home} />
    </Stack.Navigator>
  )
}

export default MainStackNav

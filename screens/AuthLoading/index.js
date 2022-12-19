import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { COLORS } from "../../constants"
import AppContext from "../../store/Context"

function AuthLoading({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setUser, _getTerms } = context

  useEffect(() => {
    _bootstrapAsync()
    navigation.addListener("focus", () => {
      _bootstrapAsync()
    })
  }, [])
  const _bootstrapAsync = async () => {
    _getTerms()
    const userUID = await AsyncStorage.getItem("token")
    const user = await AsyncStorage.getItem("user")
    if (userUID && user) {
      const userData = JSON.parse(user)
      setUser(userData)
      navigation.navigate("Drawers")
    } else {
      navigation.navigate("Welcome")
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default AuthLoading

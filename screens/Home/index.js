import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { AppButton } from "../../components"
import { COLORS } from "../../constants"
import AppContext from "../../store/Context"

function Home({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { setUser } = context
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    navigation.navigate("AuthLoading")
  }

  return (
    <View style={styles.container}>
      <AppButton title={"Logout"} onPress={logout} />
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

export default Home

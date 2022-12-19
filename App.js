import React, { useState } from "react"
import "react-native-gesture-handler"
import RootStackNav from "./navigation/RootStackNav"
import AppContext from "./store/Context"
import { NavigationContainer } from "@react-navigation/native"
import { MenuProvider } from "react-native-popup-menu"
import { SafeAreaView } from "react-native"
import { getPrivacyPolicy, getTerms } from "./api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
function App() {
  const [user, setUser] = useState(null)
  const [terms, setTerms] = useState([])
  const [privacyPolicy, setPrivacyPolicy] = useState([])

  const _getTerms = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      const res = await getTerms(token)
      const res1 = await getPrivacyPolicy(token)
      setPrivacyPolicy(res1?.data)
      setTerms(res?.data)
    } catch (error) {
      getError(error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        _getTerms,
        privacyPolicy,
        terms
      }}
    >
      <NavigationContainer>
        <MenuProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <RootStackNav />
          </SafeAreaView>
        </MenuProvider>
      </NavigationContainer>
    </AppContext.Provider>
  )
}
export default App

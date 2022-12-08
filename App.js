import React, { useState } from "react"
import "react-native-gesture-handler"
import RootStackNav from "./navigation/RootStackNav"
import AppContext from "./store/Context"
import { NavigationContainer } from "@react-navigation/native"
import { MenuProvider } from "react-native-popup-menu"
import { SafeAreaView } from "react-native"
function App() {
  const [user, setUser] = useState(null)

  return (
    <AppContext.Provider
      value={{
        user,
        setUser
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

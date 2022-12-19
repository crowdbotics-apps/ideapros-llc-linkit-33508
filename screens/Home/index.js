import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useContext, useState } from "react"
import { StyleSheet, View, ActivityIndicator, Modal, Text } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { AppButton } from "../../components"
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1REGULAR } from "../../constants"
import AppContext from "../../store/Context"

function Home({ navigation }) {
  // Context
  const context = useContext(AppContext)
  // State
  const [state, setState] = useState({
    showLogout: false,
    showdelete: false,
    loadingDelete: false
  })

  const { showLogout } = state
  const { setUser } = context
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    navigation.navigate("AuthLoading")
  }

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  return (
    <View style={styles.container}>
      <AppButton
        title={"Logout"}
        onPress={() => handleChange("showLogout", true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogout}
        onRequestClose={() => {
          handleChange("showLogout", false)
        }}
      >
        <View style={[styles.centeredView]}>
          <View
            style={[styles.modalView, { marginTop: 20 }]}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text style={styles.modalText}>
              {"Are you sure you want to\nperform this action?"}
            </Text>
            <View style={styles.rowAround}>
              <View style={[styles.halfWidth1, { marginRight: 20 }]}>
                <AppButton title={"Yes"} onPress={logout} />
              </View>
              <View style={styles.halfWidth1}>
                <AppButton
                  title={"No"}
                  backgroundColor={COLORS.darkGrey}
                  onPress={() => handleChange("showLogout", false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.modalBG
  },
  modalView: {
    width: "90%",
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    paddingVertical: 50,
    elevation: 5
  },
  halfWidth1: {
    width: "48%"
  },
  rowAround: {
    width: "100%",
    marginVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  modalText: {
    textAlign: "center",
    color: COLORS.darkBlack,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2.2),
    marginBottom: 20
  }
})

export default Home

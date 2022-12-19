import React from "react"
import { View, StyleSheet, ScrollView, Text } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { COLORS, FONT1REGULAR } from "../../constants"
import { Header } from "../../components"
import AppContext from "../../store/Context"
import { useContext } from "react"

function PrivacyPolicy({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { privacyPolicy } = context
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Header title={"Privacy Policy"} back notification />
      <View style={styles.body}>
        {Array.isArray(privacyPolicy) &&
          privacyPolicy?.map((term, index) => (
            <Text key={index} style={styles.name}>
              {term?.body}
            </Text>
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    width: "100%",
    height: "100%"
  },
  name: {
    fontFamily: FONT1REGULAR,
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    width: "90%",
    lineHeight: 20,
    marginVertical: 20
  },

  body: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  backText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  }
})

export default PrivacyPolicy

import React, { useCallback } from "react"
import { View, StyleSheet, ScrollView, Text } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { COLORS, FONT1REGULAR } from "../../constants"
import { Header } from "../../components"
import AppContext from "../../store/Context"
import { useContext } from "react"
import { useFocusEffect } from "@react-navigation/native"

function TermsCondtions({ navigation }) {
  // Context
  const context = useContext(AppContext)
  const { terms, _getTerms } = context

  useFocusEffect(
    useCallback(() => {
      _getTerms()
    }, [])
  )
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Header title={"Terms and Conditions"} back notification />

      <View style={styles.body}>
        {Array.isArray(terms) &&
          terms?.map((term, index) => (
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
  backText: {
    color: COLORS.primary,
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  body: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    width: "100%",
    height: "100%"
  }
})

export default TermsCondtions

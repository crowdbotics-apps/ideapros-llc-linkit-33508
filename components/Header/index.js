import React, { useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native"
import { COLORS, FONT1BOLD, FONT1SEMIBOLD } from "../../constants"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "react-native-elements"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import AppContext from "../../store/Context"
import AsyncStorage from "@react-native-async-storage/async-storage"
export default function Header({
  title,
  back,
  logo,
  rightItem,
  rightEmpty,
  profile,
  notification,
  backPress,
  backgroundColor,
  color,
  menu,
  cross
}) {
  const navigation = useNavigation()
  // Context
  const context = useContext(AppContext)
  const setUser = context?.setUser
  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("user")
    navigation.navigate("AuthLoading")
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React"
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <View
      style={[
        styles.header,
        {
          width: "100%",
          paddingHorizontal: "5%",
          alignItems: "center",
          backgroundColor: backgroundColor || COLORS.white
        }
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {back && (
          <TouchableOpacity
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <Icon
              name="left"
              type="antdesign"
              color={color || COLORS.darkGrey}
              size={18}
              containerStyle={{ marginRight: 5, marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        {cross && (
          <TouchableOpacity
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <Icon
              name="close"
              type="antdesign"
              color={color || COLORS.darkGrey}
              size={18}
              containerStyle={{ marginRight: 5, marginTop: 2 }}
            />
          </TouchableOpacity>
        )}
        {title && (
          <Text style={[styles.title, { color: color || COLORS.darkGrey }]}>
            {title}
          </Text>
        )}
      </View>
      {rightEmpty && <View style={{ width: 50 }} />}
      {rightItem && rightItem}
      {menu && (
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          {/* <SvgXml xml={menuIcon} height={60} /> */}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: hp(9),
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3
  },
  menuView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 45
  },
  title: {
    color: COLORS.darkGrey,
    fontSize: hp(2.5),
    fontFamily: FONT1SEMIBOLD
  },
  backText: {
    color: COLORS.inputBorder,
    fontFamily: FONT1BOLD
  },
  login: {
    backgroundColor: COLORS.white,
    width: 90,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100
  },
  profile: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 65,
    borderTopLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 50
  }
})

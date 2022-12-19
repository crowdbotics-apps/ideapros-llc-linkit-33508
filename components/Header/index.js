import React, { useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native"
import { COLORS, FONT1BOLD, FONT1MEDIUM, FONT1SEMIBOLD } from "../../constants"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "react-native-elements"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { SvgXml } from "react-native-svg"
import AppContext from "../../store/Context"
import notificationIcon from "../../assets/svg/notification.svg"
import ChevronLeft from "../../assets/svg/chevron-left.svg"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Header({
  title,
  back,
  rightItem,
  rightEmpty,
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
            style={{
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              borderRadius: 8
            }}
            onPress={() => (backPress ? backPress() : navigation.goBack())}
          >
            <SvgXml xml={ChevronLeft} />
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
      </View>
      {title && (
        <Text style={[styles.title, { color: color || COLORS.darkBlack }]}>
          {title}
        </Text>
      )}
      {notification && (
        <TouchableOpacity
        // onPress={() => (backPress ? backPress() : navigation.goBack())}
        >
          <SvgXml
            xml={notificationIcon}
            name="left"
            type="antdesign"
            color={color || COLORS.darkGrey}
            size={18}
            containerStyle={{ marginRight: 5, marginTop: 2 }}
          />
        </TouchableOpacity>
      )}
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
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.white
  },
  menuView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 45
  },
  title: {
    color: COLORS.darkBlack,
    fontSize: hp(2.5),
    marginTop: 50,
    fontFamily: FONT1MEDIUM
  }
})

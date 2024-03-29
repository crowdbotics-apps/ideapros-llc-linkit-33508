import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Image, TouchableOpacity } from "react-native"
import { View, StyleSheet, Text } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import userIcon from "../../assets/svg/Profile.svg"
import { AppButton, AppInput } from "../../components"
import { COLORS, FONT1LIGHT, FONT1MEDIUM, FONT1REGULAR } from "../../constants"
import Toast from "react-native-simple-toast"
import ImagePicker from "react-native-image-crop-picker"
import { updateProfile } from "../../api/auth"
import { SvgXml } from "react-native-svg"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

function CreateProfile({ navigation }) {
  // const { _getProfile } = useContext(AppContext)
  const [state, setState] = useState({
    name: "",
    restaurant_name: "",
    location: "",
    about_us: "",
    email: "",
    phone: "",
    uploading: false,
    pickup: false,
    dropoff: false,
    loading: false,
    open: false,
    date: new Date(),
    avatarSourceURL: "",
    selectedDate: "",
    open1: false,
    selectedTime: "",
    photo: null,
    time: new Date(),
    locationText: ""
  })
  const {
    name,
    loading,
    restaurant_name,
    about_us,
    location,
    email,
    phone,
    uploading,
    avatarSourceURL,
    pickup,
    open,
    date,
    selectedDate,
    selectedTime,
    open1,
    time,
    photo,
    locationText,
    dropoff
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(async () => {
    const user = await AsyncStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      handleChange("email", userData?.email)
    }
  }, [])

  const _uploadImage = async type => {
    setState(prevState => ({ ...prevState, uploading: true }))
    let OpenImagePicker =
      type == "camera"
        ? ImagePicker.openCamera
        : type == ""
        ? ImagePicker.openPicker
        : ImagePicker.openPicker

    OpenImagePicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true
    })
      .then(async response => {
        if (!response.path) {
          handleChange("uploading", false)
          // alert("Something went wrong")
        } else {
          const uri = response.path
          const uploadUri =
            Platform.OS === "ios" ? uri.replace("file://", "") : uri
          const photo = {
            uri: uploadUri,
            name: "userimage1.png",
            type: response.mime
          }
          handleChange("avatarSourceURL", uploadUri)
          handleChange("photo", photo)
          handleChange("uploading", false)
          handleChange("showAlert", false)
          Toast.show("Profile Add Successfully")
          // handleProfile(uri)
        }
      })
      .catch(err => {
        // alert("Something went wrong")
        handleChange("uploading", false)
      })
  }

  const handleProfile = async () => {
    try {
      handleChange("loading", true)
      const token = await AsyncStorage.getItem("token")
      const user = await AsyncStorage.getItem("user")
      const userData = JSON.parse(user)
      const formData = new FormData()
      formData.append("email", email)
      formData.append("name", name)
      formData.append("kitch.pickup", pickup)
      formData.append("kitch.dropoff", dropoff)
      about_us && formData.append("kitch.about_us", about_us)
      formData.append("kitch.phone", phone)
      photo && formData.append("kitch.photo", photo)
      // formData.append(
      //   "kitch.availability",
      //   moment.utc(selectedDate + " " + selectedTime).format("")
      // )
      formData.append("kitch.restaurant_name", restaurant_name)
      formData.append(
        "kitch.location",
        JSON.stringify({
          type: "Point",
          coordinates: location
        })
      )
      const res = await updateProfile(formData, userData?.id, token)
      handleChange("loading", false)
      await AsyncStorage.setItem("user", JSON.stringify(res?.data))
      navigation.navigate("Drawers")
    } catch (error) {
      handleChange("loading", false)
      const errorText = Object.values(error?.response?.data)
      if (errorText?.length > 0) {
        Toast.show(`Error: ${JSON.stringify(errorText[0])}`)
      } else {
        console.warn("err", error)
        Toast.show(`Error: ${error.message}`)
      }
    }
  }

  const handleSearch = (data, details) => {
    if (details?.geometry?.location) {
      setState(pre => ({
        ...pre,
        location: [
          details.geometry.location.lat,
          details.geometry.location.lng
        ],
        locationText: data.description
      }))
    }
  }

  console.warn("moment.utc(date", location)

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.body}>
        <View
          style={{
            width: "80%",
            marginBottom: 20,
            alignItems: "center"
          }}
        >
          {uploading ? (
            <ActivityIndicator color={COLORS.primary} size={"large"} />
          ) : (
            <>
              <TouchableOpacity onPress={_uploadImage}>
                {avatarSourceURL ? (
                  <Image
                    source={{ uri: avatarSourceURL }}
                    style={styles.profile}
                  />
                ) : (
                  <SvgXml xml={userIcon} width={100} height={100} />
                )}
              </TouchableOpacity>
            </>
          )}
          <Text
            style={{
              fontFamily: FONT1REGULAR,
              fontSize: hp(2),
              textAlign: "center",
              width: "100%"
            }}
          >
            Upload Image
          </Text>
          <View style={styles.textInputContainer}>
            <AppInput
              inputLabel={"Full Name"}
              marginBottom={20}
              fullBorder
              borderRadius={8}
              borderColor={COLORS.borderColor1}
              placeholder={"Full Name"}
              name={"name"}
              value={name}
              onChange={handleChange}
            />
          </View>
          <View style={styles.textInputContainer}>
            <AppInput
              inputLabel={"Restaurant/Workspace Name"}
              fullBorder
              borderRadius={8}
              marginBottom={20}
              borderColor={COLORS.borderColor1}
              placeholder={"Restaurant/Workspace Name"}
              name={"restaurant_name"}
              value={restaurant_name}
              onChange={handleChange}
            />
          </View>
          <View style={styles.textInputContainer}>
            {/* <AppInput
              inputLabel={"Location"}
              fullBorder
              borderRadius={8}
              marginBottom={20}
              borderColor={COLORS.borderColor1}
              placeholder={"Location"}
              name={"location"}
              value={location}
              onChange={handleChange}
            /> */}
            <Text style={styles.label}>{"Location"}</Text>
            <View style={[styles.searchView, { width: "100%" }]}>
              <GooglePlacesAutocomplete
                placeholder="Location"
                fetchDetails={true}
                onPress={(data, details) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(data, details)
                  handleSearch(data, details)
                }}
                textInputProps={{
                  value: locationText,
                  placeholderTextColor: COLORS.grey,
                  onChangeText: text =>
                    setState(pre => ({ ...pre, locationText: text }))
                }}
                styles={{
                  // container: styles.textInput,
                  textInput: {
                    backgroundColor: COLORS.backgroud,
                    borderWidth: 1,
                    borderColor: COLORS.borderColor1,
                    borderRadius: 8,
                    width: "100%",
                    paddingTop: 8,
                    color: COLORS.inputText,
                    fontSize: hp(1.6),
                    height: hp(6),
                    fontFamily: FONT1REGULAR
                  },
                  poweredContainer: { backgroundColor: COLORS.lightergrey },
                  row: { backgroundColor: COLORS.lightergrey }
                }}
                query={{
                  key: "AIzaSyA8qkmVxCJuE2_LSU14ogM1vjnoEsRi_Iw",
                  language: "en"
                }}
                GooglePlacesDetailsQuery={{
                  fields: "geometry"
                }}
                filterReverseGeocodingByTypes={[
                  "locality",
                  "administrative_area_level_3"
                ]}
                listViewDisplayed={false}
                renderRow={data => (
                  <View style={{ width: "100%" }}>
                    <Text style={{ color: COLORS.secondary }}>
                      {data.description}
                    </Text>
                  </View>
                )}
                debounce={200}
                currentLocation={false}
                currentLocationLabel="Current location"
                nearbyPlacesAPI="GooglePlacesSearch"
              />
            </View>
          </View>
          {/* <Text style={[styles.label, { marginVertical: 15 }]}>
            Set Date & time availabilty
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={styles.inputStyle}
              onPress={() => handleChange("open", true)}
            >
              <Text style={{ fontFamily: FONT1REGULAR, fontSize: hp(2) }}>
                {selectedDate || "MM/DD/YYYY"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputStyle}
              onPress={() => handleChange("open1", true)}
            >
              <Text style={{ fontFamily: FONT1REGULAR, fontSize: hp(2) }}>
                {selectedTime || "00:00"}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={open1}
              mode="time"
              // minimumDate={new Date()}
              date={time}
              onConfirm={date => {
                handleChange("open1", false)
                handleChange("time", date)
                handleChange("selectedTime", moment(date).format("hh:mm"))
              }}
              onCancel={() => {
                handleChange("open1", false)
              }}
            />
            <DatePicker
              modal
              open={open}
              mode="date"
              minimumDate={new Date()}
              date={date}
              onConfirm={date => {
                handleChange("open", false)
                handleChange("open1", false)
                handleChange("date", date)
                handleChange("selectedDate", moment(date).format("MM/DD/YYYY"))
              }}
              onCancel={() => {
                handleChange("open", false)
              }}
            />
          </View> */}
          <Text style={[styles.label, { marginTop: 10 }]}>Available For</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginBottom: 20
            }}
          >
            <BouncyCheckbox
              size={20}
              fillColor={COLORS.darkBlack}
              unfillColor={COLORS.white}
              disableBuiltInState
              isChecked={pickup}
              text="Pickup"
              style={{ marginRight: 20 }}
              innerIconStyle={{
                backgroundColor: pickup ? COLORS.primary : COLORS.white
              }}
              iconStyle={{ borderColor: COLORS.darkBlack, borderRadius: 20 }}
              textStyle={{
                fontFamily: FONT1REGULAR,
                fontSize: hp(2),
                color: COLORS.darkBlack,
                textDecorationLine: "none"
              }}
              onPress={() => handleChange("pickup", !pickup)}
            />
            <BouncyCheckbox
              size={20}
              fillColor={COLORS.darkBlack}
              unfillColor={COLORS.white}
              disableBuiltInState
              isChecked={dropoff}
              text="Drop Off"
              innerIconStyle={{
                backgroundColor: dropoff ? COLORS.primary : COLORS.white
              }}
              iconStyle={{ borderColor: COLORS.darkBlack, borderRadius: 20 }}
              textStyle={{
                fontFamily: FONT1REGULAR,
                fontSize: hp(2),
                color: COLORS.darkBlack,
                textDecorationLine: "none"
              }}
              onPress={() => handleChange("dropoff", !dropoff)}
            />
          </View>
          <View style={styles.textInputContainer}>
            <AppInput
              inputLabel={"More Details"}
              fullBorder
              borderRadius={8}
              marginBottom={20}
              borderColor={COLORS.borderColor1}
              placeholder={"More Details"}
              name={"about_us"}
              multiline
              height={100}
              value={about_us}
              onChange={handleChange}
            />
          </View>
          <View style={styles.textInputContainer}>
            <AppInput
              inputLabel={"Email Address"}
              fullBorder
              borderRadius={8}
              borderColor={COLORS.borderColor1}
              placeholder={"Email Address"}
              name={"email"}
              marginBottom={20}
              disabled
              value={email}
              onChange={handleChange}
            />
          </View>
          <View style={styles.textInputContainer}>
            <AppInput
              inputLabel={"Phone"}
              fullBorder
              borderRadius={8}
              borderColor={COLORS.borderColor1}
              placeholder={"Phone"}
              keyboardType="phone-pad"
              returnKeyType={"done"}
              name={"phone"}
              value={phone}
              onChange={handleChange}
            />
          </View>
          <AppButton
            disabled={
              !phone || !email || !location || !restaurant_name || !name
            }
            marginTop={30}
            loading={loading}
            onPress={handleProfile}
            title={"Submit"}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroud,
    width: "100%",
    height: "100%"
  },
  borderButton: {
    width: "90%",
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: COLORS.primary
  },
  label: {
    fontFamily: FONT1REGULAR,
    color: COLORS.black,
    width: "100%",
    fontSize: hp(2),
    marginBottom: 5
  },
  title: {
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2)
  },
  description: {
    fontFamily: FONT1REGULAR,
    fontSize: hp(1.8)
  },
  continue: {
    color: COLORS.black,
    fontFamily: FONT1MEDIUM,
    fontSize: hp(2),
    textAlign: "center",
    marginTop: hp(5)
  },
  body: {
    width: "100%",
    marginTop: 100,
    alignItems: "center",
    paddingTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: COLORS.white
  },
  slider: {
    alignItems: "center",
    width: "90%"
  },
  loadingText: {
    fontFamily: FONT1LIGHT,
    fontSize: hp(2),
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: "contain"
  },
  textInputContainer: {
    width: "100%"
  },
  inputStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    marginBottom: 10,
    height: hp(6),
    backgroundColor: COLORS.backgroud,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor1
  }
})

export default CreateProfile

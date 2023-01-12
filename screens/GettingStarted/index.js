import React, { createRef, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions
} from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import BG from "../../assets/images/onboard1.png"
import BG1 from "../../assets/images/onboard2.png"
import BG2 from "../../assets/images/onboard3.png"
import { AppButton } from "../../components"
import {
  COLORS,
  FONT1MEDIUM,
  FONT1REGULAR,
  FONT1SEMIBOLD
} from "../../constants"
import Carousel, { Pagination } from "react-native-snap-carousel"

function Welcome({ navigation }) {
  const sliderWidth = Dimensions.get("window").width
  let carouselRef = createRef()

  const [state, setState] = useState({
    entries: [
      {
        text: "Find The\nBest Food Online",
        text1:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: BG
      },
      {
        text: "Enjoy Meals From\nDifferent Vendors",
        text1:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: BG1
      },
      {
        text: "Get Delivery At\nYour Door Step",
        text1:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: BG2
      }
    ],
    activeSlide: 0
  })
  const { entries, activeSlide } = state
  const handleNavigate = (route, type) => {
    navigation.navigate(route, { isType: type })
  }

  const _renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        source={item.image}
        resizeMode="cover"
        style={styles.slide}
      >
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.text1}>{item.text1}</Text>
        </View>
        <View style={{ width: "100%", alignItems: "flex-start" }}>
          {pagination()}
        </View>
        <View style={styles.bottom}>
          <AppButton
            title={"Get Started"}
            onPress={() => handleNavigate("Welcome", 1)}
          />
          <AppButton
            title={"Skip"}
            backgroundColor={"transparent"}
            color={COLORS.grey}
            onPress={() => handleNavigate("Welcome", 0)}
          />
        </View>
      </ImageBackground>
    )
  }

  function pagination() {
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          width: 30,
          height: 5,
          borderRadius: 5,
          marginHorizontal: -8,
          backgroundColor: COLORS.primary
        }}
        inactiveDotStyle={{
          backgroundColor: COLORS.grey
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  return (
    <>
      <View style={styles.View_617_1877}>
        <View style={styles.top}>
          <Carousel
            layout={"default"}
            ref={e => {
              carouselRef = e
            }}
            onSnapToItem={index =>
              setState(pre => ({ ...pre, activeSlide: index }))
            }
            autoplay
            autoplayDelay={1000}
            loop
            style={{ marginTop: 30 }}
            data={entries}
            renderItem={_renderItem}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  View_617_1877: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  slide: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  top: {
    width: "90%",
    alignItems: "center"
  },
  text: {
    color: COLORS.white,
    width: "100%",
    fontSize: hp(3),
    fontFamily: FONT1MEDIUM
  },
  text1: {
    color: COLORS.white,
    width: "80%",
    fontSize: hp(2),
    fontFamily: FONT1REGULAR
  },
  bottom: {
    width: "90%",
    borderRadius: 13,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: hp(2),
    paddingHorizontal: 5
  },
  skipView: {
    width: "100%",
    alignItems: "flex-end"
  }
})

export default Welcome

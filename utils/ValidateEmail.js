import Toast from "react-native-simple-toast"

export const validateEmail = value => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isValid = pattern.test(String(value).toLowerCase())
  return isValid
}

export const validateName = value => {
  const pattern = /^[a-zA-Z ]+$/
  const isValid = pattern.test(String(value).toLowerCase())
  return isValid
}

export const validateWeight = value => {
  const pattern = /^-?((0(\.[0-9]+)?)|([1-9]+[0-9]*(\.[0-9]+)?))$/
  const isValid = pattern.test(String(value).toLowerCase())
  return isValid
}

export const getError = error => {
  const errorText = Object.values(error?.response?.data)
  console.warn("errorText", errorText[0])
  if (errorText?.length > 0) {
    if (errorText[0]?.length > 0) {
      Toast.show(`Error: ${JSON.stringify(errorText[0][0])}`)
    } else {
      Toast.show(`Error: ${JSON.stringify(errorText[0])}`)
    }
  } else {
    console.warn("error?.message", error?.message)
    Toast.show(`Error: ${JSON.stringify(error?.message)}`)
  }
}

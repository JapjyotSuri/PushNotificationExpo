import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { usePushNotifications } from '@/usePushNotification'

const index = () => {
  const {expoPushToken,notification}=usePushNotifications();
  const data=JSON.stringify(notification,undefined,2);//convertind the notification object to string.
  //undefined above means all the properties of the object will be present in the output
  //2 is the space argument which controls the identation of the string.If it is a number (like 2), it specifies the number of spaces to use as indentation in the output.If it is a string (e.g., "\t"), that string will be used as the indentation.
  
  return (
    <View style={styles.container}>
      <Text>Token: {expoPushToken?.data ?? ""}</Text>
      <Text>Notification: {data}</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
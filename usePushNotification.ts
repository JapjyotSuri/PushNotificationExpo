import * as Device from 'expo-device';//getting info about the device wether it is a physical device or simulator
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants"; 
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
export interface PushNotificationsState{
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;

}
export const usePushNotifications= () : PushNotificationsState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({//setting the settings on how a notification will look like
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        })
    })
    const [expoPushToken,setExpoPushToken]=useState< Notifications.ExpoPushToken | undefined>();
    const [notification,setNotification]=useState< Notifications.Notification | undefined>();
    
    //  expo notification Notifications.NotificationSubscription  type explicitly exported so we use type any in the below
    const notificationListner=useRef<any>();
    const responseListner=useRef<any>();

    async function registerForPushNotificationsAsync(){
        let token;
        if (Device.isDevice) {
            const {status: existingStatus} = await Notifications.requestPermissionsAsync();//this line will send request for notification and give the status of the permisiion status back
            let finalStatus=existingStatus;

            if(existingStatus !== 'granted'){
                const {status}=await Notifications.requestPermissionsAsync();//if permission is not granted we ask for permision again
                finalStatus=status
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification");
                return;
              }
              token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId,//project ID is a unique id given to each project automatically when we configure eas.
                //the above route we are taking from the app.json
              });
        } else {
            console.log('Do not run on simulator')
        }
        if (Platform.OS === "android") {//for android devices we write this to configure notification settings
            Notifications.setNotificationChannelAsync("default", {
              name: "default",
              importance: Notifications.AndroidImportance.MAX,//giving notification max visibility priority
              vibrationPattern: [0, 250, 250, 250],//giving it a custom vibration pattern
              lightColor: "#FF231F7C",//Giving it led light color
            });
          }
          console.log(token)
          return token;//return thr token
          //we simulate sending the request from https://expo.dev/notifications (in android put channel id as default)
      
    }
    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {//listner to get push token
            setExpoPushToken(token);
          });
      
          notificationListner.current =//listner to get notification
            Notifications.addNotificationReceivedListener((notification) => {
              setNotification(notification);
            });
      
          responseListner.current =//listner to get response
            Notifications.addNotificationResponseReceivedListener((response) => {
              console.log(response);
            });
      
          return () => {
            Notifications.removeNotificationSubscription(//cleaning up listner
              notificationListner.current!
            );
      
            Notifications.removeNotificationSubscription(responseListner.current!);
          };
    },[])
    return {
        expoPushToken,notification
    }
}

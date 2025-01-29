import { StyleSheet, Text, useAnimatedValue, View } from 'react-native'
import React from 'react'
import Back from '@/assets/icons/Back'
import BackButton from './BackButton'
import { routeToScreen } from 'expo-router/build/useScreens'
import { useRoute } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { theme } from '@/constants/theme'
import { hp } from '@/helper/common'

const Header = ({title, showBackButton=true}) => {
    const router = useRouter();
  return (
    <View style={styles.container}>
      {
        showBackButton && (
            <View style={styles.backbutton}>
                <BackButton router={router}/>
                </View>
  )
      }
      <Text style={styles.title}>{title || ""}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      gap: 10,
      marginBottom:20,
    },
    title: {
      fontSize: hp(2.7),
      fontWeight: theme.fonts.semibold,
      color: theme.colors.textDark,
    },
    backbutton:{
        position: 'absolute',
        left: 0,
    }
  });
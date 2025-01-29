import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Back from '@/assets/icons/Back'
import { theme } from '@/constants/theme'
const BackButton = ({router }) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
        <Back strokeWidth={2.5} height={34} width={34}/>
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-start',
      padding: 5,
      borderRadius: theme.radius.sm,
      backgroundColor: 'rgba(0,0,0,0.07)',
    },
  });
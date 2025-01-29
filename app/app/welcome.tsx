import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants/theme';
import Button from '@/components/Button';
import { hp, wp } from '@/helper/common';
import { useRouter } from 'expo-router';

const Welcome = () => {
    const router= useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Image
            style={styles.welcomeImage}
            resizeMode="contain"
            source={require('@/assets/images/logo.png')}
          />
          <Text style={styles.title}>ZYLO</Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Get Started"
            bg="black"
            onPress={() => router.push('/signin')}
            buttonStyle={{
              backgroundColor: 'black',
              borderRadius: hp(2),
              paddingHorizontal: wp(10),
              paddingVertical: hp(1.8),
            }}
          />
          <Text style={styles.loginText}>Already have an account!</Text>
          <Pressable onPress={() => {
            router.push('/login')
          }}>
            <Text style={[styles.loginText, styles.loginLink]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: wp(4),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    height: hp(30),
    width: wp(80),
    marginBottom: hp(2),
    alignSelf: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: 'center',
    fontWeight: theme.fonts.extraBold,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: hp(5), 
  },
  loginText: {
    fontSize: hp(2),
    color: theme.colors.text,
    marginTop: hp(2),
    textAlign: 'center',
  },
  loginLink: {
    color: 'black',
    fontWeight: 'bold',
    textDecorationLine: 'Bold',
  },
});

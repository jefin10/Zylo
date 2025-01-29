import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View,Alert } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helper/common';
import { supabase } from '@/lib/supabase';
const Signin = () => {
    
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [eemail, setEmail] = useState('');
  const [ppassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleSignup = async () => {
    
    let name = username.trim();
    let email = eemail.trim();
    let password = ppassword.trim();
    if (!username || !email || !password) {
        Alert.alert('Sign Up', "please fill all the fields!");
        return;
      }
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data: {
            name
        }
      }
    });
    setLoading(false);
  
    console.log('session: ', session);
    console.log('error: ', error);
    if (error) {
      Alert.alert('Sign up', error.message);
    }
  };


  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
        </View>

        <Text style={styles.caption}>Join Us and Explore!</Text>

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.colors.gray}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.gray}
            keyboardType="email-address"
            value={eemail}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.gray}
            secureTextEntry
            value={ppassword}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.gray}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Button
          title="Sign Up"
          bg="black"
          onPress={handleSignup}
          buttonStyle={styles.signupButton}
          loading={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    backgroundColor: 'white',
  },
  header: {
    marginTop: hp(2),
    alignSelf: 'flex-start',
  },
  caption: {
    fontSize: hp(3),
    color: theme.colors.gray,
    textAlign: 'center',
    marginVertical: hp(1),
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fonts.extraBold,
    textAlign: 'center',
    marginVertical: hp(1),
    color: theme.colors.text,
  },
  inputContainer: {
    marginTop: hp(2),
    gap: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    fontSize: hp(2.2),
    color: theme.colors.text,
  },
  signupButton: {
    marginTop: hp(3),
    borderRadius: theme.radius.xl,
  },
});

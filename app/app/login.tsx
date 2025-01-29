import React,{useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helper/common';
import { supabase } from '@/lib/supabase';
const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [eemail, setEmail] = useState(''); 
  const [ppassword, setPassword] = useState(''); 
  const handleLogin = async () => {
    let email = eemail;
    let password = ppassword;
    if (!email || !password) {
        Alert.alert('Missing Fields', 'Please provide both email and password.');
        return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    });
    setLoading(false);

    console.log('error: ', error);
    if (error) {
    Alert.alert('Login', error.message);
    }
    
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password option selected');
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
        </View>

        <Text style={styles.caption}>Hey, Welcome Back!</Text>

        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
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
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Login"
          bg="black"
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          loading={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: hp(0.5),
  },
  forgotPasswordText: {
    fontSize: hp(2),
    color: "#D3D3D3",
    fontWeight: theme.fonts.bold,
  },
  loginButton: {
    marginTop: hp(3),
    borderRadius: theme.radius.xl,
  },
});

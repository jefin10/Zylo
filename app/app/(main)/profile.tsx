import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helper/common';
import Button from '@/components/Button';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import Avatar from '@/components/Avatar';
import Edit from '@/assets/icons/Edit';

const Profile = () => {
  const {user,setAuth}  = useAuth();
  const router = useRouter();
  const onLogout = async () => {
    setAuth(null);
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign out', 'Error signing out!');
    }
  };
  
  const handleLogout = async () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancelled'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };
  
  return (
    <ScreenWrapper>
      <UserHeader user={user} router = {router} handleLogout={handleLogout}/>
    </ScreenWrapper>
  )
}
const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
      <View>
        <Header title="Profile" showBackButton={true} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
  <View style={{ gap: 15 }}>
    <View style={styles.avatarContainer}>
      <Avatar
        uri={user?.image}
        size={hp(12)}
        rounded={theme.radius.xxl * 1.4}
      />
      <Pressable style={styles.editIcon} onPress={() => router.push('/editProfile')}>
    <Edit/>
</Pressable>
    </View>
    
  </View>
</View>
    </View>
  ); 
};


export default Profile;
const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    margin:hp(1),
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sn,
    backgroundColor: 'red',
    borderRadius:10,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
})
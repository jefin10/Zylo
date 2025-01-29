import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';
import { hp, wp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Heart from '@/assets/icons/Heart';
import Plus from '@/assets/icons/Plus';
import User from '@/assets/icons/User';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Avatar from '@/components/Avatar';
const Home = (user) => {
    const { setAuth } = useAuth();
    const router = useRouter();
    const onLogout = async () => {
      setAuth(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign out', 'Error signing out!');
      }
    };
    return (
      <ScreenWrapper bg={"white"}>
        <View style={styles.header}>
            <View style={styles.container}>
                <Text style={styles.title}>ZYLO</Text>
                <View style={styles.icons}>
                    <Pressable onPress={() => router.push('/notifications')}>

                    
                    <Heart width={30} height={30} onPress={() => router.push('/notifications')}/>
                    </Pressable>
                    <Pressable >
                    <Plus width={30} height={30} onPress={() => router.push('/newPost')}/>
                    </Pressable>
                    <Pressable onPress={() => router.push('/profile')}>
                    <Avatar 
                      url={user?.image}
                      size = {hp(4.3)}
                    
                    />
                    </Pressable>
                </View>
            </View>
        </View>
        <Button title="logout" onPress={onLogout} />
      </ScreenWrapper>
    );
  };

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
        flexDirection:"row",
        justifyContent:"space-between"
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4)
      },
      title: {
        color: theme.colors.text,
        fontSize: hp(4),
        fontWeight: theme.fonts.bold
      },
      avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3
      },
      icons: {
        flexDirection: 'row',
        justifyContent:"center",
        alignItems:"center",
        gap: wp(3)
      },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
      },
      noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text
      },
      pill: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight
      },
      pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
      }
})
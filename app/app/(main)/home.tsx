import { Alert, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';
import { hp, wp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Heart from '@/assets/icons/Heart';
import Plus from '@/assets/icons/Plus';
import { useRouter } from 'expo-router';
import Avatar from '@/components/Avatar';

const Home = () => {
    const { user, setAuth } = useAuth();
    const router = useRouter();
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
      const fetchTweets = async () => {
        const { data, error } = await supabase
          .from("tweets")
          .select("id, tweet,userId, created_at, likes ")
          .order("created_at", { ascending: false });
          

        if (error) {
          console.error("Error fetching tweets:", error);
        } else {
          setTweets(data);
        }
      };

      fetchTweets();
    }, []);

    const postTweet = async () => {
      if (!tweet.trim()) return;

      const { data, error } = await supabase
        .from("tweets")
        .insert([{ userId: user.id, tweet: tweet}]);

      if (error) {
        Alert.alert("Error", "Could not post tweet.");
      } else {
        setTweets([data[0], ...tweets]);
        setTweet('');
      }
    };
    const onLogout = async () => {
      setAuth(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign out', 'Error signing out!');
      }
    };
    const fetchUserName = async (userId) => {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single(); 
    
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        return data?.name || "Unknown"; 
      }
    };

    return (
      <ScreenWrapper bg={"white"}>
        <View style={styles.header}>
          <View style={styles.container}>
            <Text style={styles.title}>ZYLO</Text>
            <View style={styles.icons}>
              
              
              
              
              <Pressable onPress={() => router.push('/profile')}>
                <Avatar url={user?.image} size={hp(4.3)} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.tweetInputContainer}>
          <TextInput
            style={styles.tweetInput}
            placeholder="What's on your mind?"
            value={tweet}
            onChangeText={setTweet}
          />
          <Button title="Post" onPress={postTweet} bg={"black"}/>
        </View>

        <FlatList
  data={tweets}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.tweetCard}>
      <Text style={styles.username}>{fetchUserName(item.userId)}</Text>  
      <Text>{item.tweet}</Text>
      <Pressable onPress={() => updateLikes(item.id, item.likes)}>
        <Text>❤️ {item.likes}</Text>
      </Pressable>
    </View>
  )}
/>


      
        
      </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: wp(3),
  },
  tweetInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: 10,
  },
  tweetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.sm,
    padding: 10,
    marginRight: 10,
  },
  tweetCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  username: {
    fontWeight: "bold",
  },
});

import { Alert, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';
import { hp, wp } from '@/helper/common';
import { theme } from '@/constants/theme';
import Heart from '@/assets/icons/Heart';
import Plus from '@/assets/icons/Plus';
import { useFocusEffect, useRouter } from 'expo-router';
import Avatar from '@/components/Avatar';
import {person} from '@/assets/images/person.png'
const Home = () => {
    const { user, setAuth } = useAuth();
    const router = useRouter();
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);
    const [users, setUsers] = useState({});

    const fetchTweets = useCallback(async () => {
        const { data, error } = await supabase
            .from("tweets")
            .select("id, tweet, userId, created_at, likes")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching tweets:", error);
        } else {
            setTweets(data);
            fetchUserNames(data);
        }
    }, []);
    useFocusEffect(
      useCallback(() => {
          fetchTweets();
          return () => {
              // Optional cleanup if needed
          };
      }, [fetchTweets])
  );
    const fetchUserNames = async (tweets) => {
        const userIds = tweets.map(tweet => tweet.userId);
        const { data, error } = await supabase
            .from("users")
            .select("id, name")
            .in("id", userIds);

        if (error) {
            console.error("Error fetching users:", error);
        } else {
            const usersMap = data.reduce((acc, user) => {
                acc[user.id] = user.name;
                return acc;
            }, {});
            setUsers(usersMap);
        }
    };

    useEffect(() => {
        fetchTweets();
    }, [fetchTweets]);

    const postTweet = async () => {
      if (!tweet.trim()) return;
  
      const { data, error } = await supabase
          .from("tweets")
          .insert([{ userId: user.id, tweet: tweet }])
          .select("id, tweet, userId, created_at, likes");
  
      if (error) {
          Alert.alert("Error", "Could not post tweet.");
      } else {
          setTweets([data[0], ...tweets]); 
          setTweet('');
      }
  };
  const addTweets = (text) => {
      setTweet(text);
  };
  
    const onLogout = async () => {
        setAuth(null);
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Sign out', 'Error signing out!');
        }
    };

    const [likedTweets, setLikedTweets] = useState({});

const updateLikes = async (tweetId, currentLikes) => {
    const alreadyLiked = likedTweets[tweetId] || false;
    const newLikes = alreadyLiked ? currentLikes - 1 : currentLikes + 1;

    const { error } = await supabase
        .from("tweets")
        .update({ likes: newLikes })
        .eq("id", tweetId);

    if (error) {
        console.error("Error updating likes:", error);
    } else {
        setTweets(tweets.map(tweet =>
            tweet.id === tweetId ? { ...tweet, likes: newLikes } : tweet
        ));
        setLikedTweets({ ...likedTweets, [tweetId]: !alreadyLiked });
    }
};

    const renderTweet = ({ item }) => (
      <View style={styles.tweetCard}>
        <View style={styles.tweetHeader}>
        <Text style={styles.username}>{users[item.userId] || "Unknown"}</Text>
        <Pressable onPress={() => updateLikes(item.id, item.likes)} style={styles.likeButton}>
              <Heart width={24} height={24} fill={likedTweets[item.id] ? "red" : "gray"} />
              <Text style={styles.likeText}>{item.likes}</Text>
          </Pressable>
        </View>
          
          <Text style={styles.tweetText}>{item.tweet}</Text>
          
      </View>
  );

    return (
        <ScreenWrapper bg={"white"}>
            <View style={styles.header}>
                <View style={styles.container}>
                    <Text style={styles.title}>ZYLO</Text>
                    <View style={styles.icons}>
                        <Pressable onPress={() => router.push('/profile')}>
                            <Avatar url={person} size={hp(4.3)} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.tweetInputContainer}>
                <TextInput
                    style={styles.tweetInput}
                    placeholder="What's on your mind?"
                    value={tweet}
                    onChangeText={addTweets}
                    multiline
                />
                <Button title="Post" onPress={postTweet} bg={"black"} buttonStyle={styles.postButton}/>
            </View>

            <FlatList
                data={tweets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTweet}
                contentContainerStyle={styles.flatListContent}
            />
        </ScreenWrapper>
    );
};

export default React.memo(Home);

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
  tweetHeader:{
    flexDirection:"row",
    justifyContent:"space-between"
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
      minHeight: hp(8),
      backgroundColor: theme.colors.lightGray, 
  },
  postButton:{
    borderRadius: theme.radius.xl,
    width: wp(23)

  },
  flatListContent: {
      paddingBottom: hp(2),
      paddingHorizontal: wp(4),
  },
  tweetCard: {
      padding: 15,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.white,
      marginBottom: hp(1.5),
      borderWidth: 3,
      borderColor: theme.colors.gray,
  },
  username: {
      fontWeight: "bold",
      fontSize: hp(2),
      color: "black",
      marginBottom: hp(0.5),
  },
  tweetText: {
      fontSize: hp(1.8),
      color: "gray",
      marginBottom: hp(1),
  },
  likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(0.5),
      paddingHorizontal: wp(2),
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.lightGray, // Light button background
      alignSelf: 'flex-start', // Align left
  },
  likeText: {
      fontSize: hp(1.8),
      color: theme.colors.darkGray,
      marginLeft: wp(1),
  },
});

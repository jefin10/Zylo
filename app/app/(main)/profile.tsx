import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useRouter } from 'expo-router'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { hp, wp } from '@/helper/common'
import { theme } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import Avatar from '@/components/Avatar'
import Heart from '@/assets/icons/Heart'
import Delete from '@/assets/icons/Delete'
const Profile = () => {
  const { user, setAuth } = useAuth()
  const router = useRouter()
  const [tweets, setTweets] = useState([])
  const [users, setUsers] = useState({})
  const [likedTweets, setLikedTweets] = useState({})
  const [userName, setUserName] = useState("Unknown")

  const fetchUserName = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
    } else {
      return data?.name || "Unknown"
    }
  }, [])

  const fetchTweets = useCallback(async () => {
    const { data, error } = await supabase
      .from("tweets")
      .select("id, tweet, userId, created_at, likes")
      .eq("userId", user?.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tweets:", error)
    } else {
      setTweets(data)
      const userIds = [...new Set(data.map(tweet => tweet.userId))]
      const userNames = {}
      await Promise.all(userIds.map(async (id) => {
        userNames[id] = await fetchUserName(id)
      }))
      setUsers(userNames)
    }
  }, [user?.id, fetchUserName])

  const updateLikes = async (tweetId, currentLikes) => {
    const newLikeCount = likedTweets[tweetId] ? currentLikes - 1 : currentLikes + 1
    
    const { error } = await supabase
      .from("tweets")
      .update({ likes: newLikeCount })
      .eq("id", tweetId)

    if (!error) {
      setLikedTweets(prev => ({
        ...prev,
        [tweetId]: !prev[tweetId]
      }))
      fetchTweets() 
    }
  }

  useEffect(() => {
    fetchTweets()
    if (user?.id) {
      fetchUserName(user.id).then(name => setUserName(name))
    }
  }, [fetchTweets, user?.id, fetchUserName])

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Sign out', 'Error signing out!')
    } else {
      setAuth(null)
    }
  }
  const handleDeleteTweet = async (tweetId) => {
    Alert.alert(
      'Delete Tweet',
      'Are you sure you want to delete this tweet?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('tweets')
              .delete()
              .eq('id', tweetId)
              .eq('userId', user?.id)

            if (error) {
              Alert.alert('Error', 'Failed to delete tweet')
              console.error('Error deleting tweet:', error)
            } else {
              fetchTweets()
            }
          },
        },
      ]
    )
  }
  const handleLogout = () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancelled'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: onLogout,
        style: 'destructive',
      },
    ])
  }

  const renderTweet = ({ item }) => (
    <View style={styles.tweetCard}>
      
      <Text style={styles.tweetText}>{item.tweet}</Text>
      <View style={styles.tweetHeader}>
        
        <Pressable onPress={() => updateLikes(item.id, item.likes)} style={styles.likeButton}>
          <Heart width={24} height={24} fill={likedTweets[item.id] ? "red" : "gray"} />
          <Text style={styles.likeText}>{item.likes}</Text>
        </Pressable>
        <Pressable onPress={() => handleDeleteTweet(item.id)}>
        <Delete />

        </Pressable>
      </View>
    </View>
  )

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4) }}>
        <View>
          <Header title="Profile" showBackButton={true} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>Your Zings, {userName}</Text>
          </View>
        </View>
        <FlatList
          data={tweets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTweet}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  userInfo: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  email: {
    fontSize: hp(2),
    color: theme.colors.darkGray,
    fontWeight: '500',
    marginTop: hp(1),
  },
  name: {
    fontSize: hp(2.3),
    fontWeight: 'bold',
    color: 'black',
    margin: hp(0.5),
    marginBottom: hp(3),
  },
  logoutButton: {
    position: 'absolute',
    margin: hp(1),
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'black',
    borderRadius: theme.radius.sm,
  },
  tweetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    backgroundColor: theme.colors.lightGray,
    alignSelf: 'flex-start',
  },
  likeText: {
    fontSize: hp(1.8),
    color: theme.colors.darkGray,
    marginLeft: wp(1),
  },
})

export default Profile
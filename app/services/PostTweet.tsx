export const postTweet = async (userId, content) => {
    const { data, error } = await supabase
      .from("tweets")
      .insert([{ userId: userId, content}]);
  
    if (error) {
      console.error("Error posting tweet:", error);
    }
    return data;
  };
  
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helper/common';
import Loading from './Loading';

const Button = ({
  buttonStyle,
  textStyle,
  title = '',
  bg,
  onPress = () => {},
  loading = false,
  hasShadow = true,
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, { backgroundColor: bg }, hasShadow && shadowStyle]}
    >
      {loading ? (
        <Loading size="small" color="white" /> // Show loading spinner inside the button
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text> // Show text when not loading
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: hp(6.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.xl,
  },
  text: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: theme.fonts.bold,
  },
});

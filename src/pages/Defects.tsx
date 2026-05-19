import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';

const Defects = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <TopHeader
        onBackPress={() => navigation.goBack()}
        title="Defects"
        showLogout={true}
      />
      <ScrollView contentContainerStyle={styles.content} />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
});

export default Defects;

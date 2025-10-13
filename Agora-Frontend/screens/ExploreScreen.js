import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Cards';
import Tag from '../components/Tag';
import Banner from '../components/Banner';

const BASE_URL = "http://192.168.8.15:9000/Agora";

const ExploreScreen = () => {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Vehicle', 'Device', 'Furniture', 'Stationery', 'Cloth' ];

    const handleCategoryPress = (category) => {
        navigation.navigate("CategoryScreen", { category });
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${BASE_URL}/listing/all`);
                const data = await res.json();
                const formatted = data.map(item => ({
                    id: item.id,
                    price: `₹ ${item.price}`,
                    name: item.title,
                    images: item.image
                        ? [{ uri: item.image }]
                        : [require('../assets/LW.jpg')],
                    description: item.description,
                    seller: item.seller,
                    college: item.college,
                }));

                setItems(formatted);
            } catch (err) {
                console.error("Error fetching items:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Welcome Back</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ marginRight: 16 }}
                            onPress={() => navigation.navigate('Search')}
                        >
                            <Icon name="search-outline" size={24} color="#000" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                            <Icon name="notifications-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Banner */}
                <Banner
                    source={require('../assets/banner.jpg')}
                />

                {/* Categories */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Categories</Text>
                    <TouchableOpacity>
                        <Text style={{ color: '#808080' }}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    {categories.map((category) => (
                        <Tag
                            key={category}
                            label={category}
                            onPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </ScrollView>

                {/* Recommended */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Recommended</Text>
                    <TouchableOpacity>
                        <Icon name="options-outline" size={22} color="#808080" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#008CFE" style={{ marginTop: 40 }} />
                ) : (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {items.map(item => (
                            <Card key={item.id} item={item} />
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView >
    );
};

export default ExploreScreen;

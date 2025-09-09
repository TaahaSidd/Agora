import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const ExploreScreen = () => {
    const categories = ['Vehicles', 'Devices', 'Furniture', 'Stationery'];
    const recommendedItems = [
        { id: 1, price: '₹ 5,000', name: 'Nike Shoes', image: require('../assets/nikeshoes.jpg') },
        { id: 2, price: '₹ 1200', name: 'Sofa Seat', image: require('../assets/sofaseat.jpg') },
        { id: 3, price: '₹ 20000', name: 'Ps5 Console', image: require('../assets/ps5console.jpg') },
        { id: 4, price: '₹ 4500', name: 'Headphones', image: require('../assets/headphones.jpg') },
        { id: 5, price: '₹ 4500', name: 'Headphones', image: require('../assets/headphones.jpg') },
        { id: 6, price: '₹ 4500', name: 'Headphones', image: require('../assets/headphones.jpg') },

    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <ScrollView contentContainerStyle={{ padding: 16 }}>

                {/* Header: Welcome + Icons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Welcome Back</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 16 }}>
                            <Icon name="search-outline" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="notifications-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Banner Image */}
                <Image
                    source={require('../assets/banner.jpg')}
                    style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: 20 }}
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
                        <TouchableOpacity
                            key={category}
                            style={{
                                backgroundColor: '#66BBFF',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recommended Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Recommended</Text>
                    <TouchableOpacity>
                        <Icon name="options-outline" size={22} color="#808080" />
                    </TouchableOpacity>
                </View>

                {/* Recommended Items */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {recommendedItems.map((item) => (
                        <View
                            key={item.id}
                            style={{
                                width: '47%',
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                marginBottom: 15,
                                padding: 12,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{ width: '100%', height: 100, borderRadius: 10, marginBottom: 8 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.price}</Text>
                            <Text>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExploreScreen;

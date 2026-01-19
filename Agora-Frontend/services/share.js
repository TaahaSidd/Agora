import {Alert, Share} from 'react-native';

export const shareItem = async ({type, title, id}) => {
    try {

        const SITE_URL = 'https://spicalabs.netlify.app/products/agora';
        let message = '';

        if (type === 'LISTING') {
            message = `🔥 Check out this deal on Agora: "${title}"\n\nView it here: ${SITE_URL}?listingId=${id}`;
        } else if (type === 'USER') {
            message = `Check out ${title}'s profile on Agora!\n\nConnect here: ${SITE_URL}?userId=${id}`;
        }

        await Share.share({
            message: message,
            title: 'Agora Campus Marketplace',
        });
    } catch (error) {
        Alert.alert('Error', 'Failed to share. Try again.');
        console.error(error);
    }
};
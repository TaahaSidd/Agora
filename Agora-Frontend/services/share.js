import { Share, Alert } from 'react-native';

export const shareItem = async ({ type, title, id }) => {
    try {
        let message = '';

        if (type === 'LISTING') {
            message = `Check out this listing: ${title}\nhttps://studex.com/listing/${id}`;
        } else if (type === 'USER') {
            message = `Check out this user: ${title}\nhttps://studex.com/user/${id}`;
        }

        await Share.share({ message });
    } catch (error) {
        Alert.alert('Error', 'Failed to share. Try again.');
        console.error(error);
    }
};

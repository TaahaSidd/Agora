export const formatPrice = (price) => {

    let numericPrice = price;

    if (typeof price === 'string') {
        numericPrice = price.replace(/[^0-9]/g, '');
        numericPrice = Number(numericPrice);
    }

    if (isNaN(numericPrice) || numericPrice === 0) {
        return 'N/A';
    }

    return `₹${numericPrice.toLocaleString('en-IN')}`;
};
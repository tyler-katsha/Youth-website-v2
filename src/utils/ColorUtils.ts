export const ColorUtil = () => {

    const colors = ['#EF4444','#10B981','#F59E0B','#06B6D4','#3B82F6'];

    const storedColor = sessionStorage.getItem('profilePictureColor');

    if (storedColor) {
        return storedColor;
    }

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    sessionStorage.setItem('profilePictureColor', randomColor);

    return randomColor;
}
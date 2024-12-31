const button = document.getElementById('resizeButton');

button.addEventListener('click', function() {
    const currentWidth = button.offsetWidth;
    const currentHeight = button.offsetHeight;

    const newWidth = currentWidth * 1.5; // increase width by 50%
    const newHeight = currentHeight * 1.5; // increase height by 50%

    button.style.width = `${newWidth}px`;
    button.style.height = `${newHeight}px`;
});

// Close the CAPTCHA modal when the close button is clicked
const closeModal = document.getElementById('closeModal');
closeModal.onclick = function() {
    document.getElementById('captchaModal').style.display = 'none';
};

// Close the CAPTCHA modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === document.getElementById('captchaModal')) {
        document.getElementById('captchaModal').style.display = 'none';
    }
};

// Listen for the message from the CAPTCHA page
window.addEventListener('message', function(event) {
    if (event.data === 'CAPTCHA_SUCCESS') {
        // Close the modal and redirect to home.html
        document.getElementById('captchaModal').style.display = 'none';
        window.location.href = '../html/home.html';
    }
});
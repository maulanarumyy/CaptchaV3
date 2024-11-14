function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate the credentials
    if (username === 'admin' && password === 'admin') {
        // Randomly select one of the CAPTCHA pages (page1.html to page3.html)
        const captchaPages = ['../pages/page1.html', '../pages/page2.html', '../pages/page3.html'];
        const randomPage = captchaPages[Math.floor(Math.random() * captchaPages.length)];

        // Load the selected CAPTCHA page into the modal
        document.getElementById('captcha-content').innerHTML = `<iframe src="${randomPage}" frameborder="0" style="width:100%; height:600px; border: none; overflow: auto;"></iframe>`;
        document.getElementById('captchaModal').style.display = 'block';
    } else {
        // Show error message if credentials are incorrect
        document.getElementById('error-message').textContent = 'Invalid username or password. Please try again.';
        document.getElementById('error-message').style.color = 'red';
    }
}

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

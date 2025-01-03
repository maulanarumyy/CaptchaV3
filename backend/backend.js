// Daftar halaman CAPTCHA
const captchaPages = [
    "page1.html",
    "page2.html",
    "page3.html",
    "page4.html",
    "page5.html"
];

// Fungsi saat halaman dimuat
window.onload = function () {
    // Pastikan halaman baru dipilih saat refresh
    handleRefreshToNewCaptcha();

    const visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];
    if (!visitedPages.includes(window.location.pathname)) {
        visitedPages.push(window.location.pathname);
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }

    // Jika belum ada jumlah kesalahan di localStorage, set ke 0
    if (!localStorage.getItem("wrongAttempts")) {
        localStorage.setItem("wrongAttempts", "0");
    }

    // Jika CAPTCHA terkunci, tampilkan kunci
    if (localStorage.getItem("isLocked") === "true") {
        startLockTimer(30, false);
    } else {
        startCaptchaTimer(30); // Mulai timer CAPTCHA (30 detik)
    }
};

// Fungsi untuk menangani refresh halaman
function handleRefreshToNewCaptcha() {
    const visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];
    const currentPage = window.location.pathname;

    // Filter halaman yang belum dikunjungi
    const availablePages = captchaPages.filter(page => page !== currentPage);

    if (availablePages.length > 0) {
        const nextPage = availablePages[Math.floor(Math.random() * availablePages.length)];
        visitedPages.push(nextPage);
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));

        // Redirect ke halaman CAPTCHA lainnya
        setTimeout(() => {
            window.location.href = nextPage;
        }, 1000); // Redirect setelah 1 detik
    }
}

// Fungsi memeriksa jawaban
function checkAnswer(answer, correctAnswer) {
    const successMessage = document.getElementById("success");
    const errorMessage = document.getElementById("error");

    if (answer === correctAnswer) {
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        localStorage.setItem("wrongAttempts", "0"); // Reset kesalahan
        redirectToSuccessPage();
    } else {
        let wrongAttempts = parseInt(localStorage.getItem("wrongAttempts") || "0");
        wrongAttempts++;
        localStorage.setItem("wrongAttempts", wrongAttempts.toString());

        errorMessage.style.display = "block";
        successMessage.style.display = "none";

        if (wrongAttempts >= 3) {
            localStorage.setItem("isLocked", "true");
            startLockTimer(30, true); // Timeout 30 detik
        } else {
            redirectToNextCaptcha();
        }
    }
}

// Fungsi untuk memulai timer CAPTCHA (30 detik)
function startCaptchaTimer(duration) {
    let timeRemaining = duration;
    const timerDisplay = document.getElementById("captcha-timer-display");
    timerDisplay.style.display = "block";
    timerDisplay.textContent = `Waktu tersisa: ${timeRemaining} detik`;

    captchaTimer = setInterval(() => {
        timeRemaining--;
        if (timeRemaining > 0) {
            timerDisplay.textContent = `Waktu tersisa: ${timeRemaining} detik`;
        } else {
            clearInterval(captchaTimer);
            timerDisplay.textContent = "Waktu habis! Silakan ulangi.";
            redirectToNextCaptcha(); // Pindah CAPTCHA jika waktu habis
        }
    }, 1000);
}

// Fungsi untuk memulai timeout (30 detik)
function startLockTimer(duration, resetLockStatus) {
    let timeRemaining = duration;
    const lockMessage = document.getElementById("lock-message");
    lockMessage.style.display = "block";
    lockMessage.textContent = `Anda terkunci selama ${timeRemaining} detik`;

    lockTimer = setInterval(() => {
        timeRemaining--;
        if (timeRemaining > 0) {
            lockMessage.textContent = `Anda terkunci selama ${timeRemaining} detik`;
        } else {
            clearInterval(lockTimer);
            if (resetLockStatus) {
                localStorage.setItem("isLocked", "false");
                localStorage.setItem("wrongAttempts", "0");
            }
            lockMessage.style.display = "none";
            redirectToNextCaptcha(); // Lanjutkan ke CAPTCHA berikutnya
        }
    }, 1000);
}

// Fungsi untuk mengarahkan ke halaman CAPTCHA lainnya
function redirectToNextCaptcha() {
    const visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];
    const availablePages = captchaPages.filter(page => !visitedPages.includes(page));

    if (availablePages.length > 0) {
        const nextPage = availablePages[Math.floor(Math.random() * availablePages.length)];
        visitedPages.push(nextPage);
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
        setTimeout(() => {
            window.location.href = nextPage;
        }, 1000);
    } else {
        redirectToFirstCaptcha();
    }
}

// Fungsi untuk mengarahkan ke halaman CAPTCHA pertama
function redirectToFirstCaptcha() {
    localStorage.removeItem("visitedPages");
    window.location.href = captchaPages[0];
}

// Fungsi untuk mengarahkan ke halaman sukses
function redirectToSuccessPage() {
    window.location.href = "https://mathewsin.github.io/CaptchaTester/"; // Ganti dengan halaman sukses Anda
}

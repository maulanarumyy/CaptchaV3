// Daftar halaman CAPTCHA (termasuk halaman 5)
const captchaPages = [
    "page1.html",
    "page2.html",
    "page3.html",
    "page4.html"
];

// Variabel global
let isLocked = false;
let lockTimer;
let captchaTimer;

// Fungsi saat halaman dimuat
window.onload = function () {
    const visitedPages = JSON.parse(localStorage.getItem("visitedPages")) || [];
    if (!visitedPages.includes(window.location.pathname)) {
        visitedPages.push(window.location.pathname);
        localStorage.setItem("visitedPages", JSON.stringify(visitedPages));
    }

    // Jika belum ada jumlah kesalahan di localStorage, set ke 0
    if (!localStorage.getItem("wrongAttempts")) {
        localStorage.setItem("wrongAttempts", "0");
    }

    // Cek apakah sudah terkunci
    if (localStorage.getItem("isLocked") === "true") {
        startLockTimer(15, false); // Lanjutkan timeout jika terkunci
    } else {
        // Mulai timer untuk menjawab (30 detik)
        startCaptchaTimer(30);
    }

    // Pilih halaman CAPTCHA secara acak pada refresh
    redirectToRandomCaptcha();
};

// Fungsi memeriksa jawaban
function checkAnswer(answer, correctAnswer) {
    const successMessage = document.getElementById("success");
    const errorMessage = document.getElementById("error");
    const lockMessage = document.getElementById("lock-message");
    const timerDisplay = document.getElementById("captcha-timer");

    if (isLocked) {
        alert("CAPTCHA terkunci. Silakan tunggu hingga timeout selesai.");
        return;
    }

    if (answer === correctAnswer) {
        successMessage.style.display = "block";
        errorMessage.style.display = "none";
        timerDisplay.style.display = "none"; // Sembunyikan timer
        clearInterval(captchaTimer); // Hentikan timer
        localStorage.setItem("wrongAttempts", "0"); // Reset kesalahan jika jawaban benar
        redirectToSuccessPage();
    } else {
        // Tambah jumlah kesalahan di localStorage
        let wrongAttempts = parseInt(localStorage.getItem("wrongAttempts") || "0");
        wrongAttempts++;
        localStorage.setItem("wrongAttempts", wrongAttempts.toString());

        errorMessage.style.display = "block";
        successMessage.style.display = "none";

        if (wrongAttempts >= 3) {
            // Hentikan timer dan aktifkan timeout
            timerDisplay.style.display = "none"; // Sembunyikan timer selama timeout
            clearInterval(captchaTimer);
            localStorage.setItem("isLocked", "true"); // Tandai terkunci
            startLockTimer(15, true); // Timeout 15 detik
        } else {
            redirectToNextCaptcha(); // Arahkan ke CAPTCHA lainnya
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
            isLocked = true; // Kunci CAPTCHA jika waktu habis
            timerDisplay.textContent = "Waktu habis! Silakan ulangi.";
            setTimeout(() => {
                location.reload(); // Muat ulang halaman setelah 5 detik
            }, 5000);
        }
    }, 1000);
}

// Fungsi untuk memulai timeout (15 detik)
function startLockTimer(duration, resetLockStatus) {
    let timeRemaining = duration;
    isLocked = true; // Kunci CAPTCHA

    const lockMessage = document.getElementById("lock-message");
    lockMessage.style.display = "block";
    lockMessage.textContent = `Anda terkunci selama ${timeRemaining} detik`;

    lockTimer = setInterval(() => {
        timeRemaining--;
        if (timeRemaining > 0) {
            lockMessage.textContent = `Anda terkunci selama ${timeRemaining} detik`;
        } else {
            clearInterval(lockTimer);
            isLocked = false; // Buka akses setelah timeout selesai
            if (resetLockStatus) {
                localStorage.setItem("isLocked", "false"); // Reset status terkunci
                localStorage.setItem("wrongAttempts", "0"); // Reset jumlah kesalahan
            }
            lockMessage.style.display = "none";
            redirectToFirstCaptcha(); // Arahkan ke CAPTCHA awal
        }
    }, 1000);
}

// Fungsi untuk mengarahkan ke halaman CAPTCHA pertama
function redirectToFirstCaptcha() {
    localStorage.removeItem("visitedPages"); // Reset daftar halaman yang dikunjungi
    window.location.href = captchaPages[0]; // Arahkan ke halaman CAPTCHA pertama
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
        redirectToFirstCaptcha(); // Jika semua halaman telah dikunjungi, ulangi dari awal
    }
}

// Fungsi untuk mengarahkan ke halaman CAPTCHA acak
function redirectToRandomCaptcha() {
    const randomPage = captchaPages[Math.floor(Math.random() * captchaPages.length)];
    setTimeout(() => {
        window.location.href = randomPage;
    }, 1000);
}

// Fungsi untuk mengarahkan ke halaman sukses (jika diperlukan)
function redirectToSuccessPage() {
    window.location.href = "https://mathewsin.github.io/CaptchaTester/"; // Ganti dengan halaman sukses Anda
}

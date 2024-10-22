from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import random
import time

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Gantilah dengan secret key yang aman

# Daftar kata kunci dan gambar terkait
captcha_data = {
    'Tree': ['tree.jpg', 'car.jpg', 'house.jpg', 'bird.jpg'],
    'Cat': ['dog.jpg', 'cat.jpg', 'fish.jpg', 'rabbit.jpg'],
    'Sun': ['moon.jpg', 'sun.jpg', 'star.jpg', 'cloud.jpg'],
}

# Jawaban benar untuk setiap kata kunci
correct_answers = {
    'Tree': 'tree.jpg',
    'Cat': 'cat.jpg',
    'Sun': 'sun.jpg',
}

# Timeout durasi (5 menit dalam detik)
TIMEOUT_DURATION = 300  # 5 menit
CAPTCHA_TIMEOUT = 30  # 30 detik

@app.route('/')
def index():
    # Periksa apakah pengguna diblokir
    if 'blocked_until' in session:
        blocked_until = session['blocked_until']
        current_time = time.time()

        if current_time < blocked_until:
            timeout_remaining = int(blocked_until - current_time)
            return render_template('blocked.html', timeout_remaining=timeout_remaining)
        else:
            # Hapus blokir jika waktu sudah habis
            session.pop('blocked_until', None)
            session.pop('attempts', None)

    # Pilih kata kunci secara acak
    keyword = random.choice(list(captcha_data.keys()))
    images = captcha_data[keyword]

    session['keyword'] = keyword  # Simpan keyword ke session
    session['start_time'] = time.time()  # Simpan waktu mulai CAPTCHA

    return render_template('index.html', keyword=keyword, images=images)

@app.route('/validate', methods=['POST'])
def validate():
    if 'blocked_until' in session:
        blocked_until = session['blocked_until']
        current_time = time.time()
        if current_time < blocked_until:
            return redirect(url_for('index'))

    selected_image = request.form.get('image')
    keyword = session.get('keyword')
    
    current_time = time.time()
    start_time = session.get('start_time', current_time)
    
    # Periksa apakah waktu sudah habis (30 detik)
    if current_time - start_time > CAPTCHA_TIMEOUT:
        return handle_failed_attempt("Time's up! CAPTCHA expired after 30 seconds.")
    
    # Periksa apakah pengguna menjawab dengan benar
    if selected_image == correct_answers[keyword]:
        session.pop('attempts', None)  # Reset percobaan jika berhasil
        return "<h2>Captcha Passed!</h2><a href='/'>Try again</a>"
    else:
        return handle_failed_attempt("Captcha Failed! Incorrect image selected.")

# Fungsi untuk menangani percobaan yang gagal, termasuk timeout atau jawaban salah
def handle_failed_attempt(message):
    # Tambahkan percobaan gagal
    if 'attempts' not in session:
        session['attempts'] = 0
    session['attempts'] += 1

    if session['attempts'] >= 3:
        # Blokir pengguna jika sudah 3 kali gagal
        session['blocked_until'] = time.time() + TIMEOUT_DURATION
        return redirect(url_for('index'))

    remaining_attempts = 3 - session['attempts']
    return f"<h2>{message} You have {remaining_attempts} attempts left.</h2><a href='/'>Go Back</a>"

# API untuk countdown waktu blokir
@app.route('/get_block_countdown', methods=['GET'])
def get_block_countdown():
    if 'blocked_until' in session:
        blocked_until = session['blocked_until']
        current_time = time.time()
        remaining_time = blocked_until - current_time
        
        if remaining_time > 0:
            return jsonify({'remaining_time': int(remaining_time)})
        else:
            return jsonify({'remaining_time': 0})
    
    return jsonify({'remaining_time': 0})

# API untuk countdown pada CAPTCHA
@app.route('/get_countdown', methods=['GET'])
def get_countdown():
    start_time = session.get('start_time', time.time())
    current_time = time.time()
    remaining_time = CAPTCHA_TIMEOUT - (current_time - start_time)
    
    if remaining_time < 0:
        remaining_time = 0
    
    return jsonify({'remaining_time': remaining_time})

if __name__ == '__main__':
    app.run(debug=True)

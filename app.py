from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import time
import random

app = Flask(__name__)
app.secret_key = 'secret-key'

# Daftar kata kunci dan gambar terkait
captcha_data = {
    'Tree': ['tree.png', 'car.png', 'house.png', 'bird.png'],
    'Cat': ['dog.png', 'cat.png', 'fish.png', 'rabbit.png'],
    'Sun': ['moon.png', 'sun.png', 'star.png', 'cloud.png'],
}

# Jawaban benar untuk setiap kata kunci
correct_answers = {
    'Tree': 'tree.png',
    'Cat': 'cat.png',
    'Sun': 'sun.png',
}

# Batasan kegagalan dan klik
MAX_FAILURES = 3
MAX_CLICKS = 5

@app.route('/')
def index():
    # Pilih kata kunci secara acak dari captcha_data
    keyword = random.choice(list(captcha_data.keys()))
    images = captcha_data[keyword]
    
    # Inisialisasi session
    session['failures'] = session.get('failures', 0)
    session['clicks'] = 0
    session['timeout'] = time.time() + 30  # Timeout 30 detik
    
    return render_template('index.html', keyword=keyword, images=images)

@app.route('/validate', methods=['POST'])
def validate():
    selected_image = request.form.get('image')
    keyword = request.form.get('keyword')
    clicks = session.get('clicks', 0)
    
    # Cek jika user sudah melebihi batas klik
    if clicks > MAX_CLICKS:
        return "<h2>Too many clicks! Captcha Failed.</h2><a href='/'>Go Back</a>"
    
    # Cek jawaban captcha
    if selected_image == correct_answers[keyword]:
        session['failures'] = 0  # Reset kegagalan
        return "<h2>Selamat! Anda berhasil memecahkan captcha!</h2>"
    else:
        session['failures'] += 1
        if session['failures'] >= MAX_FAILURES:
            session['timeout'] = time.time() + 300  # Timeout 5 menit setelah 3x gagal
            return "<h2>Too many failures! You are blocked for 5 minutes.</h2><a href='/'>Go Back</a>"
        return "<h2>Captcha Failed! Please try again.</h2><a href='/'>Go Back</a>"

@app.route('/check-timeout', methods=['POST'])
def check_timeout():
    if time.time() > session.get('timeout', 0):
        return jsonify({'status': 'timeout'})
    return jsonify({'status': 'ok'})

@app.route('/track-click', methods=['POST'])
def track_click():
    session['clicks'] += 1
    return jsonify({'clicks': session['clicks']})

if __name__ == '__main__':
    app.run(debug=True)

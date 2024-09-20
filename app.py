from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

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

@app.route('/')
def index():
    # Pilih secara acak kata kunci dari captcha_data
    keyword = 'Tree'
    images = captcha_data[keyword]
    
    return render_template('index.html', keyword=keyword, images=images)

@app.route('/validate', methods=['POST'])
def validate():
    selected_image = request.form.get('image')
    keyword = request.form.get('keyword')
    
    if selected_image == correct_answers[keyword]:
        return "<h2>Captcha Passed!</h2><a href='/'>Try again</a>"
    else:
        return "<h2>Captcha Failed! Please try again.</h2><a href='/'>Go Back</a>"

if __name__ == '__main__':
    app.run(debug=True)

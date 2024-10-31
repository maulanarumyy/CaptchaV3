
function initializeListeners() {
    const rockImage = document.getElementById('rock');
    const treeImage = document.getElementById('tree');
    const swingsetImage = document.getElementById('swingset');
  
    if (!rockImage|| !treeImage || !swingsetImage) {
        console.error('Images not found.');
        return;
    }
  
    // Event listener untuk pohon (jawaban benar)
    treeImage.addEventListener('click', function() {
        Swal.fire({
            title: "Nice Job!",
            text: "Pohon adalah pilihan yang tepat untuk berteduh",
            imageUrl: "../pictures/tree.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../html/home.html'; // Pindah ke halaman berikutnya
            }
        });
    });
  
    // Event listener untuk batu (jawaban salah)
    rockImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban masih belum tepat!",
            text: "Batu terlalu kecil untuk menjadi tempat teduh Anda!",
            imageUrl: "../pictures/rock.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        });
    });
  
    // Event listener untuk ayunan (jawaban salah)
    swingsetImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban masih belum tepat!",
            text: "Ayunan tidak bisa membuat Anda terhindar dari teriknya matahari!",
            imageUrl: "../pictures/swingset.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        });
    });
  }
  
  // Panggil fungsi inisialisasi setelah halaman sepenuhnya dimuat
  document.addEventListener('DOMContentLoaded', function() {
    initializeHouseListeners();
  });
  
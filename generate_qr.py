import qrcode
import sys
import os

def generate_qrs(base_url):
    variants = ['0', '1', '2', '3']
    
    # Buat direktori output jika belum ada
    output_dir = 'qr_codes'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for variant in variants:
        # Hapus trailing slash pada URL jika ada
        if base_url.endswith('/'):
            base_url = base_url[:-1]
            
        url = f"{base_url}/?varian={variant}"
        print(f"Generating QR Code for: {url}")
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        filename = os.path.join(output_dir, f"qr_varian_{variant}.png")
        img.save(filename)
        print(f"Saved -> {filename}")

if __name__ == "__main__":
    print("=== QR Code Generator Fase 4 ===")
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        # Tanya pengguna jika belum diberikan via argument
        base_url = input("Masukkan Base URL (contoh: https://<id>.ngrok-free.app atau http://192.168.1.10:5500) :\n> ")
        
    if not base_url:
        print("URL tidak boleh kosong. Menggunakan default http://localhost:5500")
        base_url = "http://localhost:5500"
        
    generate_qrs(base_url)
    print("\nSelesai! Gambar QR code telah disimpan di folder 'qr_codes/'.")

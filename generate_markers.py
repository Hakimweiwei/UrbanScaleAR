import urllib.request
import os

def download_markers():
    base_url = "https://raw.githubusercontent.com/nicolocarpignoli/artoolkit-barcode-markers-collection/master/3x3/"
    
    # Create markers directory if it doesn't exist
    markers_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "markers")
    if not os.path.exists(markers_dir):
        os.makedirs(markers_dir)
        print(f"Created directory: {markers_dir}")

    # Download markers 0, 1, and 2
    for i in range(3):
        url = f"{base_url}{i}.png"
        file_path = os.path.join(markers_dir, f"marker_{i}.png")
        print(f"Downloading {url} to {file_path}...")
        try:
            urllib.request.urlretrieve(url, file_path)
            print(f"Successfully downloaded marker_{i}.png")
        except Exception as e:
            print(f"Failed to download marker_{i}.png: {e}")

if __name__ == "__main__":
    download_markers()

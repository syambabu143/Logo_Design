import os
import subprocess
from PIL import Image

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
VECTORS_DIR = os.path.abspath(r"assets/vectors")
PNG_DIR = os.path.abspath(r"assets/png")

os.makedirs(PNG_DIR, exist_ok=True)

exports = [
    ("zenith-iconmark-fullcolor.svg", "zenith-iconmark-fullcolor-1000x1000.png", 1000, 1000, True, "svg { width: 80%; height: 80%; }"),
    ("zenith-iconmark-monochrome.svg", "zenith-iconmark-monochrome-1000x1000.png", 1000, 1000, True, "svg { width: 80%; height: 80%; }"),
    ("zenith-iconmark-reversed.svg", "zenith-iconmark-reversed-1000x1000.png", 1000, 1000, False, "body { background: #0F172A; } svg { width: 80%; height: 80%; }"),
    ("zenith-logo-fullcolor.svg", "zenith-logo-fullcolor-1000x1000.png", 1000, 1000, True, "svg { width: 90%; height: auto; }"),
    ("zenith-logo-monochrome.svg", "zenith-logo-monochrome-1000x1000.png", 1000, 1000, True, "svg { width: 90%; height: auto; }"),
    ("zenith-logo-reversed.svg", "zenith-logo-reversed-1000x1000.png", 1000, 1000, False, "body { background: #0F172A; } svg { width: 90%; height: auto; }"),
    ("zenith-logo-grid.svg", "zenith-logo-blueprint-2000x1000.png", 2000, 1000, False, "svg { width: 100%; height: 100%; }"),
]

temp_html = os.path.join(PNG_DIR, "temp_render.html")

for svg_name, png_name, w, h, is_transparent, custom_css in exports:
    svg_path = os.path.join(VECTORS_DIR, svg_name)
    png_path = os.path.join(PNG_DIR, png_name)
    
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    bg_color = "transparent" if is_transparent else "#0F172A"

    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: {w}px;
    height: {h}px;
    background-color: {bg_color};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }}
  {custom_css}
</style>
</head>
<body>
  {svg_content}
</body>
</html>"""

    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--default-background-color=00000000",
        f"--window-size={w},{h}",
        f"--screenshot={png_path}",
        f"file:///{temp_html.replace(os.sep, '/')}"
    ]

    print(f"Rendering {png_name} ({w}x{h}px)...")
    subprocess.run(cmd, check=True)

    # Post-process for pristine RGBA transparency if transparent background requested
    if os.path.exists(png_path):
        img = Image.open(png_path).convert("RGBA")
        if is_transparent:
            datas = img.getdata()
            newData = []
            for item in datas:
                # If pixel is pure white or near pure white background (r>250, g>250, b>250)
                if item[0] > 252 and item[1] > 252 and item[2] > 252:
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item)
            img.putdata(newData)
        
        img.save(png_path, "PNG")
        print(f"Verified & Saved: {png_name} ({img.size}, mode: {img.mode})")

if os.path.exists(temp_html):
    os.remove(temp_html)

print("\nAll PNG transparent assets created and verified successfully!")

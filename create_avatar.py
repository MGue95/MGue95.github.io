from PIL import Image, ImageDraw, ImageFont
import os

# Create a 286x286 image with light cream background
width, height = 286, 286
image = Image.new('RGB', (width, height), '#f7f5ef')
draw = ImageDraw.Draw(image)

# Draw a border to simulate photo wrapper
border_width = 2
draw.rectangle([border_width, border_width, width-border_width-1, height-border_width-1],
               outline='#d8d5cd', width=border_width)

# Add some text as placeholder for face
try:
    # Try to use a system font
    font = ImageFont.truetype("arial.ttf", 24)
except IOError:
    # Fallback to default font
    font = ImageFont.load_default()

text = "MG"
# Get text size
bbox = draw.textbbox((0, 0), text, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Center the text
x = (width - text_width) // 2
y = (height - text_height) // 2

# Draw text
draw.text((x, y), text, fill='#20221f', font=font)

# Save the image
image.save('avatar.jpg')
print("Avatar image created successfully!")
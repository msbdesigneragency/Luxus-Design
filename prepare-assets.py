from PIL import Image
from pathlib import Path
root=Path('public/images')
for p in list(root.glob('*.jpg'))+[root/'hero-main.png']:
 im=Image.open(p).convert('RGB')
 im.thumbnail((1920,1920))
 im.save(p.with_suffix('.webp'),'WEBP',quality=88,method=6)
ref=Image.open(root/'reference.png')
# Approved reference photography only: exclude the baked-in captions and arrows.
for i,box in enumerate([(292,626,427,795),(432,626,681,794),(687,626,830,795)]):
 im=ref.crop(box)
 im.resize((im.width*3,im.height*3),Image.Resampling.LANCZOS).save(root/f'service-{i}.webp',quality=92)
print('Optimized all supplied photography and prepared approved materials crops.')
from PIL import Image
from pathlib import Path
for color in ['white','black']:
 p=Path('public/images')/f'logo-{color}.png'
 Image.open(p).crop((200,220,1940,510)).save(p.with_name(f'brand-{color}.webp'),'WEBP',lossless=True)

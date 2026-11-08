import sys
from PIL import Image, ImageDraw, ImageFilter
REPO='/home/user/dawg'
OUT='/tmp/claude-0/-home-user-dawg/09f045ea-cfc7-52ab-b002-0d763b42995c/scratchpad/lead'
W,H=1200,1500
def sample(im, pts):
    px=[im.getpixel(p) for p in pts]; return tuple(sum(c[i] for c in px)//len(px) for i in range(3))
def make(name, src, ref, jar_w=1000):
    ref=Image.open(ref).convert('RGB').resize((W,H))
    wall_top=sample(ref,[(60,60),(1140,60),(600,40)]); wall_low=sample(ref,[(60,700),(1140,760)])
    floor_top=sample(ref,[(80,1180),(1120,1260)]); floor_low=sample(ref,[(80,1460),(1120,1460)])
    bg=Image.new('RGB',(W,H))
    d=ImageDraw.Draw(bg)
    # wall: vertical gradient
    for y in range(H):
        t=y/H; c=tuple(int(wall_top[i]*(1-t)+wall_low[i]*t) for i in range(3)); d.line([(0,y),(W,y)],fill=c)
    # floor (ledge) polygon with diagonal front edge, vertical gradient
    y0,y1=1190,1290  # edge at x=0 and x=W
    floor=Image.new('RGB',(W,H)); fd=ImageDraw.Draw(floor)
    for y in range(H):
        t=max(0,(y-y0))/(H-y0); c=tuple(int(floor_top[i]*(1-t)+floor_low[i]*t) for i in range(3)); fd.line([(0,y),(W,y)],fill=c)
    mask=Image.new('L',(W,H),0); ImageDraw.Draw(mask).polygon([(0,y0),(W,y1),(W,H),(0,H)],fill=255)
    bg.paste(floor,(0,0),mask)
    jar=Image.open(src).convert('RGBA'); jar=jar.crop(jar.getchannel('A').getbbox())
    jh=int(jar.height*jar_w/jar.width); jar=jar.resize((jar_w,jh),Image.LANCZOS)
    jx=(W-jar_w)//2; edge_y=y0+(y1-y0)*0.5; jy=int(edge_y+28-jh)
    # contact shadow on the ledge
    sh=Image.new('L',(W,H),0); ImageDraw.Draw(sh).ellipse([jx+10,int(edge_y)-4,jx+jar_w+60,int(edge_y)+120],fill=185)
    sh=sh.filter(ImageFilter.GaussianBlur(30))
    bg.paste(Image.new('RGB',(W,H),(6,9,7)),(0,0),sh)
    sh2=Image.new('L',(W,H),0); ImageDraw.Draw(sh2).ellipse([jx+50,int(edge_y)+14,jx+jar_w-30,int(edge_y)+52],fill=235)
    sh2=sh2.filter(ImageFilter.GaussianBlur(9))
    bg.paste(Image.new('RGB',(W,H),(3,4,3)),(0,0),sh2)
    # soft cast shadow on the wall behind, offset right
    sw=Image.new('L',(W,H),0); ImageDraw.Draw(sw).rounded_rectangle([jx+70,jy+60,jx+jar_w+40,int(edge_y)],radius=60,fill=70)
    sw=sw.filter(ImageFilter.GaussianBlur(45))
    bg.paste(Image.new('RGB',(W,H),(40,32,22)),(0,0),sw)
    bg.paste(jar,(jx,jy),jar)
    bg.save(f'{OUT}/{name}.png'); bg.save(f'{OUT}/{name}.webp',quality=88)
    print(name, 'jar', jar_w, 'of', W, f'{jar_w/W:.0%}', 'top', jy)
for n,src,ref in [('product-3d-uv-shield-portrait','alchemiamd-uvshield-v1-front.png','product-3d-uv-shield-portrait.webp'),('product-3d-skinbiotic-portrait','alchemiamd-skinbiotic-v1-front.png','product-3d-skinbiotic-portrait.webp'),('product-3d-dermaboost-portrait','alchemiamd-dermaboost-v1-front.png','product-3d-dermaboost-portrait.webp')]:
    make(n, f'{REPO}/source-images/product-renders/{src}', f'{REPO}/assets/{ref}')

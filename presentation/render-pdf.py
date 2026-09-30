"""Create searchable PDF from the same declarative layout as the editable PPTX.

Usage: python render-pdf.py [deck-spec.json] [output.pdf]
Requires ReportLab, Pillow and a Segoe UI installation (or NURT_FONT_DIR).
No font files are redistributed. PNGs used here are application screenshots.
"""
from pathlib import Path
import json, os, math, sys
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SPEC = Path(sys.argv[1]) if len(sys.argv)>1 else HERE/'deck-spec.json'
OUTPUT = Path(sys.argv[2]) if len(sys.argv)>2 else HERE/'NURT-prezentacja.pdf'
FONTS = Path(os.environ.get('NURT_FONT_DIR', 'C:/Windows/Fonts'))
pdfmetrics.registerFont(TTFont('NURT-Regular', str(FONTS/'segoeui.ttf')))
pdfmetrics.registerFont(TTFont('NURT-Bold', str(FONTS/'segoeuib.ttf')))
data = json.loads(SPEC.read_text(encoding='utf-8'))
W,H=data['width'],data['height']
S=.75
c=canvas.Canvas(str(OUTPUT),pagesize=(W*S,H*S),pageCompression=1)
c.setTitle('NURT - od obrazu z drona do decyzji w powodzi')
c.setAuthor('Uszatki')
c.setSubject('Dual Use Hackathon: prototyp demonstracyjny, dane syntetyczne')

def color(v): return HexColor(v)
def ln(x,y,x2,y2,col,width,dashed=False):
    c.setStrokeColor(color(col));c.setLineWidth(width)
    c.setDash([8,5] if dashed else [])
    c.line(x,H-y,x2,H-y2)
    c.setDash([])

def arrow(it):
    (x,y),(xx,yy)=it['from'],it['to']
    pts=[(x,y)]
    if x!=xx and y!=yy:
        if it['fromSide'] in ('left','right'):
            mid=(x+xx)/2;pts += [(mid,y),(mid,yy)]
        else:
            mid=(y+yy)/2;pts += [(x,mid),(xx,mid)]
    pts.append((xx,yy))
    for a,b in zip(pts,pts[1:]):ln(*a,*b,it['color'],it['width'])
    px,py=pts[-2];theta=math.atan2(yy-py,xx-px);length=11;spread=5
    bx=xx-length*math.cos(theta);by=yy-length*math.sin(theta)
    p=c.beginPath();p.moveTo(xx,H-yy)
    p.lineTo(bx+spread*math.sin(theta),H-(by-spread*math.cos(theta)))
    p.lineTo(bx-spread*math.sin(theta),H-(by+spread*math.cos(theta)));p.close()
    c.setFillColor(color(it['color']));c.drawPath(p,fill=1,stroke=0)

for index,slide in enumerate(data['slides'],1):
    c.saveState();c.scale(S,S)
    c.setFillColor(color(slide['background']));c.rect(0,0,W,H,fill=1,stroke=0)
    for it in slide['items']:
        k=it['kind']
        if k=='text':
            font='NURT-Bold' if it['bold'] else 'NURT-Regular'
            size=it['size'];c.setFont(font,size);c.setFillColor(color(it['color']))
            # Segoe's cap height and ascent closely match the native text frame.
            base=H-it['y']-size*1.015
            for n,text in enumerate(it['text'].split('\n')):
                x=it['x'];y=base-n*size*1.23
                if it['align']=='right':c.drawRightString(x+it['w'],y,text)
                elif it['align']=='center':c.drawCentredString(x+it['w']/2,y,text)
                else:c.drawString(x,y,text)
        elif k=='rect':
            fill=it['fill']!='none';stroke=it['line']!='none' and it['width']>0
            if fill:c.setFillColor(color(it['fill']))
            if stroke:c.setStrokeColor(color(it['line']));c.setLineWidth(it['width'])
            c.rect(it['x'],H-it['y']-it['h'],it['w'],it['h'],fill=fill,stroke=stroke)
        elif k=='line': ln(it['x'],it['y'],it['x2'],it['y2'],it['color'],it['width'],it.get('dashed',False))
        elif k=='arrow':arrow(it)
        elif k=='image':
            source=Path(it['src']);source=source if source.is_absolute() else HERE/source
            im=Image.open(source).convert('RGB')
            crop=it.get('crop')
            if crop:
                iw,ih=im.size;im=im.crop((round(iw*crop['left']),round(ih*crop['top']),round(iw*(1-crop['right'])),round(ih*(1-crop['bottom']))))
            iw,ih=im.size;x,y,w,h=it['x'],it['y'],it['w'],it['h']
            ratio=max(w/iw,h/ih) if it['fit']=='cover' else min(w/iw,h/ih)
            dw,dh=iw*ratio,ih*ratio;dx=x+(w-dw)/2;dy=y+(h-dh)/2
            c.saveState();p=c.beginPath();p.rect(x,H-y-h,w,h);c.clipPath(p,stroke=0,fill=0)
            c.drawImage(ImageReader(im),dx,H-dy-dh,dw,dh,mask='auto');c.restoreState()
    c.restoreState();c.showPage()
c.save()
print(f'{OUTPUT}: {len(data["slides"])} slides, searchable text')

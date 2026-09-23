from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import re
import cairosvg
from PIL import Image
root=Path(__file__).resolve().parent.parent
out=root/'brand'
mark=(root/'dist/assets/mark.svg').read_text()
(out/'leads-ascend-icon.svg').write_text(mark)
parts=[];x=84;baseline=66;size=52;tracking=-1.8
for text,fontfile,color in [('leads','DejaVuSans-Bold.ttf','#1a1714'),('ascend','DejaVuSans.ttf','#1a1714'),('.','DejaVuSans-Bold.ttf','#d87600')]:
 font=TTFont('/usr/share/fonts/truetype/dejavu/'+fontfile);glyphs=font.getGlyphSet();cmap=font.getBestCmap();scale=size/font['head'].unitsPerEm
 for char in text:
  glyph=cmap[ord(char)];pen=SVGPathPen(glyphs);glyphs[glyph].draw(pen)
  parts.append(f'<path fill="{color}" transform="translate({x:.3f} {baseline}) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>')
  x+=glyphs[glyph].width*scale+tracking
inner=re.search(r'<svg[^>]*>(.*)</svg>',mark,re.S).group(1)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {x+6:.3f} 96"><title>Leads Ascend</title><g transform="translate(0 16) scale(1.333333)">{inner}</g>'+''.join(parts)+'</svg>'
(out/'leads-ascend-wordmark.svg').write_text(svg)
for name,width in [('wordmark',4000),('icon',2048)]:
 cairosvg.svg2png(bytestring=(out/f'leads-ascend-{name}.svg').read_bytes(),write_to=str(out/f'leads-ascend-{name}.png'),output_width=width)
icon=Image.open(out/'leads-ascend-icon.png').convert('RGBA')
icon.save(out/'favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64)])
for size in [16,32,180,192,512]:
 icon.resize((size,size),Image.Resampling.LANCZOS).save(out/f'favicon-{size}.png')
(out/'favicon.svg').write_text(mark)
for src,dest in [('favicon.ico','favicon.ico'),('favicon-180.png','apple-touch-icon.png')]:
 (root/'dist/assets'/dest).write_bytes((out/src).read_bytes())
print('Brand exports: outlined SVGs, transparent 4000px wordmark, transparent 2048px icon, ICO and PNG favicons.')

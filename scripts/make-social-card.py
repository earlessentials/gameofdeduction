from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
im=Image.new('RGB',(1200,630),'#11101D');d=ImageDraw.Draw(im)
font='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
f=lambda n,b=False:ImageFont.truetype(bold if b else font,n)
d.rounded_rectangle((28,28,1172,602),24,fill='#1B192B',outline='#65517D',width=2)
d.text((76,78),'DEDUCE',font=f(30,True),fill='#C994D4')
for text,y in [('Every detail.',178),('Every doubt.',262),('Every deduction.',346)]:d.text((76,y),text,font=f(64,True),fill='#C994D4' if y==346 else '#F5F0FA')
d.text((76,520),'24 investigations. Your reasoning. Your story.',font=f(25),fill='#C8C0D5')
d.ellipse((850,152,1110,412),outline='#65517D',width=2);d.ellipse((877,179,1083,385),outline='#956DC2',width=2)
d.polygon([(888,282),(980,220),(1072,282),(980,344)],outline='#C994D4',width=3)
d.ellipse((948,250,1012,314),fill='#C994D4');d.ellipse((965,267,995,297),fill='#252139')
im.save(Path('worker/social-card.png'),optimize=True)

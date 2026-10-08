import json
from pathlib import Path

data=json.loads((Path(__file__).resolve().parents[1]/'dist/event.json').read_text(encoding='utf-8'))
bouts=data['bouts']; fighters=data['fighters']
assert len(bouts)==12 and len(fighters)==24
assert [b['group'] for b in bouts]==['Main Card']*5+['Prelims']*7
assert [b['order'] for b in bouts]==list(range(12))
assert bouts[0]['fighters']==['/ufc/fighters/brendan-allen','/ufc/fighters/christian-leroy-duncan']
assert bouts[0]['mainEvent'] and sum(b['mainEvent'] for b in bouts)==1
assert len({b['id'] for b in bouts})==12
used=[]
for b in bouts:
 assert len(b['fighters'])==2 and len(set(b['fighters']))==2
 for id in b['fighters']:
  f=fighters[id];used.append(id)
  assert f['id']==id and f['source']=='https://cito.gg'+id
  assert f['image'].startswith('https://ufc.com/images/styles/event_fight_card_upper_body_of_standing_athlete/s3/')
  for field in ['finishRate','strikeAccuracy','takedownAccuracy']:
   assert f[field] is None or 0<=f[field]<=100
  assert 1<=len(f['recent'])<=3
assert len(set(used))==24
assert fighters['/ufc/fighters/otari-tanzilovi']['reach'] is None
assert fighters['/ufc/fighters/felipe-franco']['reach'] is None
assert fighters['/ufc/fighters/allen-frye-jr']['takedownAccuracy'] is None
assert fighters['/ufc/fighters/rj-harris']['takedownAccuracy'] is None
assert fighters['/ufc/fighters/otari-tanzilovi']['takedownAccuracy']==0
print('PASS: 12 unique bouts, 24 linked fighters, 5/7 grouping, source images, metric ranges, and missing-data semantics.')

import json, datetime
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
rows='''brendan-allen|Brendan Allen|US|27-7-0|All In|30|74|75|186|Orthodox|74|52|4|2026-10/ALLEN_BRENDAN_L_10-10.png?itok=Y3-yPnQk
christian-leroy-duncan|Christian Leroy Duncan|GB|15-2-0|CLD|31|74|79|185|Switch|73|58|20|2026-10/DUNCAN_CHRISTIAN_LEROY_R_10-10.png?itok=UADdg6GJ
matheus-camilo|Matheus Camilo|BR|11-3-0|Jaguar|25|70|69.5|155.8|Orthodox|64|43|54|2026-10/CAMILO_MATHEUS_L_10-10.png?itok=ng8vUA_b
jai-herbert|Jai Herbert|GB|14-6-1|Black Country Banger|38|73|77|156|Orthodox|79|42|21|2026-10/HERBERT_JAI_R_10-10.png?itok=wFxaRyIa
loopy-godinez|Loopy Godinez|MX|14-6-0||33|62|61|115|Orthodox|21|49|43|2026-10/GODINEZ_LOOPY_L_10-10.png?itok=h4UQXf1K
ketlen-souza|Ketlen Souza|BR|17-6-0|Esquentadinha|32|63|63|116|Orthodox|65|57|13|2026-10/SOUZA_KETLEN_R_10-10.png?itok=bbuZc-66
andre-fili|Andre Fili|US|25-14-0 (1 NC)|Touchy|36|71|74|146|Orthodox|52|38|46|2026-10/FILI_ANDRE_L_10-10.png?itok=oAMyjBAO
kai-kamaka-iii|Kai Kamaka III|US|18-8-1|Da Fighting Hawaiian|31|67|69|144.5|Orthodox|22|59|54|2026-10/KAMAKA_KAI_R_10-10.png?itok=76iakX5J
malcolm-wellmaker|Malcolm Wellmaker|US|10-2-0|The Machine|32|70|71.5|143.6|Switch|80|55|0|2026-10/WELLMAKER_MALCOM_L_10-10.png?itok=l6yncBbG
otari-tanzilovi|Otari Tanzilovi|GE|10-2-0||28|70||134.5|Orthodox|70|69|0|2026-10/TANZILOVI_OTARI_R_10-10.png?itok=45im3vKM
julius-walker|Julius Walker|US|7-3-0|Juice Box|27|76|78|206|Orthodox|86|54|38|2026-10/WALKER_JULIUS_L_10-10.png?itok=-vUH5sbY
gerald-meerschaert|Gerald Meerschaert|US|37-22-0|GM3|38|73|77.5|185.6|Southpaw|95|45|29|2026-10/MEERSCHAERT_GERALD_R_10-10.png?itok=kTi-RPfa
francisco-prado|Francisco Prado|AR|12-5-0||24|70|69|170|Orthodox|100|44|19|2026-10/PRADO_FRANCISCO_L_10-10.png?itok=SwOS5TmC
ismael-bonfim|Ismael Bonfim|BR|20-7-0|Marreta|30|68|71.5|161|Orthodox|65|54|7|2026-10/BONFIM_ISMAEL_R_10-10.png?itok=CK6pmt8t
niko-price|Niko Price|US|16-11-0|The Hybrid|36|72|76|170.5|Orthodox|81|43|30|2026-10/PRICE_NIKO_L_10-10.png?itok=O4iA06e2
leon-shahbazyan|Leon Shahbazyan|AM|12-5-0|S.O.G.|30|76|77|171|Orthodox|100|52|0|2026-06/SHAHBAZYAN_LEON_L_06-20.png?itok=0BDlzTa8
felipe-franco|Felipe Franco|BR|11-2-0|Negão|25|73||204|Orthodox|100|57|0|2026-03/FRANCO_FELIPE_R_03-21.png?itok=Pb4xswY2
brendson-ribeiro|Brendson Ribeiro|BR|17-11-0|The Gorilla|29|75|81|206|Orthodox|94|40|0|2026-10/RIBEIRO_BRENDSON_R_10-10.png?itok=b6HWwJaf
allen-frye-jr|Allen Frye Jr.|US|6-1-0|AJ|27|77|80.5|242|Orthodox|100|38||2026-10/FRYE_JR_ALLEN_L_10-10.png?itok=L0ASo_Lj
rj-harris|RJ Harris|US|6-0-0|The Hammer|27|75|78|265|Orthodox|83|58||2026-10/HARRIS_RJ_R_10-10.png?itok=Hg_7Ol23
alice-pereira|Alice Pereira|BR|7-1-0|Golden Girl|20|68|71|136|Orthodox|86|37|0|2026-10/PEREIRA_ALICE_L_10-10.png?itok=ddxQHU0n
dariya-zheleznyakova|Daria Zhelezniakova|RU|10-3-0|Iron Lady|30|69|68|136|Orthodox|50|40|0|2026-10/ZHELEZNIAKOVA_DARIA_R_10-10.png?itok=3XMXi52C
ernesta-kareckaite|Ernesta Kareckaitė|LT|6-2-1|Heavy-Handed|28|69|71|126|Orthodox|33|42|20|2026-10/KARECKAITE_ERNESTA_L_10-10.png?itok=jsuDSOw2
melissa-gatto|Melissa Gatto|BR|9-3-2||30|65|69|134.5|Orthodox|78|50|27|2026-10/GATTO_MELISSA_R_10-10.png?itok=MjpMvdlo'''
fighters={}
for row in rows.splitlines():
 s,n,c,r,nick,age,h,reach,w,stance,finish,strike,td,image=row.split('|')
 num=lambda v:float(v) if v else None
 id='/ufc/fighters/'+s
 fighters[id]=dict(id=id,name=n,country=c,record=r,nickname=nick or None,age=num(age),height=num(h),reach=num(reach),weight=num(w),stance=stance,finishRate=num(finish),strikeAccuracy=num(strike),takedownAccuracy=num(td),image='https://ufc.com/images/styles/event_fight_card_upper_body_of_standing_athlete/s3/'+image,source='https://cito.gg'+id,recent=[])
classes=['Middleweight','Lightweight',"Women's Strawweight",'Featherweight','Bantamweight','Light Heavyweight','Lightweight','Welterweight','Light Heavyweight','Heavyweight',"Women's Bantamweight","Women's Flyweight"]
paths=['uuid-a9eef98a-ba21-4fcb-95d5-cf3c7312411f/brendan-allen-vs-christian-leroy-duncan','13160/matheus-camilo-vs-jai-herbert','13161/loopy-godinez-vs-ketlen-souza','13162/andre-fili-vs-kai-kamaka-iii','13164/malcolm-wellmaker-vs-otari-tanzilovi','13163/julius-walker-vs-gerald-meerschaert','fight-night-october-10-2026-francisco-prado-ismael-bonfim/francisco-prado-vs-ismael-bonfim','fight-night-october-10-2026-leon-shahbazyan-niko-price/niko-price-vs-leon-shahbazyan','fight-night-october-10-2026-brendson-ribeiro-felipe-franco/felipe-franco-vs-brendson-ribeiro','fight-night-october-10-2026-allen-frye-jr-rj-harris/allen-frye-jr-vs-rj-harris','fight-night-october-10-2026-alice-pereira-dariya-zheleznyakova/alice-pereira-vs-dariya-zheleznyakova','fight-night-october-10-2026-ernesta-kareckaite-melissa-gatto/ernesta-kareckaite-vs-melissa-gatto']
ids=list(fighters)
bouts=[dict(id='/ufc/bouts/'+p,order=i,group='Main Card' if i<5 else 'Prelims',weightClass=classes[i],mainEvent=i==0,fighters=ids[2*i:2*i+2]) for i,p in enumerate(paths)]
for line in (ROOT/'data/source/recent-fights.txt').read_text(encoding='utf-8').splitlines():
 slug,result,matchup,date,round,time,method=line.split('|')
 fighters['/ufc/fighters/'+slug]['recent'].append(dict(result=result,matchup=matchup,date=date,round=round,time=time,method=method))
data=dict(title='UFC Fight Night: Allen vs Duncan',source='https://cito.gg/ufc/events/ufc-fight-night-october-10-2026',date='October 10, 2026',venue='Meta APEX · Las Vegas',refreshedAt='2026-10-08T20:18:10+00:00',fighters=fighters,bouts=bouts)
(ROOT/'dist/event.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')

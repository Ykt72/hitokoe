import type { Exercise, Level } from '../types';

export const labels:Record<Level,string>={low:'低',medium:'中',high:'高'};

export const exercises:Exercise[]=[
  {id:'stretch',image:'/exercises/stretch.png',name:'ストレッチ',intensity:'low',baseMinutes:20,kcalPerMinute:2.5,description:'全身をゆっくり伸ばして、体を気持ちよくほぐします。'},
  {id:'walking',image:'/exercises/walking.png',name:'ウォーキング',intensity:'low',baseMinutes:20,kcalPerMinute:4,description:'無理のないペースで歩き、心と体を整えます。'},
  {id:'radio',image:'/exercises/radio.png',name:'ラジオ体操',intensity:'low',baseMinutes:15,kcalPerMinute:3.8,description:'大きく体を動かして、全身を目覚めさせます。'},
  {id:'jogging',image:'/exercises/jogging.png',name:'ジョギング',intensity:'medium',baseMinutes:15,kcalPerMinute:8.5,description:'会話できるくらいの速さで、軽やかに走ります。'},
  {id:'squat',image:'/exercises/squat.png',name:'スクワット',intensity:'medium',baseMinutes:3,kcalPerMinute:7.5,description:'背筋を伸ばし、椅子に座るように腰を落とします。'},
  {id:'stairs',image:'/exercises/stairs.png',name:'階段上り下り',intensity:'medium',baseMinutes:5,kcalPerMinute:8,description:'近くの階段を使って、短時間で脚を動かします。'},
  {id:'jump-squat',image:'/exercises/jump-squat.png',name:'ジャンピングスクワット',intensity:'high',baseMinutes:2,kcalPerMinute:11,description:'膝を曲げてジャンプ。着地は静かに行います。'},
  {id:'burpee',image:'/exercises/burpee.png',name:'バーピー',intensity:'high',baseMinutes:1,kcalPerMinute:12,description:'しゃがむ、伸ばす、跳ぶをリズムよく繰り返します。'},
  {id:'push-up',image:'/exercises/push-up.png',name:'腕立て伏せ',intensity:'high',baseMinutes:1,kcalPerMinute:8,description:'姿勢をまっすぐ保ち、できる範囲で胸を下ろします。'}
];

export const byId=(id:string)=>exercises.find(x=>x.id===id)!;

export const propose=(old:string[]=[])=>['low','medium','high'].map(level=>{
  const all=exercises.filter(x=>x.intensity===level);
  const fresh=all.filter(x=>!old.includes(x.id));
  const pool=fresh.length?fresh:all;
  return pool[Math.floor(Math.random()*pool.length)];
});

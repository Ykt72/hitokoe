import type { Exercise, Level, RecordItem } from '../types';

export const labels:Record<Level,string>={low:'低',medium:'中',high:'高'};

export const exercises:Exercise[]=[
  {id:'stretch',image:'./exercises/stretch.png',name:'ストレッチ',intensity:'low',baseMinutes:20,kcalPerMinute:2.5,description:'全身をゆっくり伸ばして、体を気持ちよくほぐします。'},
  {id:'walking',image:'./exercises/walking.png',name:'ウォーキング',intensity:'low',baseMinutes:20,kcalPerMinute:4,description:'無理のないペースで歩き、心と体を整えます。'},
  {id:'radio-1',image:'./exercises/radio.png',name:'ラジオ体操・1',intensity:'low',baseMinutes:15,kcalPerMinute:3.8,description:'大きく体を動かして、全身を目覚めさせます。'},
  {id:'radio-2',image:'./exercises/radio-2.png',name:'ラジオ体操・2',intensity:'low',baseMinutes:15,kcalPerMinute:3.8,description:'腕と脚を大きく使い、リズムよく全身を動かします。'},
  {id:'one-leg-stand',image:'./exercises/one-leg-stand.png',name:'片足立ち',intensity:'low',baseMinutes:10,kcalPerMinute:2.5,description:'姿勢をまっすぐ保ちながら、片足で静かにバランスを取ります。'},
  {id:'marching',image:'./exercises/marching.png',name:'足踏み',intensity:'low',baseMinutes:25,kcalPerMinute:3.5,description:'その場で足踏みし、無理なく体を温めます。'},
  {id:'jogging',image:'./exercises/jogging.png',name:'ジョギング',intensity:'medium',baseMinutes:15,kcalPerMinute:8.5,description:'会話できるくらいの速さで、軽やかに走ります。'},
  {id:'squat',image:'./exercises/squat.png',name:'スクワット',intensity:'medium',baseMinutes:3,kcalPerMinute:7.5,description:'背筋を伸ばし、椅子に座るように腰を落とします。'},
  {id:'stairs',image:'./exercises/stairs.png',name:'階段上り下り',intensity:'medium',baseMinutes:5,kcalPerMinute:8,description:'近くの階段を使って、短時間で脚を動かします。'},
  {id:'lunge',image:'./exercises/lunge.png',name:'ランジ',intensity:'medium',baseMinutes:5,kcalPerMinute:6.5,description:'一歩踏み出して腰を落とし、脚と体幹を意識します。'},
  {id:'leg-raise',image:'./exercises/leg-raise.png',name:'レッグレイズ',intensity:'medium',baseMinutes:5,kcalPerMinute:3,description:'仰向けで脚を上げ下げし、お腹まわりをゆっくり使います。'},
  {id:'calf-raise',image:'./exercises/calf-raise.png',name:'カーフレイズ',intensity:'medium',baseMinutes:3,kcalPerMinute:5,description:'かかとを上げ下げして、ふくらはぎをじんわり動かします。'},
  {id:'jump-squat',image:'./exercises/jump-squat.png',name:'ジャンピングスクワット',intensity:'high',baseMinutes:2,kcalPerMinute:11,description:'膝を曲げてジャンプ。着地は静かに行います。'},
  {id:'burpee',image:'./exercises/burpee.png',name:'バーピー',intensity:'high',baseMinutes:1,kcalPerMinute:12,description:'しゃがむ、伸ばす、跳ぶをリズムよく繰り返します。'},
  {id:'push-up',image:'./exercises/push-up.png',name:'腕立て伏せ',intensity:'high',baseMinutes:1,kcalPerMinute:8,description:'姿勢をまっすぐ保ち、できる範囲で胸を下ろします。'},
  {id:'sit-up',image:'./exercises/sit-up.png',name:'腹筋',intensity:'high',baseMinutes:1,kcalPerMinute:5.5,description:'お腹を意識しながら、上体をゆっくり起こします。'},
  {id:'plank',image:'./exercises/plank.png',name:'プランク',intensity:'high',baseMinutes:1,kcalPerMinute:5,description:'体を一直線に保ち、短時間で体幹に集中します。'},
  {id:'high-knees',image:'./exercises/high-knees.png',name:'もも上げダッシュ',intensity:'high',baseMinutes:1,kcalPerMinute:12,description:'その場でももを高く上げ、テンポよく全身を動かします。'}
];

export const normalizeExerciseId=(id:string)=>id==='radio'?'radio-1':id;
export const exerciseIds=exercises.map(exercise=>exercise.id);
export const byId=(id:string)=>exercises.find(x=>x.id===normalizeExerciseId(id))!;

export const hasExecutedAllExercises=(records:RecordItem[])=>{
  const executed=new Set(records.map(record=>normalizeExerciseId(record.exerciseId)));
  return exerciseIds.every(id=>executed.has(id));
};

export const proposalBlocklist=(proposedIds:string[],records:RecordItem[])=>{
  if(hasExecutedAllExercises(records))return [];
  return proposedIds.map(normalizeExerciseId);
};

export const propose=(old:string[]=[])=>['low','medium','high'].map(level=>{
  const all=exercises.filter(x=>x.intensity===level);
  const blocked=new Set(old.map(normalizeExerciseId));
  const fresh=all.filter(x=>!blocked.has(x.id));
  const pool=fresh.length?fresh:all;
  return pool[Math.floor(Math.random()*pool.length)];
});

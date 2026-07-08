import { useEffect, useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { propose } from '../data/exercises';
import type { Exercise, SetState, State } from '../types';

export function HomeScreen({state,setState,go}:{state:State;setState:SetState;go:()=>void}){
  const[items,setItems]=useState(()=>propose());
  const[selected,setSelected]=useState<Exercise|null>(null);
  const[minutes,setMinutes]=useState(1);
  const[toast,setToast]=useState(false);
  const today=state.records.filter(r=>r.status==='completed'&&new Date(r.completedAt).toDateString()===new Date().toDateString());
  const rate=Math.min(100,today.length*34);
  const open=(exercise:Exercise)=>{setSelected(exercise);setMinutes(exercise.baseMinutes)};
  const refresh=()=>{
    setItems(propose(items.map(x=>x.id)));
    setToast(true);
  };
  const begin=()=>{
    if(!selected)return;
    setState(s=>({...s,timer:{exerciseId:selected.id,durationSeconds:minutes*60,remainingSeconds:minutes*60,endsAt:null,status:'ready'}}));
    setSelected(null);
    go();
  };

  useEffect(()=>{
    if(!toast)return;
    const id=window.setTimeout(()=>setToast(false),2600);
    return()=>window.clearTimeout(id);
  },[toast]);

  return <>
    <main className="screen home-screen">
      {toast&&<div className="toast">提案を更新しました</div>}
      <header><span>{new Intl.DateTimeFormat('ja-JP',{month:'long',day:'numeric',weekday:'short'}).format(new Date())}</span><h1>今日も、少しだけ。</h1></header>
      <h2>今日の運動</h2>
      <section className="goal-card"><div className="trophy"><Trophy/></div><div><strong>今日の運動達成率</strong><div className="linear"><i style={{width:rate+'%'}}/></div><span>{today.length}回完了</span></div><b>{rate}%</b></section>
      <div className="section-heading"><h2>今日おすすめの運動</h2><span>すぐに始められます</span></div>
      <section className="exercise-list">{items.map(exercise=><ExerciseCard key={exercise.id} exercise={exercise} start={open}/>)}</section>
      <button className="refresh" onClick={refresh}><RotateCcw/>提案を更新する</button>
    </main>
    {selected&&<div className="backdrop">
      <section className="modal">
        <h2>運動時間を選択</h2>
        <strong>{selected.name}</strong>
        <p className="modal-guide">{selected.description}</p>
        <span>目安時間</span>
        <div className="chosen">{minutes}<small>分</small></div>
        <input type="range" min={selected.baseMinutes} max={selected.baseMinutes*2} value={minutes} onChange={e=>setMinutes(+e.target.value)}/>
        <div className="range-labels"><span>{selected.baseMinutes}分</span><span>{selected.baseMinutes*2}分</span></div>
        <div className="modal-actions"><button className="outline" onClick={()=>setSelected(null)}>キャンセル</button><button className="primary" onClick={begin}>開始する</button></div>
      </section>
    </div>}
  </>;
}

import { useEffect, type CSSProperties } from 'react';
import { Flame, Pause, Play, Square } from 'lucide-react';
import { byId, hasExecutedAllExercises } from '../data/exercises';
import type { RecordItem, SetState, State, Timer } from '../types';

export function TimerScreen({state,setState,done}:{state:State;setState:SetState;done:(record:RecordItem)=>void}){
  const timer=state.timer;
  if(!timer)return null;
  const exercise=byId(timer.exerciseId);
  const finish=(completed:boolean)=>{
    const elapsed=Math.max(0,timer.durationSeconds-timer.remainingSeconds);
    const minutes=Math.round(elapsed/6)/10;
    const record:RecordItem={
      id:crypto.randomUUID(),
      exerciseId:exercise.id,
      completedAt:new Date().toISOString(),
      minutes,
      kcal:Math.round(minutes*exercise.kcalPerMinute*10)/10,
      status:completed?'completed':'incomplete'
    };
    setState(s=>{
      const records=[record,...s.records];
      return {...s,timer:null,records,proposedExerciseIds:hasExecutedAllExercises(records)?[]:s.proposedExerciseIds};
    });
    done(record);
  };

  useEffect(()=>{
    if(timer.status!=='running'||!timer.endsAt)return;
    const update=()=>setState(s=>{
      if(!s.timer||s.timer.status!=='running'||!s.timer.endsAt)return s;
      const left=Math.max(0,Math.ceil((s.timer.endsAt-Date.now())/1000));
      return{...s,timer:{...s.timer,remainingSeconds:left,status:left===0?'paused':'running',endsAt:left===0?null:s.timer.endsAt}};
    });
    update();
    const id=window.setInterval(update,200);
    return()=>window.clearInterval(id);
  },[timer.status,timer.endsAt,setState]);

  useEffect(()=>{if(timer.remainingSeconds===0)finish(true)},[timer.remainingSeconds]);

  const progress=Math.round((1-timer.remainingSeconds/timer.durationSeconds)*100);
  const mm=String(Math.floor(timer.remainingSeconds/60)).padStart(2,'0');
  const ss=String(timer.remainingSeconds%60).padStart(2,'0');
  const remainingKcal=(timer.remainingSeconds/60*exercise.kcalPerMinute).toFixed(1);
  const setStatus=(status:Timer['status'])=>setState(s=>({...s,timer:{...timer,status,endsAt:status==='running'?Date.now()+timer.remainingSeconds*1000:null}}));

  return <main className="screen timer-screen">
    <span className="overline">現在の運動</span>
    <h1>{exercise.name}</h1>
    <div className="timer-ring" style={{'--progress':progress*3.6+'deg'} as CSSProperties}><div><span>残り</span><strong>{mm}:{ss}</strong><small>{progress}%</small></div></div>
    <div className="live-stats"><div><span>進捗率</span><strong>{progress}%</strong></div><div><Flame/><span>残り消費カロリー</span><strong>{remainingKcal} kcal</strong></div></div>
    <div className="timer-actions">{timer.status==='running'?<button className="primary" onClick={()=>setStatus('paused')}><Pause/>一時停止</button>:<button className="primary" onClick={()=>setStatus('running')}><Play/>{timer.status==='paused'?'再開':'開始'}</button>}<button className="danger" onClick={()=>finish(false)}><Square/>途中で終了</button></div>
    <p className="guide">{exercise.description}</p>
  </main>;
}

import type { RecordItem, State, ThemeColor } from '../types';

const KEY='hitokoe-state-v2';
const themeColors:ThemeColor[]=['green','blue','orange','pink'];
const isThemeColor=(value:unknown):value is ThemeColor=>themeColors.includes(value as ThemeColor);

export const initialState:State={
  records:[],
  timer:null,
  darkMode:false,
  themeColor:'green',
  proposedExerciseIds:[]
};

function normalizeState(state:Partial<State>|null|undefined):State{
  const source=state||{};
  const timer=source.timer||null;
  if(timer?.status==='running'&&timer.endsAt){
    timer.remainingSeconds=Math.max(0,Math.ceil((timer.endsAt-Date.now())/1000));
    if(timer.remainingSeconds===0){timer.status='paused';timer.endsAt=null}
  }
  return {
    records:(source.records||[]).map((r:RecordItem)=>({...r,status:r.status||'completed'})),
    timer,
    darkMode:Boolean(source.darkMode),
    themeColor:isThemeColor(source.themeColor)?source.themeColor:'green',
    proposedExerciseIds:source.proposedExerciseIds||[]
  };
}

export function loadState():State{
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    return normalizeState(saved);
  }catch{
    return initialState;
  }
}

export function saveState(state:State){
  localStorage.setItem(KEY,JSON.stringify(state));
}

export function mergeStates(local:State, remote:State):State{
  const records=[...remote.records,...local.records];
  const unique=Array.from(new Map(records.map(record=>[record.id,record])).values());
  unique.sort((a,b)=>new Date(b.completedAt).getTime()-new Date(a.completedAt).getTime());
  return {
    records:unique,
    timer:local.timer,
    darkMode:local.darkMode,
    themeColor:local.themeColor,
    proposedExerciseIds:Array.from(new Set([...(remote.proposedExerciseIds||[]),...(local.proposedExerciseIds||[])]))
  };
}

export async function loadServerState():Promise<State|null>{
  try{
    const response=await fetch('/api/state');
    if(!response.ok)return null;
    const state=await response.json();
    return {...normalizeState(state),timer:null};
  }catch{
    return null;
  }
}

export async function saveServerState(state:State){
  try{
    await fetch('/api/state',{
      method:'PUT',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({...state,timer:null})
    });
  }catch{
    // サーバーがない環境ではlocalStorageだけで動かします。
  }
}

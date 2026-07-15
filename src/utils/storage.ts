import type { RecordItem, State } from '../types';

const KEY='hitokoe-state-v2';
export const initialState:State={records:[],timer:null,notifications:true,proposedExerciseIds:[]};

export function loadState():State{
  try{
    const s=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!s)return initialState;
    s.records=(s.records||[]).map((r:RecordItem)=>({...r,status:r.status||'completed'}));
    s.proposedExerciseIds=s.proposedExerciseIds||[];
    if(s.timer?.status==='running'&&s.timer.endsAt){
      s.timer.remainingSeconds=Math.max(0,Math.ceil((s.timer.endsAt-Date.now())/1000));
      if(s.timer.remainingSeconds===0){s.timer.status='paused';s.timer.endsAt=null}
    }
    return s;
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
    notifications:remote.notifications ?? local.notifications,
    proposedExerciseIds:Array.from(new Set([...(remote.proposedExerciseIds||[]),...(local.proposedExerciseIds||[])]))
  };
}

export async function loadServerState():Promise<State|null>{
  try{
    const response=await fetch('/api/state');
    if(!response.ok)return null;
    const state=await response.json();
    return {...initialState,...state,records:(state.records||[]).map((r:RecordItem)=>({...r,status:r.status||'completed'})),proposedExerciseIds:state.proposedExerciseIds||[],timer:null};
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
    // サーバがない開発環境ではlocalStorageだけで動かします。
  }
}

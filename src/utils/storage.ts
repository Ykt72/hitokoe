import type { RecordItem, State } from '../types';

const KEY='hitokoe-state-v2';
export const initialState:State={records:[],timer:null,notifications:true};

export function loadState():State{
  try{
    const s=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!s)return initialState;
    s.records=(s.records||[]).map((r:RecordItem)=>({...r,status:r.status||'completed'}));
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

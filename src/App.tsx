import { type CSSProperties, useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { CompleteScreen } from './screens/CompleteScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TimerScreen } from './screens/TimerScreen';
import type { RecordItem, Screen, ThemeColor } from './types';
import { loadServerState, loadState, mergeStates, saveServerState, saveState } from './utils/storage';

const themePalettes:Record<ThemeColor,CSSProperties>={
  green:{'--accent':'#22a73b','--accent-strong':'#188f30','--accent-soft':'#e7f8e9','--accent-border':'#bde7c4'},
  blue:{'--accent':'#2478d4','--accent-strong':'#1a5fae','--accent-soft':'#e7f0fb','--accent-border':'#bfd6f3'},
  orange:{'--accent':'#e9781a','--accent-strong':'#c65f10','--accent-soft':'#fff0e3','--accent-border':'#f5cfad'},
  pink:{'--accent':'#d94d83','--accent-strong':'#b8386b','--accent-soft':'#fde8f0','--accent-border':'#f2bed2'}
};

export function App(){
  const[state,setState]=useState(loadState);
  const[serverReady,setServerReady]=useState(false);
  const[screen,setScreen]=useState<Screen>('home');
  const[completed,setCompleted]=useState<RecordItem|null>(null);

  useEffect(()=>{
    loadServerState().then(remote=>{
      if(remote)setState(local=>mergeStates(local,remote));
      setServerReady(true);
    });
  },[]);

  useEffect(()=>{
    saveState(state);
    if(serverReady)saveServerState(state);
  },[state,serverReady]);

  const done=(record:RecordItem)=>{setCompleted(record);setScreen('complete')};

  const stageClass=state.darkMode?'stage dark-theme':'stage';
  const themeStyle=themePalettes[state.themeColor];

  return <div className={stageClass} style={themeStyle}><div className="phone">
    {screen==='home'&&<HomeScreen state={state} setState={setState} go={()=>setScreen('timer')}/>}
    {screen==='timer'&&<TimerScreen state={state} setState={setState} done={done}/>}
    {screen==='complete'&&completed&&<CompleteScreen record={completed} home={()=>setScreen('home')} records={()=>setScreen('records')}/>}
    {screen==='records'&&<RecordsScreen records={state.records}/>}
    {screen==='settings'&&<SettingsScreen state={state} setState={setState}/>}
    {(screen==='home'||screen==='records'||screen==='settings')&&<Nav active={screen} go={setScreen}/>}
  </div></div>;
}

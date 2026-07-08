import { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { CompleteScreen } from './screens/CompleteScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TimerScreen } from './screens/TimerScreen';
import type { RecordItem, Screen } from './types';
import { loadServerState, loadState, mergeStates, saveServerState, saveState } from './utils/storage';

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

  return <div className="stage"><div className="phone">
    {screen==='home'&&<HomeScreen state={state} setState={setState} go={()=>setScreen('timer')}/>}
    {screen==='timer'&&<TimerScreen state={state} setState={setState} done={done}/>}
    {screen==='complete'&&completed&&<CompleteScreen record={completed} home={()=>setScreen('home')} records={()=>setScreen('records')}/>}
    {screen==='records'&&<RecordsScreen records={state.records}/>}
    {screen==='settings'&&<SettingsScreen state={state} setState={setState}/>}
    {(screen==='home'||screen==='records'||screen==='settings')&&<Nav active={screen} go={setScreen}/>}
  </div></div>;
}

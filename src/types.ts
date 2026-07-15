import type { Dispatch, SetStateAction } from 'react';

export type Level='low'|'medium'|'high';
export type Tab='home'|'records'|'settings';
export type Screen=Tab|'timer'|'complete';
export type ThemeColor='green'|'blue'|'orange'|'pink';

export type Exercise={
  id:string;
  name:string;
  intensity:Level;
  baseMinutes:number;
  kcalPerMinute:number;
  description:string;
  image:string;
};

export type Timer={
  exerciseId:string;
  durationSeconds:number;
  remainingSeconds:number;
  endsAt:number|null;
  status:'ready'|'running'|'paused';
};

export type RecordItem={
  id:string;
  exerciseId:string;
  completedAt:string;
  minutes:number;
  kcal:number;
  status:'completed'|'incomplete';
};

export type State={
  records:RecordItem[];
  timer:Timer|null;
  darkMode:boolean;
  themeColor:ThemeColor;
  proposedExerciseIds:string[];
};

export type SetState=Dispatch<SetStateAction<State>>;

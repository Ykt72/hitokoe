import { Clock3, Flame, Play } from 'lucide-react';
import { labels } from '../data/exercises';
import type { Exercise } from '../types';

export function ExerciseCard({exercise,start}:{exercise:Exercise;start:(exercise:Exercise)=>void}){
  return <article className={'exercise-card '+exercise.intensity}>
    <div className={'exercise-visual '+exercise.intensity}>
      <img src={exercise.image} alt={exercise.name+'のイラスト'}/>
      <b>{labels[exercise.intensity]}</b>
    </div>
    <div className="exercise-info">
      <span className="level">{labels[exercise.intensity]}強度</span>
      <h3>{exercise.name}</h3>
      <div className="meta">
        <span><Clock3/>{exercise.baseMinutes}分</span>
        <span><Flame/>約{exercise.baseMinutes*exercise.kcalPerMinute}kcal</span>
      </div>
      <button onClick={()=>start(exercise)}><Play/>この運動を始める</button>
    </div>
  </article>;
}

import { Check, ChevronRight, Flame, Square } from 'lucide-react';
import { byId } from '../data/exercises';
import type { RecordItem } from '../types';

export function CompleteScreen({record,home,records}:{record:RecordItem;home:()=>void;records:()=>void}){
  const exercise=byId(record.exerciseId);
  const ok=record.status==='completed';
  return <main className={'screen complete-screen '+(ok?'':'incomplete-screen')}>
    <div className="complete-check">{ok?<Check/>:<Square/>}</div>
    <span>{ok?'運動完了！':'今回は未達成'}</span>
    <h1>{exercise.name}</h1>
    <p>{ok?'おつかれさまでした。今日の一歩を記録しました。':'途中で終了した記録を残しました。無理せず、またできる時に始めましょう。'}</p>
    <section className="result-card"><div><span>実施時間</span><strong>{record.minutes}分</strong></div><div><Flame/><span>消費カロリー</span><strong>{record.kcal} kcal</strong></div></section>
    <button className="primary wide" onClick={home}>ホームへ戻る</button>
    <button className="text-button" onClick={records}>記録を見る<ChevronRight/></button>
  </main>;
}

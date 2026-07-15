import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initialState, loadServerState, loadState, mergeStates, saveServerState, saveState } from './storage';
import type { RecordItem, State } from '../types';

const record = (id: string, completedAt: string): RecordItem => ({
  id,
  exerciseId: 'walk',
  completedAt,
  minutes: 5,
  kcal: 10,
  status: 'completed',
});

describe('local state persistence', () => {
  beforeEach(() => localStorage.clear());

  it('returns the initial state when saved JSON is invalid', () => {
    localStorage.setItem('hitokoe-state-v2', '{broken');
    expect(loadState()).toEqual(initialState);
  });

  it('saves and restores user settings and records', () => {
    const state: State = {
      ...initialState,
      darkMode: true,
      backgroundColor: 'mint',
      records: [record('one', '2026-07-01T10:00:00.000Z')],
    };
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it('normalizes unsupported appearance values', () => {
    localStorage.setItem('hitokoe-state-v2', JSON.stringify({
      backgroundPattern: 'invalid',
      backgroundColor: 'invalid',
      backgroundPatternColor: 'invalid',
    }));
    expect(loadState()).toMatchObject({
      backgroundPattern: 'plain',
      backgroundColor: 'white',
      backgroundPatternColor: 'mint',
    });
  });
});

describe('state synchronization', () => {
  it('deduplicates records, sorts newest first, and keeps local preferences', () => {
    const local: State = {
      ...initialState,
      darkMode: true,
      proposedExerciseIds: ['local'],
      records: [record('same', '2026-07-02T10:00:00.000Z')],
    };
    const remote: State = {
      ...initialState,
      proposedExerciseIds: ['remote'],
      records: [
        record('old', '2026-07-01T10:00:00.000Z'),
        record('same', '2026-07-02T10:00:00.000Z'),
      ],
    };

    const merged = mergeStates(local, remote);
    expect(merged.records.map(item => item.id)).toEqual(['same', 'old']);
    expect(merged.darkMode).toBe(true);
    expect(merged.proposedExerciseIds).toEqual(['remote', 'local']);
  });

  it('loads server state without restoring an active timer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...initialState, timer: { exerciseId: 'walk' } }),
    }));
    await expect(loadServerState()).resolves.toMatchObject({ timer: null });
  });

  it('never sends an active timer to the server', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const state = { ...initialState, timer: { exerciseId: 'walk', durationSeconds: 60, remainingSeconds: 60, endsAt: null, status: 'ready' as const } };
    await saveServerState(state);
    const request = fetchMock.mock.calls[0][1];
    expect(JSON.parse(request.body)).toMatchObject({ timer: null });
  });
});

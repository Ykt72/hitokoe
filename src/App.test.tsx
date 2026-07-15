import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('main exercise flow', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    vi.stubGlobal('crypto', { randomUUID: () => 'test-record-id' });
  });

  it('opens an exercise, starts its timer, and records an early finish', async () => {
    const { container } = render(<App />);

    await waitFor(() => expect(container.querySelector('.exercise-card')).toBeInTheDocument());
    fireEvent.click(container.querySelector('.exercise-card button')!);
    expect(container.querySelector('.modal')).toBeInTheDocument();

    fireEvent.click(container.querySelector('.modal .primary')!);
    expect(container.querySelector('.timer-screen')).toBeInTheDocument();
    expect(container.querySelector('.timer-ring strong')).toHaveTextContent(/\d{2}:\d{2}/);

    fireEvent.click(container.querySelector('.timer-actions .danger')!);
    expect(container.querySelector('.complete-screen')).toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem('hitokoe-state-v2')!);
    expect(saved.records[0]).toMatchObject({
      id: 'test-record-id',
      status: 'incomplete',
    });
  });

  it('moves between the home, records, and settings screens', async () => {
    const { container } = render(<App />);
    await waitFor(() => expect(container.querySelector('.bottom-nav')).toBeInTheDocument());
    const buttons = container.querySelectorAll('.bottom-nav button');

    fireEvent.click(buttons[1]);
    expect(container.querySelector('.records-screen')).toBeInTheDocument();

    fireEvent.click(container.querySelectorAll('.bottom-nav button')[2]);
    expect(container.querySelector('.settings-screen')).toBeInTheDocument();
  });
});

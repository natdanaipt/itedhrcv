/**
 * assignmentStore.js
 * จัดการประวัติการมอบหมายงาน (localStorage)
 */

const HISTORY_KEY = 'ited_assignment_history_v1';

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addAssignment(entry) {
  const history = getHistory();
  const record = {
    id: `assign-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    assignedAt: new Date().toISOString(),
    ...entry
  };
  history.unshift(record); // ใหม่สุดอยู่บน
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
  return record;
}

export function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY); } catch {}
}

export default { getHistory, addAssignment, clearHistory };

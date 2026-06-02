// Centralized fetch-based API Client for communicating with Spring Boot endpoints.
const API_BASE = '/api';

export async function fetchIdeas(domain = '', query = '') {
  let url = `${API_BASE}/ideas`;
  const params = [];
  if (domain && domain !== 'All') params.push(`domain=${encodeURIComponent(domain)}`);
  if (query) params.push(`query=${encodeURIComponent(query)}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ideas.');
  return res.json();
}

export async function fetchIdeaById(id) {
  const res = await fetch(`${API_BASE}/ideas/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch idea #${id}`);
  return res.json();
}

export async function submitIdea(ideaData, force = false) {
  const res = await fetch(`${API_BASE}/ideas?force=${force}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ideaData),
  });
  
  if (res.status === 491 || res.status === 409) { // Conflict / Similarity violation
    return res.json(); // Will contain { similarityWarning: true, message: ... }
  }
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (err.similarityWarning) return err;
    throw new Error('Failed to submit idea.');
  }
  
  return res.json();
}

export async function updateFinancials(id, financials) {
  const res = await fetch(`${API_BASE}/ideas/${id}/financials`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(financials),
  });
  if (!res.ok) throw new Error('Failed to update financial scenario.');
  return res.json();
}

export async function logInteraction(id, actionType) {
  const res = await fetch(`${API_BASE}/ideas/${id}/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType }),
  });
  if (!res.ok) throw new Error('Failed to log interaction.');
  return res.json();
}

export async function fetchPipelineBoard() {
  const res = await fetch(`${API_BASE}/pipeline`);
  if (!res.ok) throw new Error('Failed to fetch pipeline board.');
  return res.json();
}

export async function addDealToPipeline(ideaId, stage = 'contacted', founderName = 'Unknown') {
  const res = await fetch(`${API_BASE}/pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ideaId, stage, founderName }),
  });
  if (!res.ok) throw new Error('Failed to add deal to pipeline.');
  return res.json();
}

export async function updateDealStage(dealId, stage) {
  const res = await fetch(`${API_BASE}/pipeline/${dealId}/stage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error('Failed to move deal stage.');
  return res.json();
}

export async function fetchAutomationRules() {
  const res = await fetch(`${API_BASE}/automation/rules`);
  if (!res.ok) throw new Error('Failed to fetch rules.');
  return res.json();
}

export async function toggleAutomationRule(id) {
  const res = await fetch(`${API_BASE}/automation/rules/${id}/toggle`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to toggle rule.');
  return res.json();
}

export async function createAutomationRule(rule) {
  const res = await fetch(`${API_BASE}/automation/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!res.ok) throw new Error('Failed to create rule.');
  return res.json();
}

export async function runAutomationEngine() {
  const res = await fetch(`${API_BASE}/automation/run`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to run automation rule engine.');
  return res.json();
}

export async function fetchFounderAnalytics(ideaId) {
  const res = await fetch(`${API_BASE}/analytics/founder/${ideaId}`);
  if (!res.ok) throw new Error('Failed to fetch founder analytics.');
  return res.json();
}

export async function fetchInvestorAnalytics() {
  const res = await fetch(`${API_BASE}/analytics/investor`);
  if (!res.ok) throw new Error('Failed to fetch investor analytics.');
  return res.json();
}

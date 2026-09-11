// Client for the SLURM bridge service (see bridge/README.md).
// The bridge runs on your side (a machine that can SSH to the cluster) and
// exposes three endpoints: POST /jobs, GET /jobs/:id, DELETE /jobs/:id.

const BASE: string =
  (import.meta.env['VITE_ENHANCE_API'] as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8000";

export type JobState = "queued" | "running" | "completed" | "failed";

export type JobStatus = {
  id: string;
  state: JobState;
  slurm_job_id?: string | null;
  log?: string[];
  enhanced_url?: string | null;
  error?: string | null;
};

export const enhanceApiBase = BASE;

export async function submitJob(blob: Blob, filename = "recording.webm"): Promise<JobStatus> {
  const form = new FormData();
  form.append("file", blob, filename);
  const res = await fetch(`${BASE}/jobs`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return (await res.json()) as JobStatus;
}

export async function getJob(id: string): Promise<JobStatus> {
  const res = await fetch(`${BASE}/jobs/${id}`);
  if (!res.ok) throw new Error(`Status check failed (${res.status})`);
  return (await res.json()) as JobStatus;
}

export async function deleteJob(id: string): Promise<void> {
  await fetch(`${BASE}/jobs/${id}`, { method: "DELETE" }).catch(() => undefined);
}

export function enhancedUrl(status: JobStatus): string | null {
  if (!status.enhanced_url) return null;
  return status.enhanced_url.startsWith("http")
    ? status.enhanced_url
    : `${BASE}${status.enhanced_url}`;
}

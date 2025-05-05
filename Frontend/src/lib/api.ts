export async function apiFetch<T>(
    path: string,
    opts: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}${path}`,
      {
        credentials: "include",          // sends cookies automatically
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        ...opts,
      }
    );
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || res.statusText);
    }
    return res.json();
  }
  
// Public API reads in server components; null on any failure
export const cs_serverFetch = async <T>(cs_path: string, cs_revalidate = 60): Promise<T | null> => {
  try {
    const cs_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${cs_path}`, {
      next: { revalidate: cs_revalidate },
    });
    if (!cs_response.ok) return null;
    return (await cs_response.json()) as T;
  } catch {
    return null;
  }
};

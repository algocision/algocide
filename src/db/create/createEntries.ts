import { IEntry } from 'prisma/schema';

export const createEntries = async (entry_data: IEntry[]): Promise<Response> => {
  const fetch_res = await fetch('/api/create-entries', {
    method: 'POST',
    body: JSON.stringify(entry_data),
  });

  if (!fetch_res.ok) {
    throw new Error(fetch_res.statusText);
  }

  return await fetch_res.json();
};

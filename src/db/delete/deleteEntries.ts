import { ValueTypes } from 'prisma/schema';

export interface IEntryDeleteOptions {
  where: Record<string, ValueTypes>;
}

export const deleteEntries = async (
  opts: IEntryDeleteOptions
): Promise<Response> => {
  const fetch_res = await fetch(`/api/delete-entries`, {
    method: 'POST',
    body: JSON.stringify(opts),
  });

  if (!fetch_res.ok) {
    throw new Error(fetch_res.statusText);
  }

  return await fetch_res.json();
};

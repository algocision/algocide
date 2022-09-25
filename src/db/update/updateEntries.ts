import { ValueTypes } from 'prisma/schema';

export interface IEntryUpdateOptions {
  where: Record<string, ValueTypes>;
  data: Record<string, ValueTypes>;
}

export const updateEntries = async (
  opts: IEntryUpdateOptions
): Promise<Response> => {
  const fetch_res = await fetch(`/api/update-entries`, {
    method: 'POST',
    body: JSON.stringify(opts),
  });

  if (!fetch_res.ok) {
    throw new Error(fetch_res.statusText);
  }

  return await fetch_res.json();
};

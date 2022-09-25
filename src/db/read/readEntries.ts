export interface IEntryReadOptions {
  amount?: number;
}

export const readEntries = async (
  opts: IEntryReadOptions = { amount: 1 }
): Promise<Response> => {
  const fetch_res = await fetch(`/api/read-entries?amount=${opts.amount}`, {
    method: 'POST',
  });

  if (!fetch_res.ok) {
    throw new Error(fetch_res.statusText);
  }

  return await fetch_res.json();
};

export const JSONparse = <T>(s: string): T | null => {
  try {
    return JSON.parse(s);
  } catch (error) {
    return null;
  }
};

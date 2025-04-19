export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isValidDateString = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

export const compareDates = (a: string, b: string): number => {
  return new Date(a).getTime() - new Date(b).getTime();
}; 
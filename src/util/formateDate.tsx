const formatDateRange = (start: Date | string, end: Date | string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startFormatted = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endFormatted = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startFormatted} - ${endFormatted}`;
};

export default formatDateRange;

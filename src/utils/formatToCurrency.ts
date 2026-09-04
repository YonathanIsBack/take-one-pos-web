function formatToCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return '-';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(numericValue);
}

export default formatToCurrency;

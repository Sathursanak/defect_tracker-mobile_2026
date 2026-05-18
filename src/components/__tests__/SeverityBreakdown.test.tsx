// Simple unit tests for pie chart data processing

const mockDefectData = {
  high: {
    total: 25,
    reopen: 3,
    closed: 8,
    new: 5,
    reject: 2,
    open: 4,
    duplicate: 1,
    fixed: 2,
  },
  medium: {
    total: 15,
    reopen: 2,
    closed: 5,
    new: 3,
    reject: 1,
    open: 2,
    duplicate: 1,
    fixed: 1,
  },
  low: {
    total: 10,
    reopen: 1,
    closed: 3,
    new: 2,
    reject: 0,
    open: 2,
    duplicate: 1,
    fixed: 1,
  },
};

describe('SeverityBreakdown', () => {
  it('should have correct pie chart data structure', () => {
    // Test the data structure that would be passed to PieChart
    const data = mockDefectData.high;
    const segments = [
      { value: data.new, color: '#3b82f6', label: 'NEW' },
      { value: data.fixed, color: '#22c55e', label: 'FIXED' },
      { value: data.closed, color: '#16a34a', label: 'CLOSED' },
      { value: data.open, color: '#eab308', label: 'OPEN' },
      { value: data.reopen, color: '#ef4444', label: 'REOPEN' },
      { value: data.reject, color: '#7f1d1d', label: 'REJECT' },
      { value: data.duplicate, color: '#6b7280', label: 'DUPLICATE' },
    ].filter(segment => segment.value > 0);

    const series = segments.map(segment => ({
      value: segment.value,
      color: segment.color,
    }));

    // Verify the series structure is correct for PieChart
    expect(series).toHaveLength(7); // All segments have values > 0
    expect(series[0]).toEqual({ value: 5, color: '#3b82f6' }); // NEW
    expect(series[1]).toEqual({ value: 2, color: '#22c55e' }); // FIXED

    // Verify total calculation
    const total = series.reduce((sum, item) => sum + item.value, 0);
    expect(total).toBe(25);
  });

  it('should calculate percentages correctly', () => {
    const data = mockDefectData.high;
    const total = data.total;

    // Test percentage calculation for NEW defects
    const newPercentage = ((data.new / total) * 100).toFixed(1);
    expect(newPercentage).toBe('20.0'); // 5/25 = 20%

    // Test percentage calculation for CLOSED defects
    const closedPercentage = ((data.closed / total) * 100).toFixed(1);
    expect(closedPercentage).toBe('32.0'); // 8/25 = 32%
  });

  it('should filter out zero-value segments', () => {
    const data = mockDefectData.low; // This has reject: 0
    const segments = [
      { value: data.new, color: '#3b82f6', label: 'NEW' },
      { value: data.fixed, color: '#22c55e', label: 'FIXED' },
      { value: data.closed, color: '#16a34a', label: 'CLOSED' },
      { value: data.open, color: '#eab308', label: 'OPEN' },
      { value: data.reopen, color: '#ef4444', label: 'REOPEN' },
      { value: data.reject, color: '#7f1d1d', label: 'REJECT' },
      { value: data.duplicate, color: '#6b7280', label: 'DUPLICATE' },
    ].filter(segment => segment.value > 0);

    // Should exclude REJECT since it has value 0
    expect(segments).toHaveLength(6);
    expect(segments.find(s => s.label === 'REJECT')).toBeUndefined();
  });
});

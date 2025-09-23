export function exportToCsv(filename: string, data: any[]) {
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csvContent = 'data:text/csv;charset=utf-8,' + header + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
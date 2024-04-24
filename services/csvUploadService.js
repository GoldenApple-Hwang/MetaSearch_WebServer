// services/csvService.js
function validateCsvFile(file) {
  if (!file) {
    throw new Error('No file uploaded.');
  }

  const extension = file.originalname.split('.').pop();
  const mimeType = file.mimetype;
  if (
    (mimeType === 'text/csv' && extension !== 'csv') ||
    (mimeType === 'application/vnd.ms-excel' && extension !== 'csv')
  ) {
    throw new Error('Only .csv files are allowed.');
  }

  return file; // Return file if validation is successful
}

export default validateCsvFile;

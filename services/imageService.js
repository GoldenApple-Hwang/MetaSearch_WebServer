// services/imageServices.js
function validateImage(file) {
  if (!file) {
    throw new Error('No file uploaded.');
  }

  const extension = file.originalname.split('.').pop();
  const mimeType = file.mimetype;
  if (
    (mimeType === 'image/jpeg' && (extension !== 'jpg' && extension !== 'jpeg')) ||
    (mimeType === 'image/png' && extension !== 'png') ||
    (mimeType === 'image/heic' && extension !== 'heic')
  ) {
    throw new Error('File extension does not match MIME type.');
  }

  return file; // Return file if validation is successful
}

export default validateImage;

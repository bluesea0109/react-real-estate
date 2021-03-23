export const validateFile = file => {
  if (!file) {
    return 'No File Found';
  }
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    return 'File upload failed. Your design is not a supported file type. (JPEG or PNG)';
  }
  if (file.size > 5000000) {
    return 'File upload failed. Your design exceeded the 5MB size limit.';
  }
  return null;
};

export const verifyImageSize = (image, size) => {
  const { width, height } = image;
  switch (size) {
    case '6x11':
    case '11x6':
      if (width < 3375 || height < 1875) return false;
      else return true;
    case '6x9':
    case '9x6':
      if (width < 2775 || height < 1875) return false;
      else return true;
    default:
      if (width < 1875 || height < 1275) return false;
      else return true;
  }
};

export const getMinImageSize = size => {
  switch (size) {
    case '6x11':
    case '11x6':
      return { width: 3375, height: 1875 };
    case '6x9':
    case '9x6':
      return { width: 2775, height: 1875 };
    default:
      return { width: 1875, height: 1275 };
  }
};

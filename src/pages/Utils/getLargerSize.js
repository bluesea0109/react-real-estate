export const getLargerSize = size => {
  switch (size) {
    case '9x6':
    case '6x9':
    case '11x6':
    case '6x11':
      return true;
    default:
      return false;
  }
};

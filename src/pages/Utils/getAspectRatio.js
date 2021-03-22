export const getAspectRatio = size => {
  switch (size) {
    case '9x6':
    case '6x9':
      return 9.25 / 6.25;
    case '11x6':
    case '6x11':
      return 11.25 / 6.25;
    default:
      return 6.25 / 4.25;
  }
};

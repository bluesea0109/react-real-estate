
const postCardDimension = (size) => {
let dimension = '';

switch (size) {
  case '4x6': dimension = '6x4';
  break;
  case '6x9': dimension = '9x6';
  break;
  case '6x11': dimension = '11x6';
  break;
  default:
}

return dimension
}

export default postCardDimension;
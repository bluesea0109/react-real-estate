const mql = window.matchMedia('(max-width: 599px)');
export const isMobile = () => mql.matches;

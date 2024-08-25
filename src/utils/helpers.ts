export function getUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.priashop.com/';
  } else {
    return 'http://localhost:3000';
  }
}

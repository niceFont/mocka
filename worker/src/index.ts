import { handleRequest } from './handler';

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleRequest(event));
  } catch (error) {
    console.log(error);
  }
});

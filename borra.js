import ky from 'https://unpkg.com/ky/index.js';

ky( "http://localhost:8000/timeout",{
    method: "GET",
    url: "http://localhost:8000/timeout",
    data: "hello",
    headers: { "content-type": "text/plain" }
  }).then(console.log)
export default function confirmBooking(url, body, callback) {

  var options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        callback('ok');
      }
      else {
        throw new Error
      }
    })
    .catch((errors) => {
      console.log('Put error: ', errors);
    })
}
export default function confirmBooking(url, body, callback) {

  var options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  console.log('options',options)
  fetch(url, options)
    .then((res) => {
      console.log(res.status)
      if (res.ok) {
        callback('Yay');
      }
      else {
        throw new Error
      }
    })
    // .then((data) => {
    //   callback(data);
    // })
    .catch((errors) => {
      console.log('Put error: ', errors);
    })
}
export default function confirmBooking(url, body, callback) {

  // used in postDog.js
  var options = {
    method: 'PUT',
    body: body
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      callback(data);
    })
    .catch((errors) => {
      console.log('Add dog error: ', errors);
    })
}
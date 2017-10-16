export default function submitDog(url, formData, callback) {

  // used in postDog.js
  var options = {
    method: 'POST',
    body: formData
    // headers: {
    //   // accept: 'application/json',
    //   'Content-Type': 'multipart/form-data'
    // }
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
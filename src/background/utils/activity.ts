export const verbWords = {
  Like: 'liked',
  Response: 'replied to',
  Log: 'added',
  Follow: 'started following',
  Mention: 'mentioned',
  Add: 'added to:'
}
export const objectWords = {
  Knot: 'your note',
  Response: 'your response',
  Content: 'from you',
  User: 'you',
  Mention: 'you in a response',
  Primer: ''
}

// https://davidwalsh.name/convert-image-data-uri-javascript
export const getDataUri = (url, callback) => {
  var image = new Image()
  image.crossOrigin = "anonymous"

  image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

      canvas.getContext('2d').drawImage(this, 0, 0);

      // ... or get as Data URI
      callback(canvas.toDataURL('image/png'));
  }

  image.src = url
}

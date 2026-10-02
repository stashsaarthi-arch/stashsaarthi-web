(async () => {
  const formData = new FormData();
  formData.append('frontImage', new Blob(['test']), 'front.jpg');
  formData.append('backImage', new Blob(['test']), 'back.jpg');

  try {
    const res = await fetch('http://localhost:8080/api/updateKyc', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token'
      },
      body: formData
    });
    console.log(res.status);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
})();

/* public/js/scripts.js */
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('audioFile', document.getElementById('audioFile').files[0]);
  
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
  
    const data = await response.json();
    document.getElementById('solfaNotation').innerText = data.notation;
    document.getElementById('songKey').innerText = `Key: ${data.key}`;
  });
  
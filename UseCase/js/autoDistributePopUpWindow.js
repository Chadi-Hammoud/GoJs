document.getElementById('autoDistributeForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  data.type = "autoDistribute"

  if (window.opener && window.opener.receiveDataFromPopUps) {
    window.opener.receiveDataFromPopUps(data);
  } else {
    alert('Error: Could not access the main window.');
  }

  // // Send data back to the diagram
  // window.opener.postMessage(data, '*');
});


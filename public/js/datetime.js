function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dateTimeString = now.toLocaleDateString('en-US', options);

  document.getElementById('datetime').innerHTML = dateTimeString;
}

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Set the initial date and time when the page loads
updateDateTime();

document.addEventListener('DOMContentLoaded', function() {
  const fillButton = document.getElementById('fill-button');
  const status = document.getElementById('status');

  fillButton.addEventListener('click', function() {
    status.textContent = 'Starting...';
    console.log('Fill Form button clicked');
    // logic will go here
  });
});

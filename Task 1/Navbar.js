document.querySelector('.hamburger').onclick = function() {
  document.querySelector('.menu').classList.toggle('active');
};

// Toggle dropdown menu on mobile
document.querySelectorAll('.dropdown > a').forEach(function(dropLink) {
  dropLink.addEventListener('click', function(e) {
    // Only on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault(); // Prevent link navigation
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
      }
    }
  });
});
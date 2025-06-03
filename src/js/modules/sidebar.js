// Sidebar module: handles left/right panel minimization & restore.
(function() {
  function toggleSidebar(side) {
    const sidebar = document.getElementById(side + 'Sidebar');
    const restoreBtn = document.getElementById(side + 'RestoreBtn');
    if (!sidebar || !restoreBtn) return;

    if (sidebar.classList.contains('minimized')) {
      sidebar.classList.remove('minimized');
      restoreBtn.style.display = 'none';
    } else {
      sidebar.classList.add('minimized');
      restoreBtn.style.display = 'flex';
    }
  }

  // expose globally for other scripts & event listeners
  window.toggleSidebar = toggleSidebar;
  window.Sidebar = { toggle: toggleSidebar };
})();

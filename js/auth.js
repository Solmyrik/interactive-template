// Check if user is authenticated
const token = localStorage.getItem('authToken');

if (!token) {
  window.location.href = 'login.html';
}

// Check if user is admin
async function checkAdminAccess() {
  try {
    const response = await fetch('https://6db08c648d28728d.mokky.dev/auth_me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.href = 'login.html';
      return;
    }

    const userData = await response.json();
    if (!userData) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error checking admin access:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
  }
}

// Check authentication when page loads
checkAdminAccess(); 
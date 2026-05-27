/**
 * NETWORK DEBUGGING SCRIPT
 * Paste this entire script into browser console (F12 → Console tab)
 * This will monitor all network calls and log detailed information
 */

console.log('🔍 STARTING NETWORK DEBUG MODE...\n');

// Store all network requests
const networkLog = [];

// 1. Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const [resource, config] = args;
  const method = (config?.method || 'GET').toUpperCase();

  console.log(`\n📤 OUTGOING REQUEST:`);
  console.log(`   Method: ${method}`);
  console.log(`   URL: ${resource}`);
  console.log(`   Headers:`, config?.headers);
  console.log(`   Body:`, config?.body ? JSON.parse(config.body) : 'none');

  return originalFetch.apply(this, args).then(response => {
    const clonedResponse = response.clone();

    clonedResponse.json().then(data => {
      console.log(`\n📥 RESPONSE (${response.status}):`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Headers:`, {
        'content-type': response.headers.get('content-type'),
        'x-csrf-token': response.headers.get('x-csrf-token'),
        'set-cookie': response.headers.get('set-cookie')
      });
      console.log(`   Body:`, data);
    }).catch(() => {
      console.log(`\n📥 RESPONSE (${response.status}):`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   (Response is not JSON)`);
    });

    return response;
  }).catch(error => {
    console.log(`\n❌ REQUEST FAILED:`);
    console.log(`   Error: ${error.message}`);
    throw error;
  });
};

// 2. Monitor XMLHttpRequest (axios uses this)
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  this._debugMethod = method;
  this._debugUrl = url;
  return originalXHROpen.apply(this, [method, url, ...rest]);
};

const originalXHRSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(body) {
  console.log(`\n📤 XHR REQUEST:`);
  console.log(`   Method: ${this._debugMethod}`);
  console.log(`   URL: ${this._debugUrl}`);
  console.log(`   Cookies being sent:`, document.cookie);
  if (body) {
    try {
      console.log(`   Body:`, JSON.parse(body));
    } catch {
      console.log(`   Body:`, body);
    }
  }

  this.addEventListener('load', function() {
    console.log(`\n📥 XHR RESPONSE (${this.status}):`);
    console.log(`   Status: ${this.status} ${this.statusText}`);
    try {
      const data = JSON.parse(this.responseText);
      console.log(`   Body:`, data);
    } catch {
      console.log(`   Body:`, this.responseText.substring(0, 200));
    }
  });

  this.addEventListener('error', function() {
    console.log(`\n❌ XHR FAILED:`);
    console.log(`   Status: ${this.status}`);
  });

  return originalXHRSend.apply(this, [body]);
};

// 3. Session Storage Monitor
console.log('\n📦 CHECKING STORAGE:\n');
console.log('sessionStorage:', JSON.stringify(sessionStorage, null, 2));
console.log('localStorage:', JSON.stringify(localStorage, null, 2));

// 4. Cookie Monitor
console.log('\n🍪 CHECKING COOKIES:\n');
console.log('All Cookies:', document.cookie || '(none found)');
console.log('JSESSIONID Present?', document.cookie.includes('JSESSIONID') ? '✅ YES' : '❌ NO');
console.log('CSRF Token Present?', sessionStorage.getItem('X-CSRF-TOKEN') ? '✅ YES' : '❌ NO');

// 5. Check axios instance config
console.log('\n⚙️ CHECKING AXIOS CONFIG:\n');
if (window.axiosInstance) {
  console.log('Axios Base URL:', window.axiosInstance.defaults.baseURL);
  console.log('Axios withCredentials:', window.axiosInstance.defaults.withCredentials);
  console.log('Axios Headers:', window.axiosInstance.defaults.headers);
} else {
  console.log('❌ Axios instance not found in window');
}

// 6. Test basic connectivity
console.log('\n🧪 TESTING BACKEND CONNECTION:\n');

async function testBackend() {
  try {
    console.log('Testing: GET /api/health...');
    const response = await fetch('http://localhost:9000/api/health');
    const data = await response.json();
    console.log('✅ Backend is reachable!');
    console.log('Response:', data);
  } catch (error) {
    console.log('❌ Backend is NOT reachable:');
    console.log('Error:', error.message);
  }
}

await testBackend();

// 7. Test CSRF token fetch
console.log('\n🧪 TESTING CSRF TOKEN FETCH:\n');

async function testCSRFToken() {
  try {
    console.log('Testing: GET /api/csrf-token...');
    const response = await fetch('http://localhost:9000/api/csrf-token', {
      credentials: 'include'
    });
    const data = await response.json();
    console.log('✅ CSRF Token fetched!');
    console.log('Token:', data.token.substring(0, 20) + '...');
    console.log('Current Cookies after CSRF fetch:', document.cookie);
  } catch (error) {
    console.log('❌ CSRF Token fetch failed:');
    console.log('Error:', error.message);
  }
}

await testCSRFToken();

// 8. HELPER FUNCTIONS
window.debugHelpers = {
  // Check current auth state
  checkAuth: function() {
    console.log('\n=== AUTHENTICATION STATE ===');
    console.log('User in sessionStorage:', sessionStorage.getItem('user'));
    console.log('CSRF Token:', sessionStorage.getItem('X-CSRF-TOKEN')?.substring(0, 20) + '...');
    console.log('Cookies:', document.cookie);
    console.log('Is logged in?', sessionStorage.getItem('user') ? '✅ YES' : '❌ NO');
  },

  // Simulate login
  testLogin: async function(username = 'admin', password = 'admin123') {
    console.log('\n=== SIMULATING LOGIN ===');
    try {
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log('Login Response:', data);
      console.log('Cookies after login:', document.cookie);
      return data;
    } catch (error) {
      console.log('Login failed:', error);
    }
  },

  // Check tickets API
  testTickets: async function() {
    console.log('\n=== TESTING TICKETS API ===');
    try {
      const response = await fetch('http://localhost:9000/api/v1/tickets', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Tickets count:', data.data?.length || 0);
      console.log('First ticket:', data.data?.[0]);
      return data;
    } catch (error) {
      console.log('Tickets API failed:', error);
    }
  },

  // Clear all data
  clearAuth: function() {
    console.log('Clearing authentication...');
    sessionStorage.clear();
    localStorage.clear();
    console.log('✅ Auth cleared');
  }
};

console.log('\n✅ DEBUG MODE ACTIVE');
console.log('\n📝 AVAILABLE COMMANDS:');
console.log('   debugHelpers.checkAuth()     - Check current auth state');
console.log('   debugHelpers.testLogin()     - Simulate login request');
console.log('   debugHelpers.testTickets()   - Test tickets API');
console.log('   debugHelpers.clearAuth()     - Clear all auth data');
console.log('\n💡 All fetch/XHR requests will be logged automatically');

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/auth/login', { // Đảm bảo endpoint đúng
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.message === 'Đăng nhập thành công') {
            document.getElementById('loginModal').style.display = 'none';
            alert(data.message);

            localStorage.setItem('token', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));

            updateUIAfterLogin(data.user);
        } else {
            alert(data.message || 'Đăng nhập thất bại.');
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Đăng nhập thất bại. Vui lòng kiểm tra kết nối hoặc thử lại sau.');
    });
}

function updateUIAfterLogin(user) {
    if (!user || !user.username) {
        console.error('Không có thông tin người dùng hợp lệ.');
        return;
    }

    const currentUserElement = document.getElementById('current-user');
    currentUserElement.textContent = `Xin chào, ${user.username}`;
    currentUserElement.classList.remove('hidden');

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.classList.remove('hidden');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');

    const loginButton = document.getElementById('loginButton');
    loginButton.textContent = 'Đăng Nhập';
    loginButton.setAttribute('onclick', 'openLoginModal()');

    const logoutButton = loginButton.parentNode.querySelector('button:nth-child(2)');
    if (logoutButton) {
        logoutButton.remove();
    }

    alert('Bạn đã đăng xuất thành công.');
}

window.onload = () => {
    const token = localStorage.getItem('token');
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    if (token && authUser) {
        updateUIAfterLogin(authUser);
    }
};

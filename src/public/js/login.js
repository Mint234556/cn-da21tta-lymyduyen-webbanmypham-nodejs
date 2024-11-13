function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Đăng nhập thành công') {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('loginSuccessMessage').classList.remove('hidden');
            alert(data.message);
            // Lưu token để xác thực cho các lần truy cập tiếp theo
            localStorage.setItem('token', data.token);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });
}

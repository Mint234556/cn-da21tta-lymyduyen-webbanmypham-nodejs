// Hàm xử lý form đăng ký
function handleRegister(event) {
    event.preventDefault(); // Ngăn chặn gửi form

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Gửi thông tin đăng ký đến server
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => {
        if (response.ok) {
            // Nếu đăng ký thành công, ẩn form và hiển thị thông báo
            document.getElementById('registerForm').classList.add('hidden'); // Ẩn form đăng ký
            document.getElementById('successMessage').classList.remove('hidden'); // Hiển thị thông báo thành công
            document.getElementById('registerForm').reset(); // Xóa thông tin trong form
        } else {
            return response.json().then(error => {
                alert(error.message); // Hiển thị thông báo lỗi từ server
            });
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });
}
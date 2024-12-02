// Gọi API để lấy chi tiết sản phẩm và đánh giá
fetch(`/products/${productId}`)
    .then(response => response.json())
    .then(data => {
        const product = data.product;
        const reviews = data.reviews;

        // Hiển thị thông tin sản phẩm
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-image').src = product.image;

        // Hiển thị đánh giá
        const reviewsList = document.getElementById('reviews-list');
        reviews.forEach(review => {
            const reviewItem = document.createElement('li');
            reviewItem.textContent = `${review.user}: ${review.comment}`;
            reviewsList.appendChild(reviewItem);
        });
    })
    .catch(error => console.error('Error fetching product details:', error));

// Thêm sản phẩm vào giỏ
function addToCart() {
    const productId = 123;  // ID của sản phẩm
    const quantity = 1;     // Số lượng

    fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Thông báo khi thành công
    })
    .catch(error => console.error('Error adding to cart:', error));
}

// Gửi đánh giá
function submitReview(event) {
    event.preventDefault();

    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;
    const productId = 123;  // ID của sản phẩm

    fetch(`/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
    })
    .then(response => response.json())
    .then(data => {
        alert('Đánh giá đã được gửi');
    })
    .catch(error => console.error('Error submitting review:', error));
}

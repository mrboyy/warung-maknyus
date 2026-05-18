/**
 * WARUNG MAK NYUS - SCRIPT
 * Aplikasi Menu & Pemesanan Makanan UMKM
 */

// 1. DATA MENU (Minimal 8 item)
const menuData = [
    {
        id: 1,
        nama: "Nasi Goreng Spesial",
        kategori: "makanan",
        harga: 25000,
        deskripsi: "Nasi goreng dengan telur mata sapi, ayam suwir, dan kerupuk.",
        gambarURL: "https://images.unsplash.com/photo-1512058560566-42724afbc2db?w=500&auto=format&fit=crop"
    },
    {
        id: 2,
        nama: "Ayam Bakar Madu",
        kategori: "makanan",
        harga: 30000,
        deskripsi: "Ayam bakar dibumbui madu spesial, disajikan dengan lalapan.",
        gambarURL: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop"
    },
    {
        id: 3,
        nama: "Mie Goreng Jawa",
        kategori: "makanan",
        harga: 18000,
        deskripsi: "Mie goreng khas Jawa dengan sayuran segar dan bumbu otentik.",
        gambarURL: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop"
    },
    {
        id: 4,
        nama: "Es Teh Manis",
        kategori: "minuman",
        harga: 5000,
        deskripsi: "Teh seduh segar dengan gula asli.",
        gambarURL: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop"
    },
    {
        id: 5,
        nama: "Es Jeruk Peras",
        kategori: "minuman",
        harga: 8000,
        deskripsi: "Jeruk peras segar, sumber vitamin C.",
        gambarURL: "https://images.unsplash.com/photo-1434144893279-2a9fc14e9337?w=500&auto=format&fit=crop"
    },
    {
        id: 6,
        nama: "Kopi Susu Aren",
        kategori: "minuman",
        harga: 15000,
        deskripsi: "Kopi robusta dengan susu dan gula aren cair.",
        gambarURL: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&auto=format&fit=crop"
    },
    {
        id: 7,
        nama: "Pisang Goreng Keju",
        kategori: "snack",
        harga: 12000,
        deskripsi: "Pisang goreng kipas dengan taburan keju dan susu kental manis.",
        gambarURL: "https://images.unsplash.com/photo-1590333746430-e0066cf6922b?w=500&auto=format&fit=crop"
    },
    {
        id: 8,
        nama: "Bakwan Sayur",
        kategori: "snack",
        harga: 10000,
        deskripsi: "Bakwan renyah dengan isian sayur (3 pcs).",
        gambarURL: "https://images.unsplash.com/photo-1610192244261-3f33de8f5f84?w=500&auto=format&fit=crop"
    }
];

// 2. STATE APLIKASI
let cart = [];
const waNumber = "6281318531260"; // Nomor WA Owner

// DOM Elements
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.tab-btn');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const floatingCartBtn = document.getElementById('floating-cart');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutWaBtn = document.getElementById('checkout-wa');
const toastEl = document.getElementById('toast');

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderMenu('semua');
    updateCartUI();
});

// 4. FUNCTIONS

/**
 * Merender daftar menu berdasarkan kategori
 */
function renderMenu(category) {
    const filteredMenu = category === 'semua' 
        ? menuData 
        : menuData.filter(item => item.kategori === category);

    menuGrid.innerHTML = filteredMenu.map(item => `
        <div class="menu-card" data-id="${item.id}">
            <img src="${item.gambarURL}" alt="${item.nama}" class="card-img" loading="lazy">
            <div class="card-content">
                <span class="category">${item.kategori}</span>
                <h3>${item.nama}</h3>
                <p class="desc">${item.deskripsi}</p>
                <div class="card-footer">
                    <span class="price">${formatRupiah(item.harga)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">Tambah</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Filter menu berdasarkan kategori saat tab diklik
 */
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        renderMenu(category);
    });
});

/**
 * Menambahkan item ke keranjang
 */
function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast();
}

/**
 * Menghapus/mengurangi item dari keranjang
 */
function removeFromCart(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    saveCart();
    updateCartUI();
}

/**
 * Mengupdate tampilan UI keranjang
 */
function updateCartUI() {
    // Hitung total
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.harga * item.quantity), 0);

    // Update element
    cartCountEl.textContent = totalItems;
    cartTotalPriceEl.textContent = formatRupiah(totalPrice);

    // Render list item di panel
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Keranjang kosong.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.nama}</h4>
                    <p>${formatRupiah(item.harga)} x ${item.quantity}</p>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="item-price">${formatRupiah(item.harga * item.quantity)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i data-lucide="minus-circle" style="width:18px;"></i>
                    </button>
                    <button class="remove-btn" onclick="addToCart(${item.id})" style="color:var(--primary)">
                        <i data-lucide="plus-circle" style="width:18px;"></i>
                    </button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

/**
 * Generate link WhatsApp dengan format pesan rapi
 */
function generateWALink() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + (item.harga * item.quantity), 0);
    let message = `*HALO WARUNG MAK NYUS!*\n`;
    message += `Saya mau pesan makanan berikut:\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.nama}* x${item.quantity}\n`;
        message += `   Subtotal: ${formatRupiah(item.harga * item.quantity)}\n`;
    });

    message += `\n--------------------------\n`;
    message += `*TOTAL PEMBAYARAN: ${formatRupiah(totalPrice)}*\n`;
    message += `--------------------------\n\n`;
    message += `Mohon segera diproses ya, terima kasih! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
}

/**
 * Simpan data keranjang ke localStorage
 */
function saveCart() {
    localStorage.setItem('makNyusItems', JSON.stringify(cart));
}

/**
 * Muat data keranjang dari localStorage
 */
function loadCart() {
    const savedCart = localStorage.getItem('makNyusItems');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

/**
 * Format angka ke mata uang Rupiah
 */
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

/**
 * Menampilkan Toast Notification
 */
function showToast() {
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2000);
}

// Event Listeners
floatingCartBtn.addEventListener('click', () => cartPanel.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartPanel.classList.remove('active'));

clearCartBtn.addEventListener('click', () => {
    if (confirm("Kosongkan keranjang?")) {
        cart = [];
        saveCart();
        updateCartUI();
    }
});

checkoutWaBtn.addEventListener('click', generateWALink);

// Smooth Scroll for Hero Button
document.querySelector('.btn-primary').addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
});

/**
 * app.js — Logic trang chính
 * Nhập tên -> Gợi ý tìm kiếm -> Chuyển đến trang lời chúc
 */

let members = [];

/**
 * Tải dữ liệu thành viên từ JSON
 */
async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Không thể tải dữ liệu');
        return await response.json();
    } catch (error) {
        console.error('Lỗi tải thành viên:', error);
        return [];
    }
}

/**
 * Chuẩn hóa tiếng Việt để tìm kiếm không dấu
 */
function normalize(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .trim();
}

/**
 * Tìm kiếm thành viên theo tên (không phân biệt hoa thường/dấu)
 */
function searchMembers(query) {
    if (!query.trim()) return [];
    const normalizedQuery = normalize(query);
    return members.filter(m => {
        const normalizedName = normalize(m.name);
        return normalizedName.includes(normalizedQuery);
    });
}

/**
 * Hiển thị các gợi ý tìm kiếm
 */
function renderSuggestions(results) {
    const container = document.getElementById('suggestions');
    const hint = document.getElementById('searchHint');

    if (results.length === 0) {
        const query = document.getElementById('nameInput').value.trim();
        if (query) {
            container.innerHTML = `
        <div class="suggestion-empty">
          <span>😔</span>
          <p>Không tìm thấy "${query}"</p>
          <small>Hãy thử nhập tên khác nhé</small>
        </div>
      `;
            container.classList.add('visible');
        } else {
            container.innerHTML = '';
            container.classList.remove('visible');
        }
        if (window.parseEmoji) parseEmoji(container);
        hint.style.display = query ? 'none' : '';
        return;
    }

    hint.style.display = 'none';
    container.innerHTML = results.map(member => `
    <div class="suggestion-item" data-id="${member.id}" data-theme="${member.theme}">
      <span class="suggestion-emoji">${member.emoji}</span>
      <div class="suggestion-info">
        <span class="suggestion-name">${member.name}</span>
        <span class="suggestion-role">${member.role}</span>
      </div>
      <i data-lucide="arrow-right" class="suggestion-arrow"></i>
    </div>
  `).join('');
    container.classList.add('visible');

    // Khởi tạo icon trong DOM mới
    if (window.lucide) lucide.createIcons();
    if (window.parseEmoji) parseEmoji(container);

    // Xử lý sự kiện click vào gợi ý
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            item.style.transform = 'scale(0.97)';
            setTimeout(() => {
                if (window.appRouter) {
                    window.appRouter.navigate(`greeting.html?id=${id}`);
                } else {
                    window.location.href = `greeting.html?id=${id}`;
                }
            }, 150);
        });
    });
}

/**
 * Tạo các phần tử bay trôi (particles) trang trí
 */
function createParticles() {
    const container = document.getElementById('particles');
    const petals = ['🌸', '🌷', '✿', '❀', '✧', '♡'];
    const isMobile = window.innerWidth <= 600;
    const count = isMobile ? 8 : 15;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = petals[Math.floor(Math.random() * petals.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
        particle.style.animationDuration = `${8 + Math.random() * 12}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(particle);
    }
    if (window.parseEmoji) parseEmoji(container);
}

/**
 * Khởi tạo trang chính
 */
async function initLandingApp() {
    createParticles();
    members = await loadMembers();

    const input = document.getElementById('nameInput');

    // Tìm kiếm trực tiếp khi nhập
    input.addEventListener('input', () => {
        const query = input.value;
        const results = searchMembers(query);
        renderSuggestions(results);
    });

    // Nhấn Enter -> chuyển đến trang lời chúc
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = input.value;
            const results = searchMembers(query);
            if (results.length === 1) {
                if (window.appRouter) {
                    window.appRouter.navigate(`greeting.html?id=${results[0].id}`);
                } else {
                    window.location.href = `greeting.html?id=${results[0].id}`;
                }
            } else if (results.length > 1) {
                // Nhấn hiệu ứng cho mục đầu tiên
                const first = document.querySelector('.suggestion-item');
                if (first) {
                    first.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        if (window.appRouter) {
                            window.appRouter.navigate(`greeting.html?id=${results[0].id}`);
                        } else {
                            window.location.href = `greeting.html?id=${results[0].id}`;
                        }
                    }, 150);
                }
            }
        }
    });
}

// Xuất hàm khởi tạo cho Router sử dụng
window.initLandingApp = initLandingApp;

// Chạy khởi tạo khi trang load lần đầu
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy nếu không phải trang greeting
    if (!window.location.pathname.includes('greeting.html')) {
        initLandingApp();
    }
});

/**
 * router.js — Bộ điều hướng trang (SPA)
 * Chuyển trang mượt mà để nhạc không bị ngắt quãng.
 */

const Router = {
    init() {
        console.log('Router: Đang khởi tạo...');

        // Chặn các liên kết nội bộ để xử lý bằng JS
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                // Nếu là link nội bộ (đuôi .html hoặc trang chủ)
                if (link.href.endsWith('.html') || link.href.endsWith('/')) {
                    e.preventDefault();
                    this.navigate(link.href);
                }
            }
        });

        // Xử lý khi nhấn nút Back/Forward của trình duyệt
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.href, false);
        });

        // Lưu trạng thái trang hiện tại vào lịch sử trình duyệt
        window.history.replaceState({ path: window.location.href }, '', window.location.href);
    },

    async navigate(url) {
        if (url === window.location.href) return;

        console.log(`Router: Đang chuyển đến ${url}`);
        window.history.pushState({ path: url }, '', url);
        await this.loadPage(url);
    },

    async loadPage(url, push = true) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            // Chuyển chuỗi HTML thành DOM object
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 1. Cập nhật tiêu đề trang
            document.title = doc.title;

            // 2. Thay đổi nội dung trong #app-root
            const newContent = doc.getElementById('app-root');
            const currentRoot = document.getElementById('app-root');

            if (newContent && currentRoot) {
                currentRoot.innerHTML = newContent.innerHTML;

                // 3. Cuộn lên đầu trang
                window.scrollTo(0, 0);

                // 4. Khởi tạo lại các script của trang mới
                this.reinitializePage();
            } else {
                // Quay lại cách load trang truyền thống nếu không tìm thấy #app-root
                console.warn('Router: Không tìm thấy #app-root, load lại trang kiểu cũ.');
                window.location.href = url;
            }
        } catch (error) {
            console.error('Router: Điều hướng thất bại', error);
            window.location.href = url;
        }
    },

    reinitializePage() {
        // Khởi tạo lại Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Chuyển đổi emoji sang hình ảnh Twemoji
        if (window.parseEmoji) {
            parseEmoji(document.getElementById('app-root'));
        }

        // Kiểm tra trang hiện tại và chạy hàm khởi tạo tương ứng
        const path = window.location.pathname;
        if (path.includes('greeting.html')) {
            if (typeof window.initGreetingApp === 'function') {
                window.initGreetingApp();
            }
        } else {
            if (typeof window.initLandingApp === 'function') {
                window.initLandingApp();
            }
        }
    }
};

// Khởi chạy Router
Router.init();
window.appRouter = Router;

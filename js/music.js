/**
 * Trình phát nhạc nền (LoFi)
 * Duy trì nhạc chạy xuyên suốt giữa các trang.
 */

// File nhạc cục bộ để tránh lỗi CORS và tải nhanh hơn
const MUSIC_SOURCES = [
    './assets/aventure-dreamy-lofi-nostalgic-background-469629.mp3',
    './assets/delosound-lofi-lofi-chill-lofi-girl-456265.mp3'
];

class MusicPlayer {
    constructor() {
        console.log('MusicPlayer: Đang khởi tạo (Local Assets)...');
        this.currentSourceIndex = 0;
        this.audio = new Audio();

        // Cài đặt nguồn nhạc, lặp lại và âm lượng
        this.audio.src = MUSIC_SOURCES[this.currentSourceIndex];
        this.audio.loop = true;
        this.audio.volume = 0.4;
        this.audio.preload = 'auto';

        // Kiểm tra xem người dùng có tắt tiếng trước đó không
        this.isMuted = localStorage.getItem('musicMuted') === 'true';
        this.audio.muted = this.isMuted;

        // Tiếp tục phát từ thời điểm đã lưu
        const savedTime = localStorage.getItem('musicTime');
        if (savedTime) {
            this.audio.currentTime = parseFloat(savedTime);
        }

        this.createToggleButton();
        this.setupEvents();
        this.autoPlayIfNeeded();
    }

    // Tạo nút bật/tắt nhạc
    createToggleButton() {
        if (document.getElementById('music-toggle')) return;

        const btn = document.createElement('button');
        btn.id = 'music-toggle';
        btn.className = 'music-toggle-btn';
        btn.innerHTML = this.isMuted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
        btn.title = this.isMuted ? 'Bật nhạc' : 'Tắt nhạc';

        document.body.appendChild(btn);
        this.btn = btn;

        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            this.btn.textContent = this.isMuted ? '🔇' : '🔊';
        }
    }

    // Thiết lập các sự kiện
    setupEvents() {
        this.btn.addEventListener('click', () => this.toggle());

        // Lưu thời gian phát nhạc mỗi 2 giây
        setInterval(() => {
            if (!this.audio.paused) {
                localStorage.setItem('musicTime', this.audio.currentTime);
            }
        }, 2000);

        // Chuyển sang nguồn nhạc khác nếu bị lỗi tải
        this.audio.addEventListener('error', (e) => {
            console.error(`MusicPlayer: Lỗi tải nguồn ${MUSIC_SOURCES[this.currentSourceIndex]}`, e);
            if (this.currentSourceIndex < MUSIC_SOURCES.length - 1) {
                this.currentSourceIndex++;
                console.log(`MusicPlayer: Thử lại với nguồn tiếp theo: ${MUSIC_SOURCES[this.currentSourceIndex]}`);
                this.audio.src = MUSIC_SOURCES[this.currentSourceIndex];
                if (!this.isMuted) this.audio.play().catch(() => { });
            }
        });

        // Đồng bộ trạng thái tắt tiếng giữa các tab/trang
        window.addEventListener('storage', (e) => {
            if (e.key === 'musicMuted') {
                const muted = e.newValue === 'true';
                this.audio.muted = muted;
                this.isMuted = muted;
                this.updateUI();
            }
        });
    }

    // Bật/tắt tiếng
    toggle() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        localStorage.setItem('musicMuted', this.isMuted);

        if (!this.isMuted) {
            this.audio.play().then(() => {
                console.log('MusicPlayer: Phát nhạc thành công');
            }).catch(err => {
                console.error('MusicPlayer: Không thể phát nhạc', err);
            });
        }

        this.updateUI();
    }

    // Cập nhật icon nút bật/tắt
    updateUI() {
        if (!this.btn) return;
        this.btn.innerHTML = this.isMuted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
        if (window.lucide) window.lucide.createIcons();
    }

    // Tự động phát nhạc (cần tương tác người dùng lần đầu)
    autoPlayIfNeeded() {
        const startAudio = () => {
            if (!this.isMuted && this.audio.paused) {
                this.audio.play().catch(() => { });
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
        };

        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);

        if (!this.isMuted) {
            this.audio.play().catch(() => {
                console.log('MusicPlayer: Trình duyệt chặn tự động phát, chờ người dùng click.');
            });
        }
    }
}

// Khởi tạo trình phát nhạc một lần duy nhất
if (!window.musicPlayerInitialized) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.musicPlayer = new MusicPlayer();
            window.musicPlayerInitialized = true;
        });
    } else {
        window.musicPlayer = new MusicPlayer();
        window.musicPlayerInitialized = true;
    }
}

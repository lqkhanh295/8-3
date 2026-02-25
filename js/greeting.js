/**
 * greeting.js — Logic trang lời chúc cá nhân
 * Tính năng: Mở phong bì → Hiệu ứng pháo hoa → Lời chúc + Thẻ quà tặng
 */

// ============================================
// CẤU HÌNH GIAO DIỆN (THEMES)
// ============================================
const THEMES = {
    rose: {
        bg: 'linear-gradient(135deg, #ffeef2 0%, #ffd6e0 50%, #ffe8ee 100%)',
        accent: '#f4a0b5',
        soft: '#ffd6e0',
        text: '#8b4558',
        glow: 'rgba(244, 160, 181, 0.3)',
        confetti: ['#f4a0b5', '#ffd6e0', '#ff85a1', '#ffb3c6', '#ffc8dd'],
    },
    lavender: {
        bg: 'linear-gradient(135deg, #f0eaff 0%, #ddd1ff 50%, #ece6ff 100%)',
        accent: '#b8a3e8',
        soft: '#ddd1ff',
        text: '#5c4a8a',
        glow: 'rgba(184, 163, 232, 0.3)',
        confetti: ['#b8a3e8', '#ddd1ff', '#9b87d0', '#c8b6ff', '#e2d5ff'],
    },
    mint: {
        bg: 'linear-gradient(135deg, #e8faf0 0%, #c8f0da 50%, #e0f7eb 100%)',
        accent: '#7ecba1',
        soft: '#c8f0da',
        text: '#3a6b50',
        glow: 'rgba(126, 203, 161, 0.3)',
        confetti: ['#7ecba1', '#c8f0da', '#5cb885', '#a8e6c3', '#d4f5e2'],
    },
    peach: {
        bg: 'linear-gradient(135deg, #fff3e8 0%, #ffd9b3 50%, #ffecda 100%)',
        accent: '#f0a870',
        soft: '#ffd9b3',
        text: '#7a5230',
        glow: 'rgba(240, 168, 112, 0.3)',
        confetti: ['#f0a870', '#ffd9b3', '#e8935a', '#ffc599', '#ffe0cc'],
    },
    sky: {
        bg: 'linear-gradient(135deg, #e8f4ff 0%, #c4e2ff 50%, #dff0ff 100%)',
        accent: '#7ab8e8',
        soft: '#c4e2ff',
        text: '#3a5a7a',
        glow: 'rgba(122, 184, 232, 0.3)',
        confetti: ['#7ab8e8', '#c4e2ff', '#5aa0d0', '#a8d4f5', '#d4ecff'],
    },
    coral: {
        bg: 'linear-gradient(135deg, #fff0ec 0%, #ffd4c8 50%, #ffe8e2 100%)',
        accent: '#e8947a',
        soft: '#ffd4c8',
        text: '#7a4030',
        glow: 'rgba(232, 148, 122, 0.3)',
        confetti: ['#e8947a', '#ffd4c8', '#d07a60', '#f5b8a8', '#ffe0d8'],
    },
};

// ============================================
// BIỂU TƯỢNG LUCIDE
// ============================================
const ICONS = {
    back: `<i data-lucide="arrow-left" style="width:16px;height:16px"></i>`,
    share: `<i data-lucide="share-2" style="width:16px;height:16px"></i>`,
    quote: `<i data-lucide="quote" style="width:20px;height:20px;opacity:0.4"></i>`,
    sparkle: `<i data-lucide="sparkles" style="width:14px;height:14px"></i>`,
    flower: `<i data-lucide="flower-2" style="width:16px;height:16px"></i>`,
    gift: `<i data-lucide="gift" style="width:16px;height:16px"></i>`,
    heart: `<i data-lucide="heart" style="width:14px;height:14px"></i>`,
};


// ============================================
// HIỆU ỨNG PHÁO HOA (Canvas)
// ============================================
class ConfettiEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    // Tự động điều chỉnh kích thước canvas
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Tạo đợt pháo hoa mới
    burst(colors, count = 80) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: this.canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: -(Math.random() * 12 + 4),
                w: Math.random() * 10 + 4,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                gravity: 0.15 + Math.random() * 0.1,
                opacity: 1,
                decay: 0.005 + Math.random() * 0.005,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
            });
        }
        if (!this.running) this.animate();
    }

    // Vòng lặp hoạt ảnh
    animate() {
        this.running = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.opacity > 0.01);

        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.99;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;

            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
            this.canvas.style.pointerEvents = 'none';
        }
    }
}

// ============================================
// HÀM XỬ LÝ CHÍNH
// ============================================

// Lấy ID thành viên từ URL
function getMemberId() {
    return new URLSearchParams(window.location.search).get('id');
}

// Tải dữ liệu thành viên từ file JSON
async function loadMember(id) {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error('Failed');
        const members = await res.json();
        return members.find(m => m.id === id) || null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Áp dụng chủ đề (màu sắc, nền)
function applyTheme(themeName) {
    const theme = THEMES[themeName] || THEMES.rose;
    const root = document.documentElement;
    const page = document.getElementById('greetingPage');

    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-soft', theme.soft);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-glow', theme.glow);
    page.style.background = theme.bg;

    document.querySelectorAll('.blob').forEach(b => b.style.background = theme.soft);

    // Cập nhật màu phong bì theo chủ đề
    const overlay = document.getElementById('envelopeOverlay');
    if (overlay) overlay.style.background = theme.bg;

    return theme;
}

// ============================================
// HIỆU ỨNG ĐÁNH MÁY
// ============================================
function typewriterEffect(element, text, speed = 25) {
    return new Promise(resolve => {
        let i = 0;
        element.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';

        function type() {
            if (i < text.length) {
                element.textContent = text.substring(0, i + 1);
                element.appendChild(cursor);
                i++;
                setTimeout(type, speed);
            } else {
                setTimeout(() => { cursor.style.display = 'none'; resolve(); }, 2000);
            }
        }
        type();
    });
}

// ============================================
// HIỆU ỨNG MỞ PHONG BÌ
// ============================================
function setupEnvelope(member, theme, onOpen) {
    const overlay = document.getElementById('envelopeOverlay');
    const envelope = document.getElementById('envelope');

    // Cài đặt màu phong bì
    envelope.style.setProperty('--env-accent', theme.accent);
    envelope.style.setProperty('--env-soft', theme.soft);
    envelope.style.setProperty('--env-text', theme.text);

    const letterHeart = overlay.querySelector('.envelope-heart');
    letterHeart.textContent = member.emoji;

    const letterText = overlay.querySelector('.envelope-letter p');
    letterText.innerHTML = `Dành tặng<br><span class="env-name">${member.name}</span>`;

    // Chuyển đổi emoji trong phong bì
    parseEmoji(overlay);

    overlay.addEventListener('click', () => {
        envelope.classList.add('opened');
        overlay.querySelector('.envelope-prompt').style.opacity = '0';

        setTimeout(() => {
            overlay.classList.add('fade-out');
            onOpen();
        }, 1200);

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1800);
    });
}

// ============================================
// RENDER LỜI CHÚC
// ============================================
function renderGreeting(member) {
    const content = document.getElementById('greetingContent');

    content.innerHTML = `
    <span class="greeting-emoji">${member.emoji}</span>
    <p class="greeting-label">${ICONS.sparkle} Lời chúc dành riêng cho</p>
    <h1 class="greeting-name">${member.name}</h1>
    <p class="greeting-role">
      ${ICONS.flower}
      ${member.role}
    </p>

    <div class="message-box">
      <p class="message-text" id="messageText"></p>
    </div>

    <div class="quote-box">
      <span class="quote-icon">${ICONS.quote}</span>
      <p class="quote-text">"${member.quote}"</p>
    </div>

    <div class="greeting-actions">
      <a href="index.html" class="btn btn-secondary">
        ${ICONS.back}
        Quay lại
      </a>
      <button class="btn btn-primary" id="shareBtn" onclick="shareLink()">
        ${ICONS.share}
        Chia sẻ
      </button>
    </div>
  `;

    if (window.lucide) lucide.createIcons();
    parseEmoji(content);

    // Chạy hiệu ứng đánh máy cho lời chúc
    setTimeout(() => {
        const messageEl = document.getElementById('messageText');
        typewriterEffect(messageEl, member.message, 30);
    }, 500);
}

// ============================================
// RENDER THẺ QUÀ TẶNG
// ============================================
function renderGiftCard(member) {
    const section = document.getElementById('giftCardSection');
    const card = document.getElementById('giftCard');

    document.getElementById('gcEmoji').textContent = member.emoji;
    document.getElementById('gcName').textContent = member.name;
    document.getElementById('gcWish').textContent = member.wish || 'Chúc bạn luôn hạnh phúc!';

    // Render các thẻ đặc điểm (traits)
    const traitsEl = document.getElementById('gcTraits');
    if (member.traits && member.traits.length) {
        traitsEl.innerHTML = member.traits.map(t =>
            `<span class="trait-tag">${t}</span>`
        ).join('');
    }

    // Áp dụng màu chủ đề cho thẻ quà
    const theme = THEMES[member.theme] || THEMES.rose;
    card.style.setProperty('--gc-accent', theme.accent);
    card.style.setProperty('--gc-soft', theme.soft);
    card.style.setProperty('--gc-text', theme.text);

    // Hiển thị thẻ sau một khoảng trễ
    setTimeout(() => {
        section.style.display = 'block';
        section.style.animation = 'fadeInUp 0.8s var(--ease-soft) both';
        if (window.lucide) lucide.createIcons();
        parseEmoji(section);
    }, 3000);
}

// ============================================
// CÁC PHẦN TỬ BAY TRÔI (Particles)
// ============================================
function createParticles(themeName) {
    const container = document.getElementById('particles');
    const themeFlowers = {
        rose: ['🌸', '🌷', '♡', '✧'],
        lavender: ['🦋', '💜', '✧', '❋'],
        mint: ['🌿', '✨', '🍃', '✧'],
        peach: ['🌺', '🧡', '✿', '✧'],
        sky: ['🌼', '💫', '☁', '✧'],
        coral: ['🌻', '🧡', '❀', '✧'],
    };
    const petals = themeFlowers[themeName] || themeFlowers.rose;
    const isMobile = window.innerWidth <= 600;
    const count = isMobile ? 6 : 12;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = petals[Math.floor(Math.random() * petals.length)];
        p.style.left = `${Math.random() * 100}%`;
        p.style.fontSize = `${0.8 + Math.random() * 0.6}rem`;
        p.style.animationDuration = `${10 + Math.random() * 15}s`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        container.appendChild(p);
    }
    parseEmoji(container);
}

// ============================================
// CHIA SẺ LIÊN KẾT
// ============================================
function shareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(showToast).catch(() => {
        // Cách dự phòng nếu trình duyệt không hỗ trợ Clipboard API trực tiếp
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
    });
}

// Hiển thị thông báo khi sao chép
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============================================
// VÒNG QUAY MAY MẮN (Lucky Wheel)
// ============================================
const WHEEL_PRIZES = [
    { text: 'Hôm nay bạn sẽ gặp may mắn bất ngờ!', icon: '🍀', color: '#7ecba1' },
    { text: 'Ai đó đang thầm ngưỡng mộ bạn đấy!', icon: '💝', color: '#f4a0b5' },
    { text: 'Hãy tự thưởng cho mình một bữa ăn ngon!', icon: '🍰', color: '#f0a870' },
    { text: 'Bạn xứng đáng được yêu thương nhiều hơn!', icon: '🌟', color: '#b8a3e8' },
    { text: 'Một điều tuyệt vời sắp đến với bạn!', icon: '🎁', color: '#7ab8e8' },
    { text: 'Nụ cười của bạn sáng hơn cả mặt trời!', icon: '☀️', color: '#e8947a' },
    { text: 'Hãy gọi điện cho người bạn yêu thương!', icon: '📞', color: '#f4a0b5' },
    { text: 'Bạn đẹp nhất khi là chính mình!', icon: '🦋', color: '#b8a3e8' },
];

class LuckyWheel {
    constructor(canvas, theme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.prizes = WHEEL_PRIZES;
        this.segments = this.prizes.length;
        this.angle = 0;
        this.spinning = false;
        this.theme = theme;
        this.size = Math.min(canvas.width, canvas.height);
        this.cx = this.size / 2;
        this.cy = this.size / 2;
        this.radius = this.size / 2 - 10;
        this.draw();
    }

    // Vẽ vòng quay
    draw() {
        const { ctx, cx, cy, radius, segments, prizes, angle } = this;
        const arc = (Math.PI * 2) / segments;
        ctx.clearRect(0, 0, this.size, this.size);

        for (let i = 0; i < segments; i++) {
            const startAngle = angle + i * arc;
            const endAngle = startAngle + arc;

            // Vẽ từng nan quạt
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = i % 2 === 0
                ? this.theme.soft
                : `${this.theme.accent}33`;
            ctx.fill();
            ctx.strokeStyle = `${this.theme.accent}44`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Vẽ văn bản icon
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(startAngle + arc / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = this.theme.text;
            ctx.font = '20px "VT323"';
            ctx.fillText(prizes[i].icon, radius * 0.65, 6);
            ctx.restore();
        }

        // Vẽ tâm vòng quay
        ctx.beginPath();
        ctx.arc(cx, cy, 24, 0, Math.PI * 2);
        ctx.fillStyle = this.theme.accent;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = this.theme.accent;
        ctx.fill();
    }

    // Xử lý khi nhấn quay
    spin() {
        if (this.spinning) return;
        this.spinning = true;

        const spinDuration = 4000 + Math.random() * 2000;
        const totalRotation = Math.PI * 2 * (5 + Math.random() * 5);
        const startTime = performance.now();
        const startAngle = this.angle;

        // Ẩn kết quả cũ
        const resultEl = document.getElementById('wheelResult');
        resultEl.style.display = 'none';

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            // Hiệu ứng giảm tốc dần (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            this.angle = startAngle + totalRotation * eased;
            this.draw();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.spinning = false;
                this.showResult();
            }
        };

        requestAnimationFrame(animate);
    }

    // Hiển thị phần quà nhận được
    showResult() {
        const arc = (Math.PI * 2) / this.segments;
        // Kim chỉ ở hướng trên (-90 độ)
        const normalizedAngle = ((Math.PI * 2) - (this.angle % (Math.PI * 2)) + Math.PI * 1.5) % (Math.PI * 2);
        const index = Math.floor(normalizedAngle / arc) % this.segments;
        const prize = this.prizes[index];

        const resultEl = document.getElementById('wheelResult');
        const iconEl = document.getElementById('resultIcon');
        const textEl = document.getElementById('resultText');

        iconEl.textContent = prize.icon;
        textEl.textContent = prize.text;
        resultEl.style.display = 'block';
        resultEl.style.animation = 'fadeInUp 0.6s var(--ease-soft) both';

        parseEmoji(resultEl);

        // Hiệu ứng pháo hoa nhỏ khi nhận thưởng
        const confettiCanvas = document.getElementById('confettiCanvas');
        if (confettiCanvas) {
            const confetti = new ConfettiEngine(confettiCanvas);
            confetti.burst(this.theme.confetti, 40);
        }
    }
}

// ============================================
// VỆT LẤP LÁNH KHI DI CHUỘT (Sparkle Trail)
// ============================================
class SparkleTrail {
    constructor(canvas, theme) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.theme = theme;
        this.active = true;
        this.isMobile = window.innerWidth <= 600;
        this.maxParticles = this.isMobile ? 30 : 80;
        this.spawnCount = this.isMobile ? 1 : 2;
        this.lastSpawn = 0;
        this.spawnInterval = this.isMobile ? 50 : 16; // ms
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Chuột
        document.addEventListener('mousemove', (e) => this.addSparkle(e.clientX, e.clientY));
        // Cảm ứng (đã giới hạn tần suất trên mobile)
        document.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.addSparkle(t.clientX, t.clientY);
        }, { passive: true });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addSparkle(x, y) {
        if (!this.active) return;
        const now = performance.now();
        if (now - this.lastSpawn < this.spawnInterval) return;
        this.lastSpawn = now;

        if (this.particles.length >= this.maxParticles) return;

        const colors = this.theme.confetti;
        for (let i = 0; i < this.spawnCount; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 1,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.015 + Math.random() * 0.02,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.life > 0);

        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.life -= p.decay;
            p.size *= 0.98;

            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 6;

            // Hình ngôi sao
            this.ctx.beginPath();
            const spikes = 4;
            const outerR = p.size;
            const innerR = p.size * 0.4;
            for (let i = 0; i < spikes * 2; i++) {
                const r = i % 2 === 0 ? outerR : innerR;
                const angle = (i * Math.PI) / spikes - Math.PI / 2;
                const x = p.x + Math.cos(angle) * r;
                const y = p.y + Math.sin(angle) * r;
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// KHỞI TẠO CHƯƠNG TRÌNH
// ============================================
async function initGreetingApp() {
    const id = getMemberId();
    if (!id) {
        if (window.appRouter) {
            window.appRouter.navigate('index.html');
        } else {
            window.location.href = 'index.html';
        }
        return;
    }

    const member = await loadMember(id);
    if (!member) {
        document.getElementById('envelopeOverlay').style.display = 'none';
        const page = document.getElementById('greetingPage');
        page.style.display = 'flex';
        const content = document.getElementById('greetingContent');
        if (content) {
            content.innerHTML = `
                <span class="greeting-emoji">🤔</span>
                <h2 style="font-family:'Chakra Petch';font-size:1.2rem;font-weight:700;margin-bottom:16px;">Không tìm thấy thành viên</h2>
                <p>Đang chuyển hướng về trang chính...</p>
            `;
            parseEmoji(content);
        }
        setTimeout(() => {
            if (window.appRouter) {
                window.appRouter.navigate('index.html');
            } else {
                window.location.href = 'index.html';
            }
        }, 2000);
        return;
    }

    // Cài đặt trang
    const theme = applyTheme(member.theme);
    const confetti = new ConfettiEngine(document.getElementById('confettiCanvas'));

    // Khi phong bì được mở
    setupEnvelope(member, theme, () => {
        // Hiển thị nội dung lời chúc
        const page = document.getElementById('greetingPage');
        page.style.display = 'flex';
        page.style.animation = 'fadeInUp 0.8s var(--ease-soft) both';

        // Bắn pháo hoa chào mừng!
        confetti.burst(theme.confetti, 100);
        setTimeout(() => confetti.burst(theme.confetti, 60), 400);
        setTimeout(() => confetti.burst(theme.confetti, 40), 800);

        // Khởi tạo các thành phần
        createParticles(member.theme);
        renderGreeting(member);
        renderGiftCard(member);

        // Vòng quay may mắn — hiển thị sau 5 giây
        setTimeout(() => {
            const wheelSection = document.getElementById('wheelSection');
            if (wheelSection) {
                wheelSection.style.display = 'block';
                wheelSection.style.animation = 'fadeInUp 0.8s var(--ease-soft) both';

                const wheelCanvas = document.getElementById('wheelCanvas');
                const wheel = new LuckyWheel(wheelCanvas, theme);

                document.getElementById('spinBtn').addEventListener('click', () => {
                    wheel.spin();
                });

                if (window.lucide) lucide.createIcons();
                parseEmoji(wheelSection);
            }
        }, 5000);

        // Hiệu ứng vệt lấp lánh
        const sparkleCanvas = document.getElementById('sparkleCanvas');
        if (sparkleCanvas) {
            new SparkleTrail(sparkleCanvas, theme);
        }

        document.title = `💌 Chúc ${member.name} — 8/3`;
    });
}

// Xuất hàm khởi tạo cho Router sử dụng
window.initGreetingApp = initGreetingApp;

// Chạy khởi tạo khi trang load lần đầu
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy nếu đang ở trang greeting.html
    if (window.location.pathname.includes('greeting.html')) {
        initGreetingApp();
    }
});

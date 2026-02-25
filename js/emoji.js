/**
 * emoji.js — Twemoji Wrapper
 * Thay thế emoji gốc của hệ điều hành bằng SVG Twemoji để hiển thị đẹp & đồng bộ
 */

// Địa chỉ Twemoji CDN
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/';

/**
 * Chuyển đổi ký tự emoji sang mã Hex (codepoint)
 */
function toCodePoint(str) {
    const codePoints = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF) {
            const low = str.charCodeAt(++i);
            codePoints.push(((code - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000).toString(16));
        } else if (code >= 0xFE00 && code <= 0xFE0F) {
            // Bỏ qua các ký tự biến thể emoji
            continue;
        } else {
            codePoints.push(code.toString(16));
        }
    }
    return codePoints.join('-');
}

// Regex tìm kiếm các emoji phổ biến (bao gồm emoji phức tạp)
const emojiPattern = /(?:\uD83C[\uDDE6-\uDDFF]){2}|\uD83D[\uDC00-\uDEFF]|\uD83E[\uDD00-\uDDFF]|\uD83C[\uDF00-\uDFFF]|\u2764\uFE0F?|\u2600\uFE0F?|\u2601\uFE0F?|\u2728|\u2B50|\u270A-\u270D\uFE0F?|\u2702\uFE0F?|\u2709\uFE0F?|\u2614|\u26A1|\u231A|\u231B|\u23E9-\u23F3|\u23F8-\u23FA|\u25AA\uFE0F?|\u25AB\uFE0F?|\u25B6\uFE0F?|\u25C0\uFE0F?|\u25FB-\u25FE|\u2611\uFE0F?|\u2622\uFE0F?|\u2623\uFE0F?|\u2626\uFE0F?|\u262A\uFE0F?|\u262E\uFE0F?|\u262F\uFE0F?|\u2638\uFE0F?|\u2639\uFE0F?|\u263A\uFE0F?|\u2640\uFE0F?|\u2642\uFE0F?|\u2648-\u2653|\u265F\uFE0F?|\u2660\uFE0F?|\u2663\uFE0F?|\u2665\uFE0F?|\u2666\uFE0F?|\u2668\uFE0F?|\u267B\uFE0F?|\u267E\uFE0F?|\u267F|\u2692-\u2697\uFE0F?|\u2699\uFE0F?|\u269B\uFE0F?|\u269C\uFE0F?|\u26A0\uFE0F?|\u26A7\uFE0F?|\u26AA|\u26AB|\u26B0\uFE0F?|\u26B1\uFE0F?|\u26BD|\u26BE|\u26C4|\u26C5|\u26CE|\u26CF\uFE0F?|\u26D1|\u26D3\uFE0F?|\u26D4|\u26E9\uFE0F?|\u26EA|\u26F0-\u26FA\uFE0F?|\u26FD/g;

/**
 * Duyệt phần tử DOM, thay thế văn bản emoji bằng thẻ <img> Twemoji
 */
function parseEmoji(el) {
    if (!el) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    for (const node of textNodes) {
        if (!emojiPattern.test(node.textContent)) continue;
        emojiPattern.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        emojiPattern.lastIndex = 0;
        while ((match = emojiPattern.exec(node.textContent)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex, match.index)));
            }

            const cp = toCodePoint(match[0]);
            const img = document.createElement('img');
            img.className = 'emoji';
            img.alt = match[0];
            img.src = `${TWEMOJI_BASE}svg/${cp}.svg`;
            img.draggable = false;
            img.loading = 'lazy';
            fragment.appendChild(img);

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < node.textContent.length) {
            fragment.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
        }

        if (fragment.childNodes.length > 0) {
            node.parentNode.replaceChild(fragment, node);
        }
    }
}

window.parseEmoji = parseEmoji;

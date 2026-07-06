document.addEventListener('DOMContentLoaded', () => {

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll(
        '.step, .money-card, .for-item, .venue-card, .review-card, .benefit-item, .faq-item, .timeline-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // stagger siblings
                const parent = entry.target.parentElement;
                const siblings = Array.from(parent.children).filter(el =>
                    el.classList.contains(entry.target.classList[0])
                );
                const index = siblings.indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== FAQ =====
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });

    // ===== PHONE MASK =====
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 ';
        });

        phoneInput.addEventListener('input', (e) => {
            let raw = e.target.value.replace(/\D/g, '');
            if (raw.startsWith('7')) raw = raw.substring(1);
            if (raw.startsWith('8')) raw = raw.substring(1);

            let f = '+7';
            if (raw.length > 0) f += ' (' + raw.substring(0, 3);
            if (raw.length >= 3) f += ') ' + raw.substring(3, 6);
            if (raw.length >= 6) f += '-' + raw.substring(6, 8);
            if (raw.length >= 8) f += '-' + raw.substring(8, 10);

            e.target.value = f;
        });
    }

    // ===== FORM =====
    const form = document.getElementById('applyForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('input[name="name"]').value.trim();
            const phone = form.querySelector('input[name="phone"]').value.trim();
            const format = form.querySelector('select[name="format"]').value;

            if (!name || phone.length < 18) {
                const btn = form.querySelector('button');
                btn.style.transform = 'translateX(-6px)';
                setTimeout(() => btn.style.transform = 'translateX(6px)', 100);
                setTimeout(() => btn.style.transform = 'translateX(-4px)', 200);
                setTimeout(() => btn.style.transform = 'translateX(0)', 300);
                return;
            }

            // Telegram Bot
            const BOT_TOKEN = 'ВАШ_ТОКЕН';
            const CHAT_ID = 'ВАШ_CHAT_ID';

            const text = `🍸 Новая заявка с сайта\n\n👤 ${name}\n📱 ${phone}\n🎯 ${format || '—'}`;

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text })
            }).catch(() => {});

            // Success state
            form.innerHTML = `
                <div class="form-success">
                    <h3>Заявка отправлена ✓</h3>
                    <p>Напишем в WhatsApp в течение 30 минут.<br>Если не ответим — напиши сам: <strong>+7 (XXX) XXX-XX-XX</strong></p>
                </div>
            `;
        });
    }

    // ===== FOMO COUNTER =====
    const spotsEl = document.getElementById('spotsCount');
    if (spotsEl) {
        let spots = 12;
        setInterval(() => {
            if (spots > 3) {
                spots--;
                spotsEl.textContent = spots;
                spotsEl.style.transition = 'none';
                spotsEl.style.opacity = '0';
                spotsEl.style.transform = 'translateY(-8px)';
                requestAnimationFrame(() => {
                    spotsEl.style.transition = 'all 0.4s ease';
                    spotsEl.style.opacity = '1';
                    spotsEl.style.transform = 'translateY(0)';
                });
            }
        }, 50000 + Math.random() * 40000);
    }

    // ===== STICKY NAV =====
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('fixed');
        } else {
            nav.classList.remove('fixed');
        }
    });
});
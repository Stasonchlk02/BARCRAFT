document.addEventListener('DOMContentLoaded', () => {

    // Scroll reveal
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const i = [...e.target.parentElement.children].indexOf(e.target);
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // FAQ
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const open = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!open) item.classList.add('open');
        });
    });

    // Phone mask
    const phone = document.querySelector('input[name="phone"]');
    phone.addEventListener('focus', e => { if (!e.target.value) e.target.value = '+7 '; });
    phone.addEventListener('input', e => {
        let d = e.target.value.replace(/\D/g, '');
        if (d[0] === '7' || d[0] === '8') d = d.slice(1);
        let f = '+7';
        if (d.length > 0) f += ' (' + d.slice(0, 3);
        if (d.length >= 3) f += ') ' + d.slice(3, 6);
        if (d.length >= 6) f += '-' + d.slice(6, 8);
        if (d.length >= 8) f += '-' + d.slice(8, 10);
        e.target.value = f;
    });

    // Form
    document.getElementById('form').addEventListener('submit', e => {
        e.preventDefault();
        const f = e.target;
        const name = f.name.value.trim();
        const ph = f.phone.value.trim();
        if (!name || ph.length < 18) return;

        // Telegram
        const TOKEN = 'ВАШ_ТОКЕН';
        const CHAT = 'ВАШ_CHAT_ID';
        fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT, text: `🍸 Заявка\n\n${name}\n${ph}\n${f.format.value || '—'}` })
        }).catch(() => {});

        f.innerHTML = '<div class="form-success"><h3>Заявка отправлена ✓</h3><p>Напишем в WhatsApp в течение 30 минут</p></div>';
    });

    // Nav
    window.addEventListener('scroll', () => {
        document.querySelector('.nav').classList.toggle('fixed', scrollY > 80);
    });
});

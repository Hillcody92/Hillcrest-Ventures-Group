/**
 * Contact Form Handler — Hillcrest Ventures Group
 *
 * Uses Formspree for form submission (https://formspree.io).
 * To activate:
 *   1. Create a free account at formspree.io
 *   2. Create a new form — you'll get an endpoint like: https://formspree.io/f/abcdefgh
 *   3. Replace 'YOUR_FORM_ID' below with your form ID (the 8-character code after /f/)
 */

const FORMSPREE_ID = 'meevowza';

const form = document.getElementById('contactForm');

if (form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;

    // Clear a field's error when the user starts correcting it
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!validateForm()) return;

        // Loading state
        setLoading(true);

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccess();
            } else {
                const json = await response.json().catch(() => ({}));
                const msg = json.errors
                    ? json.errors.map(err => err.message).join(' ')
                    : 'Something went wrong. Please try again or email us directly.';
                showSubmitError(msg);
                setLoading(false);
            }
        } catch {
            showSubmitError('Unable to send. Please check your connection or email us directly.');
            setLoading(false);
        }
    });

    // ─── Validation ───────────────────────────────────────────────────────────

    function validateForm() {
        let valid = true;

        const fields = [
            { id: 'fullName',    label: 'Full name',      required: true },
            { id: 'email',       label: 'Email address',  required: true, type: 'email' },
            { id: 'inquiryType', label: 'Inquiry type',   required: true },
            { id: 'message',     label: 'Message',        required: true },
        ];

        fields.forEach(({ id, label, required, type }) => {
            const el = document.getElementById(id);
            const errorEl = document.getElementById(id + 'Error');
            if (!el || !errorEl) return;

            const value = el.value.trim();

            if (required && !value) {
                setFieldError(el, errorEl, `${label} is required.`);
                valid = false;
            } else if (type === 'email' && value) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    setFieldError(el, errorEl, 'Please enter a valid email address.');
                    valid = false;
                }
            }
        });

        return valid;
    }

    function setFieldError(field, errorEl, msg) {
        field.classList.add('is-error');
        errorEl.textContent = msg;
    }

    function clearFieldError(field) {
        field.classList.remove('is-error');
        const errorEl = document.getElementById(field.id + 'Error');
        if (errorEl) errorEl.textContent = '';
        // Also clear the submit-level error banner when the user edits
        const banner = form.querySelector('.form-submit-error');
        if (banner) banner.textContent = '';
    }

    // ─── State helpers ────────────────────────────────────────────────────────

    function setLoading(loading) {
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading ? 'Sending&hellip;' : originalBtnHTML;
        submitBtn.style.opacity = loading ? '0.65' : '1';
    }

    function showSubmitError(msg) {
        let banner = form.querySelector('.form-submit-error');
        if (!banner) {
            banner = document.createElement('p');
            banner.className = 'form-submit-error';
            form.querySelector('.form-submit-wrap').prepend(banner);
        }
        banner.textContent = msg;
    }

    function showSuccess() {
        const wrap = document.querySelector('.contact-form-wrap');
        wrap.innerHTML = `
            <div class="form-success">
                <div class="form-success__check">&#10003;</div>
                <h2>Message Sent.</h2>
                <p>Thanks for reaching out. We read every message personally and will get back to you within 1–2 business days.</p>
                <a href="index.html" class="btn btn--navy" style="margin-top: 32px; display: inline-block; padding: 14px 28px;">Back to Home &rarr;</a>
            </div>
        `;
    }
}

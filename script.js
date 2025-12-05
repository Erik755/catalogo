document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay for the outline to create a trailing effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');
    const openBtns = document.querySelectorAll('.open-modal');

    // Project Simulations Data
    const projectsData = {
        ecommerce: {
            url: 'demos/ecommerce/index.html',
            title: 'ShopDemo'
        },
        blog: {
            url: 'demos/blog/index.html',
            title: 'TechInsights'
        },
        landing: {
            url: 'demos/landing/index.html',
            title: 'RocketSaaS'
        }
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectType = e.target.closest('.project-card').dataset.project;
            const data = projectsData[projectType];

            if (data) {
                // Build the simulated browser window with Iframe
                modalBody.innerHTML = `
                    <div class="browser-mockup">
                        <div class="browser-bar">
                            <div class="browser-dot red close-demo" title="Cerrar"></div>
                            <div class="browser-dot yellow"></div>
                            <div class="browser-dot green"></div>
                            <div class="browser-address">https://${data.title.toLowerCase()}.com</div>
                        </div>
                        <div class="browser-content" style="overflow: hidden;">
                            <iframe src="${data.url}" style="width: 100%; height: 100%; border: none;"></iframe>
                        </div>
                    </div>
                `;

                // Make red dot close the modal
                document.querySelector('.close-demo').addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    cursorDot.style.display = 'block';
                    cursorOutline.style.display = 'block';
                });
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Hide main page cursor
                cursorDot.style.display = 'none';
                cursorOutline.style.display = 'none';
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Show main page cursor
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Show main page cursor
            cursorDot.style.display = 'block';
            cursorOutline.style.display = 'block';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();

    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Simulate sending
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '¡Mensaje Enviado!';
        btn.style.background = '#27c93f';

        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Te responderé lo antes posible.');
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 1500);
    }, 1000);
}

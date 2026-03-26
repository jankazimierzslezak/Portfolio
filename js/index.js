document.addEventListener('DOMContentLoaded', () => {
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));
    const sections = Array.from(document.querySelectorAll('.section'));
    const homeSection = document.getElementById('home');
    const activitiesSection = document.getElementById('activities');

    const validIds = navLinks
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('#'))
        .map(href => href.slice(1));

    function setActiveLink(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('is-active', href === `#${targetId}`);
        });
    }

    function hideAllSections() {
        sections.forEach(section => {
            section.classList.remove('is-active');
        });
    }

    function showTab(targetId) {
        const id = validIds.includes(targetId) ? targetId : 'home';

        hideAllSections();

        if (id === 'home') {
            if (homeSection) homeSection.classList.add('is-active');
            if (activitiesSection) activitiesSection.classList.add('is-active');
        } else {
            const targetSection = document.getElementById(id);
            if (targetSection) targetSection.classList.add('is-active');
        }

        setActiveLink(id);
    }

    function getHashTarget() {
        const hash = window.location.hash.replace('#', '');
        return validIds.includes(hash) ? hash : 'home';
    }

    document.body.classList.add('tabbed-view');
    showTab(getHashTarget());

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const targetId = href.slice(1);
            if (!validIds.includes(targetId)) return;

            event.preventDefault();
            showTab(targetId);
            window.location.hash = targetId;
        });
    });

    window.addEventListener('hashchange', () => {
        showTab(getHashTarget());
    });

    const pdfButton = document.getElementById('generate-pdf-btn');
    if (pdfButton) {
        pdfButton.addEventListener('click', (event) => {
            event.preventDefault();
            window.print();
        });
    }

    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        const lastModifiedDate = new Date(document.lastModified);

        const day = String(lastModifiedDate.getDate()).padStart(2, '0');
        const month = String(lastModifiedDate.getMonth() + 1).padStart(2, '0');
        const year = lastModifiedDate.getFullYear();
     
        lastModifiedElement.textContent = `Last updated: ${day}.${month}.${year}`;
    }

    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
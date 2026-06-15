// ==========================================
// PORTFOLIO — interaktywna oś czasu (mapa metra)
// Źródło prawdy danych: data.json (wspólne ze stroną i generatorem CV w
// tools/cv-generator). Dodanie wpisu w data.json aktualizuje i tę stronę, i PDF.
// Struktura przeniesiona z bijou-site (src/js/portfolio/portfolio.js); warstwa
// danych zostaje na fetch('data.json') (NIE osadzony const). Ruch/motyw: osobne
// moduły (reveal.js, motyw.js).
// ==========================================
(() => {
    "use strict";

    // ==========================================
    // KONFIGURACJA MAPY
    // ==========================================
    const CATEGORY_COLORS = {
        education: '#1d3557',
        internships: '#0077b6',
        work: '#2a9d8f',
        publications: '#8338ec',
        conferences: '#e63946',
        courses: '#f4a261'
    };

    // Centralizacja wszystkich "magicznych liczb"
    const MAP_CONFIG = {
        mainAxisY: 480,
        paddingStart: 60,
        paddingEnd: 120,
        pixelsPerYear: 400,
        minTimeDistance: 90,
        verticalLaneOffset: 85,
        baseCurveWidth: 35,
        laneSpacing: 40,
        segmentLength: 220,
        dragMultiplier: 1.5,
        // Odstęp „Today" za ostatnim wpisem. Etykieta stacji to stałe 180px pudło
        // sięgające ~225px w prawo od kropki, a plakietka „Today" jest centrowana
        // (wystaje ~35px w lewo) — 280px daje jej margines, żeby nie wjechała pod etykietę.
        todayGap: 280
    };

    // ==========================================
    // GŁÓWNA INICJALIZACJA
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        setLastUpdated();

        const container = document.getElementById('subway-container');
        const track = document.getElementById('tl-track');
        const stage = document.getElementById('tl-stage');
        const modal = document.getElementById('station-modal');

        if (!container) return;

        // Dane portfolio czytamy z data.json (źródło prawdy, wspólne z CV).
        fetch('data.json')
            .then((response) => {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then((data) => {
                const entries = data && Array.isArray(data.entries) ? data.entries : [];
                const safeData = normalizeDates(entries);
                const timeMap = calculateTimeMap(safeData);

                initMapRendering(container, safeData, timeMap, modal);
                setupScrollScrub(track, stage, container);
                setupModalEvents(modal);
            })
            .catch((err) => {
                console.error('Nie udało się wczytać data.json:', err);
            });
    });

    // Data ostatniej aktualizacji w stopce (z nagłówka Last-Modified pliku).
    function setLastUpdated() {
        const el = document.getElementById('last-updated');
        if (!el) return;
        const d = new Date(document.lastModified);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        el.textContent = `${day}.${month}.${d.getFullYear()}`;
    }

    // ==========================================
    // LOGIKA BIZNESOWA (Dane i Kalkulacje)
    // ==========================================
    function normalizeDates(data) {
        if (!Array.isArray(data)) return [];

        return data.map(item => {
            const processedItem = { ...item };

            if (processedItem.date) {
                const d = new Date(processedItem.date + "-01");
                if (!isNaN(d.getTime())) {
                    processedItem.timestamp = d.getFullYear() + (d.getMonth() / 12);
                }
            }
            if (processedItem.endDate) {
                const d = new Date(processedItem.endDate + "-01");
                if (!isNaN(d.getTime())) {
                    processedItem.endTimestamp = d.getFullYear() + (d.getMonth() / 12);
                }
            }
            return processedItem;
        }).filter(item => item.timestamp !== undefined);
    }

    function calculateTimeMap(data) {
        let allTimePoints = [];
        let maxContentTs = 0;

        data.forEach(item => {
            if (item.timestamp) {
                allTimePoints.push(item.timestamp);
                if (item.timestamp > maxContentTs) maxContentTs = item.timestamp;
            }
            const isPresent = item.dateLabel && item.dateLabel.toLowerCase().includes("present");
            if (item.endTimestamp && !isPresent) {
                allTimePoints.push(item.endTimestamp);
                if (item.endTimestamp > maxContentTs) maxContentTs = item.endTimestamp;
            }
        });

        const currentYear = new Date().getFullYear();
        if (allTimePoints.length === 0) {
            allTimePoints.push(currentYear);
            maxContentTs = currentYear;
        }

        const minTimeVal = Math.min(...allTimePoints);
        const startYear = Math.floor(minTimeVal);
        // Oś kończymy na ostatnim roku z TREŚCIĄ (nie na bieżącym), żeby nie ciągnąć
        // pustego pasa miesięcy, gdy najnowszy wpis jest sprzed dłuższego czasu.
        const endYear = Math.min(currentYear, Math.max(startYear, Math.floor(maxContentTs)));

        for (let y = startYear; y <= endYear; y++) {
            allTimePoints.push(y);
        }

        allTimePoints = [...new Set(allTimePoints)].sort((a, b) => a - b);
        const minTime = allTimePoints[0];

        const timeToX = {};
        allTimePoints.forEach((ts, index) => {
            let naturalX = MAP_CONFIG.paddingStart + ((ts - minTime) * MAP_CONFIG.pixelsPerYear);
            if (index > 0) {
                const prevTs = allTimePoints[index - 1];
                const prevX = timeToX[prevTs];
                if (naturalX < prevX + MAP_CONFIG.minTimeDistance) {
                    naturalX = prevX + MAP_CONFIG.minTimeDistance;
                }
            }
            timeToX[ts] = naturalX;
        });

        // „Today" jako czysta prawa granica tuż za ostatnim wpisem — gap na tyle
        // duży, by etykieta najnowszej stacji nie zasłoniła plakietki „Today".
        const maxFiniteX = Math.max(...Object.values(timeToX));
        const todayX = maxFiniteX + MAP_CONFIG.todayGap;
        const finalWidth = todayX + MAP_CONFIG.paddingEnd;

        return { startYear, endYear, timeToX, finalWidth, todayX };
    }

    // ==========================================
    // WARSTWA WIDOKU (Renderowanie DOM)
    // ==========================================
    function initMapRendering(container, data, timeMap, modal) {
        container.style.minWidth = `${timeMap.finalWidth}px`;

        drawBackgroundGrid(container, timeMap);

        const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgOverlay.id = 'subway-svg';
        svgOverlay.style.width = `${timeMap.finalWidth}px`;
        svgOverlay.setAttribute('aria-hidden', 'true'); // a11y: ukrywamy ozdobne linie
        container.appendChild(svgOverlay);

        drawTimelineNodes(container, svgOverlay, data, timeMap, modal);
    }

    function drawBackgroundGrid(container, timeMap) {
        const fragment = document.createDocumentFragment();

        for (let y = timeMap.startYear; y <= timeMap.endYear; y++) {
            const yearX = timeMap.timeToX[y];

            const yearLine = document.createElement('div');
            yearLine.className = 'year-line';
            yearLine.style.left = `${yearX}px`;
            yearLine.setAttribute('aria-hidden', 'true');
            fragment.appendChild(yearLine);

            const yearLabel = document.createElement('div');
            yearLabel.className = 'year-label';
            yearLabel.style.left = `${yearX}px`;
            yearLabel.textContent = y;
            yearLabel.setAttribute('aria-hidden', 'true');
            fragment.appendChild(yearLabel);
        }

        // Czysty BEM zamiast stylów inline
        const todayLine = document.createElement('div');
        todayLine.className = 'year-line year-line--today';
        todayLine.style.left = `${timeMap.todayX}px`;
        todayLine.setAttribute('aria-hidden', 'true');
        fragment.appendChild(todayLine);

        const todayLabel = document.createElement('div');
        todayLabel.className = 'year-label year-label--today';
        todayLabel.style.left = `${timeMap.todayX}px`;
        todayLabel.textContent = "Today";
        todayLabel.setAttribute('aria-hidden', 'true');
        fragment.appendChild(todayLabel);

        container.appendChild(fragment);
    }

    function drawTimelineNodes(container, svgOverlay, data, timeMap, modal) {
        const fragment = document.createDocumentFragment();
        const globalLanes = [];

        const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

        sortedData.forEach((item, index) => {
            const categoryColor = CATEGORY_COLORS[item.line];
            if (!categoryColor || !item.timestamp) return;

            const startX = timeMap.timeToX[item.timestamp];
            const isPresent = item.dateLabel && item.dateLabel.toLowerCase().includes("present");
            const isDuration = item.endTimestamp != null || isPresent;

            const endX = isPresent ? timeMap.todayX : (isDuration ? timeMap.timeToX[item.endTimestamp] : startX);

            let assignedLaneIndex = 0;
            while (true) {
                const laneEndX = globalLanes[assignedLaneIndex] || 0;
                if (laneEndX < startX - MAP_CONFIG.laneSpacing) break;
                assignedLaneIndex++;
            }
            globalLanes[assignedLaneIndex] = isDuration ? (isPresent ? endX : endX + MAP_CONFIG.laneSpacing) : startX + MAP_CONFIG.segmentLength;

            const mainY = MAP_CONFIG.mainAxisY + 3;
            const level = Math.floor(assignedLaneIndex / 2) + 1;
            const sign = (assignedLaneIndex % 2 === 0) ? -1 : 1;

            const verticalOffset = level * MAP_CONFIG.verticalLaneOffset * sign;
            const laneY = mainY + verticalOffset;

            let curveW = MAP_CONFIG.baseCurveWidth;
            if (isDuration && (endX - startX) < curveW * 2 && !isPresent) {
                curveW = Math.max((endX - startX) / 2, 10);
            }

            let pathD = `M ${startX} ${mainY} C ${startX + curveW / 2} ${mainY}, ${startX + curveW / 2} ${laneY}, ${startX + curveW} ${laneY} `;

            if (isDuration) {
                if (isPresent) {
                    pathD += `L ${endX} ${laneY}`;
                } else {
                    pathD += `L ${endX - curveW} ${laneY} C ${endX - curveW / 2} ${laneY}, ${endX - curveW / 2} ${mainY}, ${endX} ${mainY}`;
                }
            } else {
                pathD += `L ${startX + curveW + 180} ${laneY}`;
            }

            const segmentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            segmentPath.setAttribute("d", pathD);
            segmentPath.setAttribute("class", "station-segment-path");
            segmentPath.setAttribute("id", `subway-path-${index}`);
            segmentPath.setAttribute("stroke", categoryColor);
            segmentPath.setAttribute("stroke-linecap", "round");
            segmentPath.setAttribute("stroke-linejoin", "round");
            svgOverlay.appendChild(segmentPath);

            const stationWrapper = document.createElement('div');
            stationWrapper.className = 'station-wrapper';
            stationWrapper.dataset.index = index;
            stationWrapper.style.left = `${startX}px`;
            stationWrapper.style.top = `${MAP_CONFIG.mainAxisY}px`;
            stationWrapper.style.setProperty('--cat-color', categoryColor);

            // Dostępność (A11y) — fokus i obsługa czytników ekranu
            stationWrapper.setAttribute('tabindex', '0');
            stationWrapper.setAttribute('role', 'button');
            stationWrapper.setAttribute('aria-label', `${item.title || 'Wpis portfolio'} - ${item.dateLabel || ''}`);

            const startDot = document.createElement('div');
            startDot.className = 'station-dot';
            startDot.style.borderColor = categoryColor;
            stationWrapper.appendChild(startDot);

            if (isDuration && !isPresent) {
                const endDot = document.createElement('div');
                endDot.className = 'station-dot station-end-dot';
                endDot.style.borderColor = categoryColor;
                endDot.style.left = `${endX - startX}px`;
                stationWrapper.appendChild(endDot);
            }

            const label = document.createElement('div');
            label.className = 'station-label';
            label.style.top = `${verticalOffset}px`;
            label.style.left = `${curveW + 10}px`;

            label.innerHTML = `
                <span class="station-date-badge">${item.dateLabel || ''}</span><br>
                <span class="station-title-text">${item.title || ''}</span>
            `;

            stationWrapper.appendChild(label);
            fragment.appendChild(stationWrapper);
        });

        container.appendChild(fragment);
        setupTimelineDelegation(container, sortedData, modal);
    }

    // ==========================================
    // FUNKCJE INTERFEJSU UŻYTKOWNIKA (UI Events)
    // ==========================================
    function setupTimelineDelegation(container, sortedData, modal) {
        container.addEventListener('mouseover', (e) => {
            const wrapper = e.target.closest('.station-wrapper');
            if (!wrapper) return;

            const index = wrapper.dataset.index;
            const path = document.getElementById(`subway-path-${index}`);
            const relatedWrapper = e.relatedTarget ? e.relatedTarget.closest('.station-wrapper') : null;

            if (wrapper !== relatedWrapper && path) {
                path.classList.add('is-active');
            }

            if (e.target.closest('.station-end-dot')) {
                wrapper.style.zIndex = '20';
            }
        });

        container.addEventListener('mouseout', (e) => {
            const wrapper = e.target.closest('.station-wrapper');
            if (!wrapper) return;

            const index = wrapper.dataset.index;
            const path = document.getElementById(`subway-path-${index}`);
            const relatedWrapper = e.relatedTarget ? e.relatedTarget.closest('.station-wrapper') : null;

            if (wrapper !== relatedWrapper && path) {
                path.classList.remove('is-active');
            }

            if (e.target.closest('.station-end-dot')) {
                wrapper.style.zIndex = '10';
            }
        });

        // Obsługa kliknięcia (Myszka / Dotyk)
        container.addEventListener('click', (e) => {
            const wrapper = e.target.closest('.station-wrapper');
            if (wrapper) {
                const index = wrapper.dataset.index;
                const item = sortedData[index];
                if (item) openModal(item, modal);
            }
        });

        // Obsługa klawiatury (Enter / Spacja) dla dostępności
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const wrapper = e.target.closest('.station-wrapper');
                if (wrapper) {
                    e.preventDefault(); // Zapobiega przewinięciu strony po wciśnięciu spacji
                    const index = wrapper.dataset.index;
                    const item = sortedData[index];
                    if (item) openModal(item, modal);
                }
            }
        });
    }

    function openModal(item, modal) {
        if (!modal || document.body.classList.contains('is-dragging')) return;

        document.getElementById('modal-date').textContent = item.dateLabel || '';
        document.getElementById('modal-title').textContent = item.title || '';
        document.getElementById('modal-subtitle').textContent = item.subtitle || '';

        const descEl = document.getElementById('modal-desc');
        if (item.description) {
            // Opis może zawierać HTML (linki/listy) — wstawiamy go wyłącznie po
            // sanityzacji DOMPurify. Bez DOMPurify degradujemy do czystego tekstu,
            // nigdy nie wstawiamy surowego HTML (ochrona przed XSS).
            if (typeof DOMPurify !== 'undefined') {
                descEl.innerHTML = DOMPurify.sanitize(item.description);
            } else {
                descEl.textContent = item.description;
            }
        } else {
            descEl.innerHTML = '';
        }

        const imgEl = document.getElementById('modal-img');
        if (item.image) {
            imgEl.src = item.image; // ścieżki w data.json są relatywne (np. img/...)
            imgEl.style.display = 'block';
            // Zabezpieczenie przed brakującym obrazkiem z pliku z danymi
            imgEl.onerror = () => { imgEl.style.display = 'none'; };
        } else {
            imgEl.style.display = 'none';
        }

        modal.showModal();
    }

    function setupModalEvents(modal) {
        const closeBtn = document.getElementById('close-modal');
        if (!closeBtn || !modal) return;

        closeBtn.addEventListener('click', () => modal.close());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    }

    function setupDragAndScroll(wrapper) {
        if (!wrapper) return;

        let isDown = false;
        let mouseStartX, scrollLeft;
        let rafId = null;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            document.body.classList.remove('is-dragging');
            mouseStartX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            wrapper.style.cursor = 'grabbing';
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
            document.body.classList.remove('is-dragging');
            if (rafId) cancelAnimationFrame(rafId);
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
            if (rafId) cancelAnimationFrame(rafId);
            setTimeout(() => { document.body.classList.remove('is-dragging'); }, 50);
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            document.body.classList.add('is-dragging');

            if (rafId) cancelAnimationFrame(rafId);

            const x = e.pageX - wrapper.offsetLeft;
            rafId = requestAnimationFrame(() => {
                wrapper.scrollLeft = scrollLeft - ((x - mouseStartX) * MAP_CONFIG.dragMultiplier);
                rafId = null;
            });
        });

    }

    // Oś przypięta do ekranu: zjazd w dół przewija ją w poziomie (transform).
    // Mapa jest wyższa niż ekran, więc skalujemy ją do wysokości viewportu i
    // wyśrodkowujemy w pionie. Reduced-motion: degradacja do zwykłego przewijania.
    function setupScrollScrub(track, stage, container) {
        if (!track || !stage || !container) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setupDragAndScroll(stage);
            return;
        }

        track.classList.add('tl-active');

        // Pionowy oddech nad i pod treścią (px w układzie mapy).
        const PAD = 20;
        // Górny limit powiększania na wysokich oknach (treść wypełnia wysokość, ale
        // nie rośnie w nieskończoność).
        const MAX_SCALE = 1.8;
        const header = document.querySelector('header');

        // Jeśli przeglądarka wspiera animacje sterowane scrollem (CSS
        // animation-timeline), pan osi liczy KOMPOZYTOR poza głównym wątkiem — koniec
        // z szarpaniem scroll-linked transformu na telefonie (iOS Safari 26+). JS tylko
        // publikuje skalę i przesunięcie jako zmienne CSS, a faktyczny przesuw robi
        // keyframe @keyframes tl-scrub powiązany z view-timeline toru (zob. style.css).
        // Bez wsparcia — fallback do liczenia transformu w rAF na zdarzeniu scroll.
        const scrollDriven = !!(window.CSS && CSS.supports &&
            CSS.supports('animation-timeline: scroll()'));

        let scale = 1;
        let maxShift = 0;
        let contentTop = 0;   // górna krawędź realnej treści (px mapy)
        let fitH = 1;         // wysokość treści + oddech (baza skalowania)
        let ticking = false;
        // Buforowane w measure(), żeby apply() (klatka scrolla) NIE czytał layoutu:
        let headerHeight = 0; // header.offsetHeight — zmienia się tylko przy resize
        let trackTop = 0;     // górna krawędź toru względem DOKUMENTU (nie viewportu)

        function headerH() {
            return header ? header.offsetHeight : 0;
        }

        // Realne pionowe granice treści (etykiety stacji i lat) w układzie mapy.
        // Mierzymy przy wyzerowanym transformie, więc rect-y = offset w px mapy —
        // dzięki temu skala i wyśrodkowanie zależą od FAKTYCZNIE użytych torów, a nie
        // od zgadywanych stałych. To likwiduje przycinanie góry i pustkę na dole:
        // ile by torów nie wyszło z danych, oś zawsze mieści się w całości z równym
        // marginesem. Liczymy tylko etykiety (nie pełnowysokie linie lat / SVG).
        function contentBounds() {
            const prevAnim = stage.style.animationName;
            const prev = stage.style.transform;
            // Mierzymy w nieprzeskalowanym układzie mapy. W trybie scroll-driven sama
            // animacja CSS nadpisuje transform inline, więc najpierw ją wyłączamy
            // (animation-name:none), inaczej czytalibyśmy rect-y już przeskalowane.
            stage.style.animationName = "none";
            stage.style.transform = "none";
            const base = container.getBoundingClientRect().top;
            let top = Infinity;
            let bottom = -Infinity;
            container.querySelectorAll(".station-label, .year-label").forEach((el) => {
                const r = el.getBoundingClientRect();
                if (!r.height) return;
                top = Math.min(top, r.top - base);
                bottom = Math.max(bottom, r.bottom - base);
            });
            stage.style.transform = prev;
            stage.style.animationName = prevAnim;
            if (top === Infinity) {
                top = 0;
                bottom = container.offsetHeight;
            }
            return { top, bottom };
        }

        function measure() {
            const vw = window.innerWidth;
            headerHeight = headerH();                      // bufor na klatki scrolla
            const availH = window.innerHeight - headerHeight;
            const mapW = container.offsetWidth;           // = finalWidth (min-width)

            const b = contentBounds();
            contentTop = b.top - PAD;
            fitH = b.bottom - b.top + PAD * 2;            // treść + oddech góra/dół
            // Skala WYPEŁNIA wysokość: niskie okna zmniejszają, wysokie powiększają
            // (do MAX_SCALE), by treść sięgała i góry, i dołu. Skala jest globalna —
            // to równomierny zoom CAŁEJ mapy, więc bez nowych nachodzeń etykiet.
            scale = Math.min(MAX_SCALE, availH / fitH);
            maxShift = Math.max(0, mapW * scale - vw);    // pozioma droga przewijania
            track.style.height = (window.innerHeight + maxShift) + "px";
            if (scrollDriven) {
                publishVars();
            } else {
                // Pozycja toru względem dokumentu (po ustawieniu wysokości — własny top
                // toru się od niej nie zmienia). W apply() odejmiemy tylko scrollY, więc
                // klatka scrolla nie musi już wołać getBoundingClientRect().
                trackTop = track.getBoundingClientRect().top + window.scrollY;
                apply();
            }
        }

        // Tryb scroll-driven: zamiast liczyć transform na każdej klatce, publikujemy
        // tylko parametry jako zmienne CSS, a keyframe tl-scrub przesuwa scenę po osi
        // X od -maxShift do 0. W fazie przypięcia panY jest stałe (stickyTop=0 →
        // headerClear=headerHeight), więc keyframe zmienia wyłącznie panX.
        function publishVars() {
            const panY = headerHeight - contentTop * scale;
            stage.style.setProperty("--tl-panx-start", (-maxShift) + "px");
            stage.style.setProperty("--tl-pany", panY + "px");
            stage.style.setProperty("--tl-scale", scale);
        }

        function apply() {
            // top toru względem viewportu BEZ czytania layoutu: pozycja w dokumencie
            // (bufor z measure) minus bieżący scroll. window.scrollY nie wymusza
            // reflow, w przeciwieństwie do getBoundingClientRect()/offsetHeight, które
            // przy każdej klatce zarzynały płynność na telefonie.
            const top = trackTop - window.scrollY;
            const progress = maxShift > 0 ? Math.min(1, Math.max(0, -top / maxShift)) : 0;
            // Najnowsze u góry: start (góra) pokazuje prawy koniec mapy (Today),
            // a zjazd w dół jedzie w stronę 2020 (od najnowszych do najstarszych).
            const panX = -(1 - progress) * maxShift;
            // Treść wyrównana do GÓRY (tuż pod nagłówkiem / sekcją „What I do"), nie
            // wyśrodkowana — inaczej slack/2 spychał oś w dół i u góry zostawała pusta
            // przerwa (siatka nie dosięgała sekcji). Korekta na nagłówek narasta w
            // miarę wpinania sceny: pełne hH przy wpięciu (sticky.top≈0), mniej w
            // trakcie wjazdu (scena jeszcze nisko) — bez tego treść spadałaby o hH.
            // stickyTop wyprowadzamy z `top` (scena jest sticky;top:0, więc do wpięcia
            // jej górna krawędź ≈ top toru, a po wpięciu = 0). Rozbieżność tylko przy
            // progress≈1 (pomijalna).
            const stickyTop = Math.max(0, top);
            const headerClear = Math.max(0, headerHeight - stickyTop);
            const panY = headerClear - contentTop * scale;
            stage.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => { ticking = false; apply(); });
        }

        // Na telefonie pokazanie/schowanie paska adresu zmienia tylko wysokość okna
        // i wywołuje lawinę „resize". Pełny measure() (czyta dziesiątki prostokątów
        // w contentBounds) w trakcie gestu = zacinanie i skoki skali. Na dotyku
        // mierzymy ponownie WYŁĄCZNIE przy zmianie szerokości (orientacja); na
        // desktopie mierzymy zawsze, ale z lekkim debounce.
        const coarse = window.matchMedia('(pointer: coarse)').matches;
        let lastW = window.innerWidth;
        let resizeTimer = null;
        function onResize() {
            if (coarse && window.innerWidth === lastW) return;
            lastW = window.innerWidth;
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(measure, 150);
        }

        // Scroll obsługuje kompozytor (CSS), więc nasłuch scrolla podpinamy TYLKO w
        // fallbacku. resize potrzebny zawsze — przelicza skalę/zmienne CSS po obrocie.
        if (!scrollDriven) {
            window.addEventListener("scroll", onScroll, { passive: true });
        }
        window.addEventListener("resize", onResize, { passive: true });
        // Web-fonty zmieniają wysokość etykiet (zawijanie) — przemierz po ich
        // załadowaniu, żeby granice nie były liczone na zastępczym foncie.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(measure);
        }
        measure();
    }
})();

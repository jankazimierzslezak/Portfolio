// ==========================================
// DANE PORTFOLIO
// Źródło prawdy: data.json (wspólne ze stroną i generatorem CV w tools/cv-generator).
// Dodanie wpisu w data.json aktualizuje i tę stronę, i generowany PDF.
// ==========================================
let portfolioData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then((data) => {
            portfolioData = data.entries;
            initPortfolio();
        })
        .catch((err) => {
            console.error('Nie udało się wczytać data.json:', err);
        });
});

function initPortfolio() {

    // --- 1. EFEKT KURTYNY I ANIMACJE STARTOWE ---
    document.body.classList.add('tabbed-view');
    setTimeout(() => {
        document.documentElement.classList.add('is-ready');
    }, 150);

    // --- 2. AUTOMATYCZNA DATA OSTATNIEJ AKTUALIZACJI ---
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const lastModDate = new Date(document.lastModified);
        const day = String(lastModDate.getDate()).padStart(2, '0');
        const month = String(lastModDate.getMonth() + 1).padStart(2, '0'); 
        const year = lastModDate.getFullYear();
        lastUpdatedElement.textContent = `${day}.${month}.${year}`;
    }

    // --- 3. LOGIKA RYSOWANIA MAPY OSI CZASU ---
    portfolioData.forEach(item => {
        if (item.date) {
            const d = new Date(item.date + "-01");
            item.timestamp = d.getFullYear() + (d.getMonth() / 12);
        }
        if (item.endDate) {
            const d = new Date(item.endDate + "-01");
            item.endTimestamp = d.getFullYear() + (d.getMonth() / 12);
        }
    });

    const container = document.getElementById('subway-container');
    const wrapper = document.getElementById('subway-wrapper');
    const modal = document.getElementById('station-modal');
    const closeBtn = document.getElementById('close-modal');
    
    if (!container) return;

    const categoryConfig = {
        education: { color: '#1d3557' },
        internships: { color: '#0077b6' },
        work: { color: '#2a9d8f' },
        publications: { color: '#8338ec' },
        conferences: { color: '#e63946' },
        courses: { color: '#f4a261' }
    };

    const MAIN_AXIS_Y = 480; 
    const paddingStart = 60; 
    const paddingEnd = 110;
    const pixelsPerYear = 400; 
    const minTimeDistance = 90;

    let allTimePoints = [];
    portfolioData.forEach(item => {
        if(item.timestamp) allTimePoints.push(item.timestamp);
        const isPresent = item.dateLabel.toLowerCase().includes("present");
        if (item.endTimestamp && !isPresent) {
            allTimePoints.push(item.endTimestamp);
        }
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentTimestamp = currentYear + (now.getMonth() / 12);

    const minTimeVal = Math.min(...allTimePoints);
    const startYear = Math.floor(minTimeVal);

    for (let y = startYear; y <= currentYear; y++) {
        allTimePoints.push(y);
    }
    allTimePoints.push(currentTimestamp);

    allTimePoints = [...new Set(allTimePoints)].sort((a, b) => a - b);
    const minTime = allTimePoints[0];

    const timeToX = {};
    allTimePoints.forEach((ts, index) => {
        let naturalX = paddingStart + ((ts - minTime) * pixelsPerYear);
        if (index > 0) {
            const prevTs = allTimePoints[index - 1];
            const prevX = timeToX[prevTs];
            if (naturalX < prevX + minTimeDistance) {
                naturalX = prevX + minTimeDistance;
            }
        }
        timeToX[ts] = naturalX;
    });

    portfolioData.sort((a, b) => a.timestamp - b.timestamp);

    let maxFiniteX = 0;
    allTimePoints.forEach(ts => {
        if (timeToX[ts] > maxFiniteX) maxFiniteX = timeToX[ts];
    });

    // "Today" is drawn as a clean right-hand boundary marker. Push it well past
    // the last event so the newest entries' branch lines and labels (which extend
    // to the RIGHT of their dot) never run into the Today line or badge.
    const todayX = maxFiniteX + 300;

    const finalWidth = todayX + paddingEnd;

    for (let y = startYear; y <= currentYear; y++) {
        const yearX = timeToX[y];
        const yearLine = document.createElement('div');
        yearLine.className = 'year-line';
        yearLine.style.left = `${yearX}px`;
        container.appendChild(yearLine);

        const yearLabel = document.createElement('div');
        yearLabel.className = 'year-label';
        yearLabel.style.left = `${yearX}px`;
        yearLabel.innerText = y;
        container.appendChild(yearLabel);
    }

    // todayX is computed above as a right-boundary marker
    const todayLine = document.createElement('div');
    todayLine.className = 'year-line';
    todayLine.style.left = `${todayX}px`;
    todayLine.style.borderLeft = '2px dashed var(--clr-accent, #e63946)'; 
    todayLine.style.background = 'transparent'; 
    todayLine.style.zIndex = '1'; 
    container.appendChild(todayLine);

    const todayLabel = document.createElement('div');
    todayLabel.className = 'year-label';
    todayLabel.style.left = `${todayX}px`;
    todayLabel.style.color = '#fff';
    todayLabel.style.background = 'var(--clr-accent, #e63946)';
    todayLabel.style.border = 'none';
    todayLabel.style.zIndex = '4'; 
    todayLabel.innerText = "Today";
    container.appendChild(todayLabel);

    let globalLanes = []; 
    let isDragging = false; 

    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.id = 'subway-svg';
    container.appendChild(svgOverlay);

    portfolioData.forEach((item) => {
        const category = categoryConfig[item.line];
        if(!category || !item.timestamp) return;

        let startX = timeToX[item.timestamp];
        const isPresent = item.dateLabel.toLowerCase().includes("present");
        const isDuration = item.endTimestamp != null || isPresent;

        let endX = isPresent ? todayX : (isDuration ? timeToX[item.endTimestamp] : startX);

        let assignedLaneIndex = 0;
        while (true) {
            let laneEndX = globalLanes[assignedLaneIndex] || 0;
            if (laneEndX < startX - 40) break;
            assignedLaneIndex++;
        }
        
        globalLanes[assignedLaneIndex] = isDuration ? (isPresent ? endX : endX + 40) : startX + 220;

        const mainY = MAIN_AXIS_Y + 3; 
        let level = Math.floor(assignedLaneIndex / 2) + 1; 
        let sign = (assignedLaneIndex % 2 === 0) ? -1 : 1; 
        
        let verticalOffset = level * 85 * sign; 
        const laneY = mainY + verticalOffset; 
        
        let curveW = 35; 
        if (isDuration && (endX - startX) < curveW * 2 && !isPresent) {
            curveW = Math.max((endX - startX) / 2, 10); 
        }

        let pathD = `M ${startX} ${mainY} `; 
        pathD += `C ${startX + curveW/2} ${mainY}, ${startX + curveW/2} ${laneY}, ${startX + curveW} ${laneY} `; 

        if (isDuration) {
            if (isPresent) {
                pathD += `L ${endX} ${laneY}`;
            } else {
                pathD += `L ${endX - curveW} ${laneY} `;
                pathD += `C ${endX - curveW/2} ${laneY}, ${endX - curveW/2} ${mainY}, ${endX} ${mainY}`;
            }
        } else {
            pathD += `L ${startX + curveW + 180} ${laneY}`;
        }

        let segmentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        segmentPath.setAttribute("d", pathD);
        segmentPath.setAttribute("class", "station-segment-path");
        segmentPath.setAttribute("stroke", category.color);
        segmentPath.setAttribute("stroke-linecap", "round");
        segmentPath.setAttribute("stroke-linejoin", "round");
        segmentPath.style.color = category.color; 
        svgOverlay.appendChild(segmentPath);

        const stationWrapper = document.createElement('div');
        stationWrapper.className = 'station-wrapper';
        stationWrapper.style.left = `${startX}px`;
        stationWrapper.style.top = `${MAIN_AXIS_Y}px`; 

        if (segmentPath) {
            stationWrapper.addEventListener('mouseenter', () => segmentPath.classList.add('is-active'));
            stationWrapper.addEventListener('mouseleave', () => segmentPath.classList.remove('is-active'));
        }

        const startDot = document.createElement('div');
        startDot.className = 'station-dot';
        startDot.style.borderColor = category.color;
        stationWrapper.appendChild(startDot);

        if (isDuration && !isPresent) {
            const endDot = document.createElement('div');
            endDot.className = 'station-dot';
            endDot.style.borderColor = category.color;
            endDot.style.left = `${endX - startX}px`; 
            stationWrapper.appendChild(endDot);
            
            endDot.addEventListener('mouseenter', () => {
                segmentPath.classList.add('is-active');
                stationWrapper.style.zIndex = '20';
            });
            endDot.addEventListener('mouseleave', () => {
                segmentPath.classList.remove('is-active');
                stationWrapper.style.zIndex = '10';
            });
        }

        const label = document.createElement('div');
        label.className = 'station-label';
        
        label.style.top = `${verticalOffset}px`; 
        label.style.left = `${curveW + 10}px`; 

        label.innerHTML = `
            <span style="display:inline-block; background:${category.color}15; border: 1px solid ${category.color}40; border-radius:4px; padding:2px 6px; font-size:0.7rem; color:#555; margin-bottom:4px; font-weight:700;">
                ${item.dateLabel}
            </span><br>
            <span>${item.title}</span>
        `;
        
        stationWrapper.appendChild(label);
        container.appendChild(stationWrapper);

        stationWrapper.addEventListener('click', () => {
            if (isDragging) return;
            document.getElementById('modal-date').textContent = item.dateLabel;
            document.getElementById('modal-title').textContent = item.title;
            document.getElementById('modal-subtitle').textContent = item.subtitle;
            document.getElementById('modal-desc').innerHTML = item.description;

            const imgEl = document.getElementById('modal-img');
            if (item.image) {
                imgEl.src = `${item.image}`; 
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }
            modal.style.display = 'flex';
        });
    });

    container.style.minWidth = `${finalWidth}px`;
    svgOverlay.style.width = `${finalWidth}px`;

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // --- 4. DRAG & SCROLL ---
    let isDown = false, mouseStartX, scrollLeft;
    wrapper.addEventListener('mousedown', (e) => {
        isDown = true; isDragging = false; 
        mouseStartX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
        wrapper.style.cursor = 'grabbing';
    });
    wrapper.addEventListener('mouseleave', () => { isDown = false; wrapper.style.cursor = 'grab'; });
    wrapper.addEventListener('mouseup', () => { isDown = false; wrapper.style.cursor = 'grab'; setTimeout(() => { isDragging = false; }, 50); });
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        isDragging = true; 
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        wrapper.scrollLeft = scrollLeft - ((x - mouseStartX) * 1.5); 
    });

    const startObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            wrapper.scrollLeft = wrapper.scrollWidth;
            startObserver.disconnect();
        }
    });
    startObserver.observe(wrapper);
}

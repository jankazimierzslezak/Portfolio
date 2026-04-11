const portfolioData = [
    // ==========================================
    // Studia
    // ==========================================
    { id: "edu-pums", line: "education", dateLabel: "2020 - Present", date: "2020-10", title: "Faculty of Medicine", subtitle: "Poznan University of Medical Sciences", description: `<p></p>`, image: "img/pums.jpg" },

    // ==========================================
    // Staże
    // ==========================================
    { id: "intern-jonscher", line: "internships", dateLabel: "Jul 2024 - Apr 2025", date: "2024-07", endDate: "2025-04", title: "Dr. N. Retkowska-Tomaszewska's team", subtitle: "Neurosurgical ward, Jonscher Clinical Hospital", description: `<p>Clinical observership</p>`, image: "img/jonshera.jpg" },
    { id: "intern-usk", line: "internships", dateLabel: "Jan 2025 - Present", date: "2025-01", title: "Prof. G. Dworacki’s team", subtitle: "Clinical Hospital of Poznan University of Medical Sciences", description: `<ul><li>Developing proficiency in microscopic review of bone marrow trephine biopsies (H&E, IHC)</li><li>Assisting with structuring pathology reports and co-developing a results reporting tool</li><li>Building foundational skills in flow cytometry and performing cell culture under supervision</li></ul>`, image: "img/usk.jpg" },
    { id: "intern-medart", line: "internships", dateLabel: "Apr 2025 - Present", date: "2025-04", title: "MedART", subtitle: "Infertility Diagnosis and Treatment Center", description: `<ul><li>Training AI based to recognize CD138+, CD79a+, CD56+ and CD15+ cells</li><li>Archiving paraffin blocks, slides and scanning histopathology slides</li></ul>`, image: "img/medart.jpg" },

    // ==========================================
    // Praca
    // ==========================================
    { id: "work-wcp-1", line: "work", dateLabel: "Aug 2022 - Sep 2023", date: "2022-08", endDate: "2023-09", title: "Trainee Medical Assistant", subtitle: "Specialist Mother & Child Health Care Center", description: `<ul><li>Provided care for patients aged 0-3 years</li><li>Performed minor medical procedures</li></ul>`, image: "img/wcp.jpg" },
    { id: "work-wcp-2", line: "work", dateLabel: "Aug 2023 - Nov 2024", date: "2023-09", endDate: "2024-11", title: "Medical Assistant", subtitle: "Specialist Mother & Child Health Care Center", description: `<ul><li>Assisted physicians during examinations</li><li>Prepared and reviewed medical documentation</li></ul>`, image: "img/wcp.jpg" },
    { id: "work-consilio", line: "work", dateLabel: "Feb 2025 - Dec 2025", date: "2025-02", endDate: "2025-12", title: "Laboratory Assistant", subtitle: "Consilio Diagnostica Poznań", description: `<ul><li>Received instruction in microscopic review of pathology slides H&E and IHC</li><li>Performed macroscopic assessment</li><li>Assisted in histopathology slide preparation</li></ul>`, image: "img/logo_diagnostyka.png" },
    
    // ==========================================
    // Publikacje
    // ==========================================
    { id: "pub-cells", line: "publications", dateLabel: "Mar 2023", date: "2023-03", title: "Co-author, Genes", subtitle: "Performed supervised cell culture of MCF7, MDA-MB-231, and SK-BR-3", description: `<p>Doxorubicin and Cisplatin Modulate miR-21, miR-106, miR-126, miR-155 and miR-199 Levels in MCF7, MDA-MB-231 and SK-BR-3 Cells That Makes Them Potential Elements of the DNA-Damaging Drug Treatment Response Monitoring in Breast Cancer Cells—A Preliminary Study</p><p><a href="https://doi.org/10.3390/genes14030702" target="_blank">doi:10.3390/genes14030702</a></p>`, image: null },
    { id: "pub-ibd", line: "publications", dateLabel: "Oct 2024", date: "2024-10", title: "Co-author, Contemp. Pharm.", subtitle: "Prepared the chapter: Introduction and Inflammatory bowel diseases and fatty liver", description: `<p>Metabolic and cardiovascular disorders in patients with inflammatory bowel diseases</p><p><a href="https://doi.org/10.53139/FW.20241718" target="_blank">doi:10.53139/FW.20241718</a></p>`, image: null },
    { id: "pub-lynch", line: "publications", dateLabel: "Jan 2026", date: "2026-01", title: "Co-author, Int J Mol Sci", subtitle: "Co-authored the chapter “Genetic and Molecular Basis of Lynch Syndrome” and created a figure using BioRender", description: `<p>Hereditary Endometrial Cancer: Lynch Syndrome, Mismatch Repair Deficiency, and Emerging Genetic Predispositions—A Comprehensive Review with Clinical and Laboratory Guidelines</p><p><a href="https://doi.org/10.3390/ijms27031304" target="_blank">doi:10.3390/ijms27031304</a></p>`, image: "img/lynch.jpg" },
    { id: "pub-breast", line: "publications", dateLabel: "Feb 2026", date: "2026-02", title: "Co-author, Pharmaceutics", subtitle: "Prepared chapters on Immunosuppressive vs. Immunostimulatory Factors, developed figures using BioRender", description: `<p>Breaking Barriers: Immune Checkpoint Inhibitors in Breast Cancer</p><p><a href="https://doi.org/10.3390/pharmaceutics18010034" target="_blank">doi:10.3390/pharmaceutics18010034</a></p>`, image: "img/tme.jpg" },
    { id: "pub-ajcp", line: "publications", dateLabel: "Mar 2026", date: "2026-03", title: "Author, Am J Clin Pathol", subtitle: "Derived an AJCP-concordant formula for marrow normocellularity based on published data", description: `<p>Beyond the “100-age” rule: an AJCP-concordant formula for marrow normocellularity</p><p>Manuscript accepted</p>`, image: null },

    // ==========================================
    // Konferencje
    // ==========================================
    { id: "conf-ostrow-7", line: "conferences", dateLabel: "Nov 2023", date: "2023-11", title: "7th Greater Poland Meeting of Pediatric Surgeons", subtitle: "Oral Presentation", description: `<p>CSMD3 gene c.1075G>T variant in two children aged 3 and 7.</p>`, image: "img/7_ostrow.jpg" },
    { id: "conf-scalpellum-3", line: "conferences", dateLabel: "May 2024", date: "2024-05", title: "SCALPELLUM: 3rd National Student Conference", subtitle: "Oral Presentation", description: `<p>Vomiting in infants as a potential sign of brain disorders: a case report.</p>`, image: "img/3_scalpellum.jpg" },
    { id: "conf-hospital", line: "conferences", dateLabel: "Sep 2024", date: "2024-09", title: "“Hospital Challenge” Conference", subtitle: "Attendee", description: `<p>Specialist Mother & Child Health Care Center, Poznań.</p>`, image: null },
    { id: "conf-ostrow-8", line: "conferences", dateLabel: "Nov 2024", date: "2024-11", title: "8th Greater Poland Meeting of Pediatric Surgeons", subtitle: "Oral Presentation", description: `<p>Rare case of arteriovenous malformation in a newborn.</p>`, image: "img/8_ostrow.jpg" },
    { id: "conf-neuro", line: "conferences", dateLabel: "Dec 2024", date: "2024-12", title: "Neurooncology, Greater Poland Days", subtitle: "Co-author of oral presentation", description: `<p>Modern approaches to the treatment of diffuse gliomas: therapeutic strategies for grade I, III, and IV tumors.</p>`, image: null },
    { id: "conf-scalpellum-4", line: "conferences", dateLabel: "Apr 2025", date: "2025-04", title: "SCALPELLUM: 4th National Student Conference", subtitle: "Oral Presentation", description: `<p>Abusive Head Trauma in an Infant - Diagnostic Significance of Ocular Fundus Examination: A Case Report.</p>`, image: "img/4_scalpellum.jpg" },
    { id: "conf-bluezones", line: "conferences", dateLabel: "May 2025", date: "2025-05", title: "Lifestyle Medicine for Longevity, Blue Zones", subtitle: "Volunteered", description: `<p>Volunteered at the international conference in Poznań.</p>`, image: null },
    { id: "conf-escca", line: "conferences", dateLabel: "Sep 2025", date: "2025-09", title: "ESCCA Conference, Montpellier", subtitle: "Poster Presentation", description: `<p>How does flow cytometry of cerebrospinal fluid and peripheral blood help diagnose primary CNS lymphoma.</p>`, image: null },

    // ==========================================
    // Kursy
    // ==========================================
    { id: "course-hemato-benign", line: "courses", dateLabel: "Dec 2025", date: "2025-12", title: "Benign Entities in Blood and Bone Marrow", subtitle: "", description: `<p></p>`, image: "img/benign_entities_in_blood_and_bone_marow.jpg" },
    { id: "course-gu-path", line: "courses", dateLabel: "Jan 2026", date: "2026-01", title: "Prostate and Seminal Vesicles", subtitle: "", description: `<p></p>`, image: "img/prostate_and_seminal_vesicles.jpg" },
    { id: "course-hemato-malignant", line: "courses", dateLabel: "Jan 2026", date: "2026-01", title: "Malignant Entities in Blood & Bone Marrow", subtitle: "", description: `<p></p>`, image: "img/malignant_entities_in_blood_and_bone_marrow.jpg" }
];


// ==========================================
// INICJALIZACJA STRONY (ZBIORCZY BLOK)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

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
    
    // Konwersja dat dla punktów na mapie
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
        education: { color: '#1d3557' },    // Głęboki granatowy
        internships: { color: '#0077b6' },  // Wyrazisty niebieski
        work: { color: '#2a9d8f' },         // Morski/Teal
        publications: { color: '#8338ec' }, // Fioletowy
        conferences: { color: '#e63946' },  // Czerwony (akcent strony)
        courses: { color: '#f4a261' }       // Ciepły pomarańczowy
    };

    const MAIN_AXIS_Y = 480; 
    const paddingStart = 60; 
    const paddingEnd = 120;   
    const pixelsPerYear = 400; 
    const minTimeDistance = 90;

    // Generowanie globalnej osi czasu
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

    const finalWidth = maxFiniteX + paddingEnd;

    // Rysowanie znaczników lat na osi głównej
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

    // Znacznik "Today"
    const todayX = timeToX[currentTimestamp];
    
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

    // Rysowanie poszczególnych "stacji" na mapie
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

        // Rysowanie wektorowych krzywych odchodzących od osi
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

        // Obsługa kliknięcia (otwieranie okna modalnego)
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

    // Zamykanie okna modalnego
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // --- 4. DRAG & SCROLL (Przesuwanie mapy myszką) ---
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

    // Przewijanie mapy do końca na start
    const startObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            wrapper.scrollLeft = wrapper.scrollWidth;
            startObserver.disconnect();
        }
    });
    startObserver.observe(wrapper);

});
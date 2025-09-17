function removeHighlights() {
    const highlights = document.querySelectorAll(".highlight");
    highlights.forEach(span => {
        const parent = span.parentNode;
        // Check if parent and textContent exist before replacement
        if (parent && span.textContent !== null) {
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize(); // merge adjacent text nodes
        }
    });
}

function highlightText(node, keyword) {
    const regex = new RegExp(`(${keyword})`, "gi");
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];

    while (walker.nextNode()) {
        // Ensure the text node is not inside a script or style tag and has actual text
        if (walker.currentNode.parentNode.nodeName !== 'SCRIPT' && 
            walker.currentNode.parentNode.nodeName !== 'STYLE' &&
            walker.currentNode.nodeValue.trim().length > 0) {
            textNodes.push(walker.currentNode);
        }
    }

    let found = false; // To track if any highlights were made
    textNodes.forEach(textNode => {
        const value = textNode.nodeValue;
        if (regex.test(value)) {
            const span = document.createElement("span");
            span.innerHTML = value.replace(regex, '<span class="highlight">$&</span>'); // Use $& to insert the matched string
            textNode.parentNode.replaceChild(span, textNode);
            found = true;
        }
    });
    return found; // Return true if any highlights were found
}

function searchKeyword() {
    removeHighlights(); // clean old highlights

    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) {
        // No need for alert, maybe a visual cue instead
        console.log("Veuillez entrer un mot clé.");
        return;
    }

    const contentZones = document.querySelectorAll("main, .glossaire-content, footer");
    let keywordFound = false;
    contentZones.forEach(zone => {
        if (highlightText(zone, keyword)) {
            keywordFound = true;
        }
    });

    if (!keywordFound) {
        alert(`Le mot-clé "${keyword}" n'a pas été trouvé.`);
    }
}

// --- Mobile Navigation Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const isExpanded = navList.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a nav link is clicked (for single-page feel or fast navigation)
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
            });
        });

        // Close menu if clicked outside (optional, but good for UX)
        document.addEventListener('click', (event) => {
            if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }
});

// --------------------------------------------------------------------------------------------------
// Get data from Google Sheet
// --------------------------------------------------------------------------------------------------
const tabletop = Tabletop.init( { key: '1pt_A3Y9SOAcA-s4LIFDyxtyo1NvjM0gnQ9R3Jnmlwws',
    callback: showInfo,
    wait: true,
    simpleSheet: true } )

tabletop.fetch();

// --------------------------------------------------------------------------------------------------
// Show data from Google Sheet
// --------------------------------------------------------------------------------------------------
function showInfo(data, tabletop) {

    // Sort table by taste, total score etc.
    // ---------------------------------------------------------------------
    function sortTable(e) {
        const orderby = e.target.dataset.orderby;
        const ordered = data.sort((a, b) => a[orderby] < b[orderby] ? 1 : -1);
        buildTable(ordered);
    }

    // Build and display the table
    // ---------------------------------------------------------------------
    function buildTable(ordered) {
        document.querySelector('.biscuit-leaderboard tbody').innerHTML = "";

        for (var i = 0; i < ordered.length; i++) {
            if(data[i].biscuit_name != "") { 
                const biscuitItem = document.createElement('tr');
                biscuitItem.classList.add('biscuit-item');
                biscuitItem.innerHTML =
                `
                    <td class="bl-num">${i+1}</td>
                    <td class="bl-biscuit" data-insta="${ordered[i].insta}"><span class="bl-brand">${ordered[i].brand}</span> <span class="bl-biscuit-name">${ordered[i].biscuit_name}</span><span class="bl-review">review</span></td>
                    <td class="bl-taste"><span class="bl-emoji">🤤</span> ${ordered[i].taste}</td>
                    <td class="bl-texture"><span class="bl-emoji">🍪</span> ${ordered[i].texture}</td>
                    <td class="bl-health"><span class="bl-emoji">🚑</span> ${ordered[i].health}</td>
                    <td class="bl-total"><span class="bl-emoji">📈</span> ${ordered[i].overall_perc}</td>
                `;

                document.querySelector('.biscuit-leaderboard tbody').appendChild(biscuitItem);

                document.querySelector('.loader').classList.remove('active');
                
            }
        }
    }

    // Active Class for table headers
    // ---------------------------------------------------------------------
    function setOrderActive(el) {
        [...el.parentElement.children].forEach(sib => sib.classList.remove('order-active'));
        el.classList.add('order-active');
    }

    // Instagram modal
    // ---------------------------------------------------------------------
    function showInsta(e) {
        document.querySelector('body').classList.add('fixed');
        document.querySelector('.insta-modal').classList.add('active');
        document.querySelector('.modal-close').classList.add('active');
        document.querySelector('.insta-modal .loader').classList.add('active');

        if(e.target.parentElement.classList.contains('biscuit-item')) {
            // <tr> is the immediate parent so only need to go up one level
            var insta = e.target.parentElement.children[1].dataset.insta
        } else {
            // <tr> is the grandparent so need to go up two levels
            var insta = e.target.parentElement.parentElement.children[1].dataset.insta
        }

        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.instagram.com/oembed/?url='+insta+'&amp;maxwidth=450&amp;hidecaption=true&amp;omitscript=false', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;
                var resp = JSON.parse(resp);
                var respHTML = resp.html;
                document.querySelector('.insta-modal .ins-post').innerHTML = respHTML;
                document.querySelector('.insta-modal .ins-review').innerHTML = resp.title;
                window.instgrm.Embeds.process();
            } else {
                // We reached our target server, but it returned an error
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
        };

        request.send();
    }

    // Get all table headers (<th>s) in the biscuit leaderboard
    const tableHeaders = document.querySelectorAll('.biscuit-leaderboard th');

    // Sort table when <th>s are clicked
    tableHeaders.forEach(th => th.addEventListener('click', sortTable));

    // Add/remove active class when <th>s are clicked
    tableHeaders.forEach(el => el.addEventListener('click', e => setOrderActive(el)));

    // Show insta modal when the <tbody> section is clicked
    // We can then pass through the event, and use event delegation to determine which <tr> was clicked
    document.querySelector('.bl-tbody').addEventListener('click', showInsta);

    // Class management when modal is closed (removing active classes etc.)
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.querySelector('.insta-modal').classList.remove('active');
        document.querySelector('.insta-modal .ins-post').innerHTML = "<div class='loader'></div>";
        document.querySelector('.insta-modal .ins-review').innerHTML = "";
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('.modal-close').classList.remove('active');
        document.querySelector('.loader').classList.remove('active');
    });

    // On initial page load, order by total score and build the table
    const ordered = data.sort((a, b) => a.overall_perc < b.overall_perc ? 1 : -1);
    buildTable(ordered);


    // Register service worker
    if('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('service-worker.js');
            console.log('Service worker registered!');
        } catch (error) {
            console.log('Service worker failed');
        }
    }
}
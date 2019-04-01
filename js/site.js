function init() {
    Tabletop.init( { key: '1pt_A3Y9SOAcA-s4LIFDyxtyo1NvjM0gnQ9R3Jnmlwws',
    callback: showInfo,
    simpleSheet: true } )
}

function showInfo(data, tabletop) {

    function sortTable(e) {

        const orderby = e.target.dataset.orderby;

        const ordered = data.sort((a, b) => a[orderby] < b[orderby] ? 1 : -1);

        buildTable(ordered);
    }

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

    function setOrderActive(el) {
        [...el.parentElement.children].forEach(sib => sib.classList.remove('order-active'));
        el.classList.add('order-active');
    }

    function showInsta(e) {
        document.querySelector('body').classList.add('fixed');
        document.querySelector('.insta-modal').classList.add('active');
        document.querySelector('.modal-close').classList.add('active');
        document.querySelector('.insta-modal .loader').classList.add('active');

        if(e.target.parentElement.classList.contains('biscuit-item')) {
            var insta = e.target.parentElement.children[1].dataset.insta
        } else {
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

    const tableHeaders = document.querySelectorAll('.biscuit-leaderboard th');
    tableHeaders.forEach(th => th.addEventListener('click', sortTable));
    tableHeaders.forEach(el => el.addEventListener('click', e => setOrderActive(el)));

    document.querySelector('.bl-tbody').addEventListener('click', showInsta);

    document.querySelector('.modal-close').addEventListener('click', function() {
        document.querySelector('.insta-modal').classList.remove('active');
        document.querySelector('.insta-modal .ins-post').innerHTML = "<div class='loader'></div>";
        document.querySelector('.insta-modal .ins-review').innerHTML = "";
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('.modal-close').classList.remove('active');
        document.querySelector('.loader').classList.remove('active');
    });

    const ordered = data.sort((a, b) => a.overall_perc < b.overall_perc ? 1 : -1);
    buildTable(ordered);
}

window.addEventListener('DOMContentLoaded', init);
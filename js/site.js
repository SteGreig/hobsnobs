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
                biscuitItem.innerHTML =
                `
                    <td class="bl-num">${i+1}</td>
                    <td class="bl-biscuit"><span class="bl-brand">${ordered[i].brand}</span> <span class="bl-biscuit-name">${ordered[i].biscuit_name}</span></td>
                    <td class="bl-taste"><span class="bl-emoji">🤤</span> ${ordered[i].taste}</td>
                    <td class="bl-texture"><span class="bl-emoji">🍪</span> ${ordered[i].texture}</td>
                    <td class="bl-health"><span class="bl-emoji">🚑</span> ${ordered[i].health}</td>
                    <td class="bl-total"><span class="bl-emoji">📈</span> ${ordered[i].overall_perc}</td>
                `;

                document.querySelector('.biscuit-leaderboard tbody').appendChild(biscuitItem);
                
            }
        }
    }

    function setOrderActive(el) {
        [...el.parentElement.children].forEach(sib => sib.classList.remove('order-active'));
        el.classList.add('order-active');
    }

    const tableHeaders = document.querySelectorAll('.biscuit-leaderboard th');
    tableHeaders.forEach(th => th.addEventListener('click', sortTable));
    tableHeaders.forEach(el => el.addEventListener('click', e => setOrderActive(el)))

    const ordered = data.sort((a, b) => a.overall_perc < b.overall_perc ? 1 : -1);
    buildTable(ordered);
}

window.addEventListener('DOMContentLoaded', init);
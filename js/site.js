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
                    <td class="bl-taste">🤤 ${ordered[i].taste}</td>
                    <td class="bl-texture">🍪 ${ordered[i].texture}</td>
                    <td class="bl-health">🚑 ${ordered[i].health}</td>
                    <td class="bl-total">📈 ${ordered[i].overall_perc}</td>
                `;

                document.querySelector('.biscuit-leaderboard tbody').appendChild(biscuitItem);
            }
        }
    }

    const tableHeaders = document.querySelectorAll('.biscuit-leaderboard th');
    tableHeaders.forEach(th => th.addEventListener('click', sortTable));

    const ordered = data.sort((a, b) => a.overall_perc < b.overall_perc ? 1 : -1);
    buildTable(ordered);
}

window.addEventListener('DOMContentLoaded', init);
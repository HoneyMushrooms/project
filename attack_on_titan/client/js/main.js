async function getButton() {
    const response = await fetch('http://localhost:5000/video');
    const videoInfo = await response.json();
    
    const Element = document.getElementById('text');
    
    for (let i = videoInfo.length - 1; i >= 0; i--) {
        const e = videoInfo[i];

        const link = `<a class="button" href="watch.html?episode=${e.episode}&season=${e.season}&name=${e.fileName}">${e.episode} серия</a>`;
        Element.insertAdjacentHTML('afterend', link); 
        if(e.episode === 1) {
            const header = `<h2>${e.season} сезон</h2>`;
            const marginBottom = `<div class="content"></div>`;
            Element.insertAdjacentHTML('afterend', header);
            Element.insertAdjacentHTML('afterend', '<hr>');
            Element.insertAdjacentHTML('afterend', marginBottom);
        }
    };

}

getButton();
const params = new URLSearchParams(window.location.search);

const season = params.get('season');
const episode = params.get('episode');
const name = params.get('name');

const Watcher = document.getElementById('watcher');

async function prevAndNext () {
    const response = await fetch(`http://localhost:5000/video?season=${season}&episode=${episode}`);
    const data = await response.json();
    const { prev, next } = data;
    let prevLink, nextLink;

    const videoElement = document.getElementById("links");

    if(next && next?.season != season) {
        nextLink = `<a class="button right" href="watch.html?episode=${next.episode}&season=${next.season}&name=${next.fileName}">${next.season} сезон (${next.episode} серия)</a>`;
        videoElement.insertAdjacentHTML('afterbegin', nextLink);
    } else if(next) {
        nextLink = `<a class="button right" href="watch.html?episode=${next.episode}&season=${next.season}&name=${next.fileName}">${next.episode} серия</a>`;
        videoElement.insertAdjacentHTML('afterbegin', nextLink);
    }
    videoElement.insertAdjacentHTML('afterbegin', `<a class="button center" href="index.html">Список всех серии</a>`);
    if(prev && prev?.season != season) {
        prevLink = `<a class="button left" href="watch.html?episode=${prev.episode}&season=${prev.season}&name=${prev.fileName}">${prev.season} сезон (${prev.episode} серия)</a>`;
        videoElement.insertAdjacentHTML('afterbegin', prevLink);
    } else if(prev) {
        prevLink = `<a class="button left" href="watch.html?episode=${prev.episode}&season=${prev.season}&name=${prev.fileName}">${prev.episode} серия</a>`;
        videoElement.insertAdjacentHTML('afterbegin', prevLink);
    }
} 

prevAndNext()

Watcher.insertAdjacentHTML('afterbegin', `<video src="http://localhost:5000/video/${name}" controls></video>`);
Watcher.insertAdjacentHTML('afterbegin', `<hr>`);
Watcher.insertAdjacentHTML('afterbegin', `<h2>Атака титанов ${season} сезон ${episode} серия</h2>`);

Watcher.insertAdjacentHTML('afterend', `<div class="content"></div>`);
Watcher.insertAdjacentHTML('afterend', `<div class="content"></div>`);

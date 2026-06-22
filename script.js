// fortunes and UI
const fortunes = [
    "Jdu do pekla každý večer... jen abych si odložil klobouk. 😂",
    "Proč šel programátor do lesa? Potřeboval více 'roots' v životě. 🌲",
    "Když život zavře dveře, otevři je znovu. Někdo tam možná nechal pizzu. 🍕",
    "Jak se říká netrpělivému klavíristovi? Tempo-ram! 🎹",
    "Můj telefon mi říká, že mám příliš mnoho nabíječek. Řekl jsem mu, ať to vyřeší sám. 📱",
    "Co má pekelná kočka nejraději? Tropickou postel z uhlí. 😈",
    "Proč kachny neumějí řídit? Protože by pořád troubily 'quack'! 🦆",
    "Moje peněženka a já máme dohodu: já ji nenaplňuju, ona mě nepřipomíná. 💸",
    "Včera jsem zkusil být dospělý. Nevyšlo to, vrátím se zítra. 🛋️",
    "Jaký je rozdíl mezi hipsterem a entomologem? Jeden miluje mravence, druhý je jen dřív než ostatní. 🐜",
    "Řekl jsem kávě, že ji miluju. Ona mě aspoň pohnula z postele. ☕",
    "Proč strašidla ráda chodí do kuchyně? Protože tam jsou dobré skříňky. 👻",
    "Jeden vtip: dneska nepřijde. Počkej na zítra. ⏳",
    "Můj mozek je jako internet — někdy se prostě zasekne na načítání smyslu. 🌐",
    "Proč ryby nevědí hrát karty? Protože žijí v moři blefu. 🐟",
    "Kdybych měl korunu za každý vtip o práci... Tak bych pořád dělal vtipy zadarmo. 👑",
    "Nikdy nevěřte atomům. Všechno si vymýšlejí. ⚛️",
    "Jak se jmenuje kočka v pekle? Prostě domácí mazlíček páně. 😼🔥",
    "Proč se strašáci stávají úspěšnými? Mají spoustu pole—úspěchů. 🌾",
    "Smích je nejlepší lék — pokud neumíš létat, alespoň se budeš cítit lehčeji. 😄"
];

function getCatFortune() {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const fortune = fortunes[randomIndex];
    
    const fortuneElement = document.getElementById('fortune');
    fortuneElement.classList.remove('fortune-empty');
    fortuneElement.textContent = fortune;

    // Animace
    fortuneElement.style.animation = 'none';
    setTimeout(() => {
        fortuneElement.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

// 3D viewer upload handlers
const modelInput = document.getElementById('modelFile');
const imageInput = document.getElementById('imageFile');
const viewer = document.getElementById('viewer');
const resetBtn = document.getElementById('resetViewer');

modelInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    viewer.src = url;
    // revoke objectURL after model loads
    viewer.addEventListener('load', () => { URL.revokeObjectURL(url); }, { once: true });
});

imageInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    viewer.poster = url; // set image as poster/fallback
});

resetBtn.addEventListener('click', () => {
    viewer.src = 'models/devil.glb';
    viewer.poster = '';
});

// expose click area for custom labels
document.querySelectorAll('.uploader input').forEach(input => {
    const parent = input.parentElement;
    parent.addEventListener('click', () => input.click());
});

// fallback poster SVG generator
function makeFallbackPoster() {
    const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
            <rect width='100%' height='100%' fill='#080000' />
            <g fill='none' stroke='#ff001f' stroke-width='6' opacity='0.9'>
                <circle cx='400' cy='220' r='160' />
                <path d='M320 180 L400 60 L480 180' />
                <path d='M280 300 L520 140' />
                <path d='M280 140 L520 300' />
            </g>
            <text x='400' y='520' font-size='28' font-family='Orbitron,Arial' fill='#ff9bb3' text-anchor='middle'>Pekelný model chybí — nahraj .glb</text>
        </svg>`;
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
}

const viewerMessage = document.getElementById('viewerMessage');

// Check if default model exists; if not use poster fallback
(function ensureModel() {
    const defaultUrl = 'models/devil.glb';
    fetch(defaultUrl, { method: 'HEAD' }).then(res => {
        if (!res.ok) {
            const posterUrl = makeFallbackPoster();
            viewer.poster = posterUrl;
            viewerMessage.textContent = 'Výchozí 3D model nebyl nalezen. Nahraj vlastní .glb nebo obrázek.';
        } else {
            // set src explicitly so model-viewer loads it
            viewer.src = defaultUrl;
            viewerMessage.textContent = '';
        }
    }).catch(err => {
        // likely file:// or blocked; fallback to poster
        const posterUrl = makeFallbackPoster();
        viewer.poster = posterUrl;
        viewerMessage.textContent = 'Nelze načíst výchozí model (místní soubor). Nahraj vlastní .glb nebo obrázek.';
    });
})();

// handle model-viewer load/error
viewer.addEventListener('error', (e) => {
    viewerMessage.textContent = 'Chyba při načítání 3D modelu. Nahraj jiný .glb nebo obrázek.';
    if (!viewer.poster) viewer.poster = makeFallbackPoster();
});
viewer.addEventListener('load', (e) => {
    viewerMessage.textContent = '';
});

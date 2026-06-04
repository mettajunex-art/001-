// --- 故事數據 ---
const storyData = {
    start: {
        text: "陽光透過百葉窗，圖書館裡瀰漫著舊書與咖啡的香氣。你在書架間穿梭，眼前出現了兩個感興趣的區域...",
        choices: [
            { text: "前往「經典文學區」", nextNode: "literature" },
            { text: "前往「藝術與設計區」", nextNode: "art" }
        ],
        progress: 20
    },
    literature: {
        text: "你在這裡遇到了一個穿著校服的女孩，她正踮起腳尖試圖拿到那一本厚重的《夏目漱石全集》。看起來她有些吃力。",
        choices: [
            { text: "幫她把書拿下來", nextNode: "help_literature" },
            { text: "在旁邊默默觀察，等待機會", nextNode: "wait_literature" }
        ],
        progress: 40
    },
    art: {
        text: "在靜謐的角落，你看到一名男孩專注地對著名畫集進行速寫。他的筆觸非常細膩，陽光剛好落在他專注的側臉上。",
        choices: [
            { text: "鼓起勇氣湊過去看看", nextNode: "look_sketch" },
            { text: "也拿出筆，在不遠處開始畫畫", nextNode: "draw_nearby" }
        ],
        progress: 40
    },
    help_literature: {
        text: "「謝謝你！」她接過書，臉上露出如夏日微風般燦爛的笑容。「這本書對我很重要，真的很感謝。」她向你發出了邀請。",
        choices: [
            { text: "陪她在圖書館一起閱讀", nextNode: "ending_1" },
            { text: "禮貌點頭，然後轉身離開", nextNode: "ending_2" }
        ],
        progress: 70
    },
    wait_literature: {
        text: "她在嘗試幾次後終於拿到了書，轉身時注意到了你的視線，這讓氣氛突然變得有些尷尬。",
        choices: [
            { text: "跟她聊聊關於這本書的事", nextNode: "ending_1" },
            { text: "低頭假裝在看別的書", nextNode: "ending_2" }
        ],
        progress: 70
    },
    look_sketch: {
        text: "他注意到你，抬起頭對你微笑。他在速寫本上勾勒出一個優美的輪廓，竟然隱約有點像你。",
        choices: [
            { text: "讚美他的畫作", nextNode: "ending_3" },
            { text: "詢問他是否經常來這裡", nextNode: "ending_1" }
        ],
        progress: 70
    },
    draw_nearby: {
        text: "你們在沈默中共享了半小時的創作時光。收拾東西時，他主動走過來，遞給你一張剛畫好的紙片。",
        choices: [
            { text: "接過紙片，並留下聯絡方式", nextNode: "ending_3" },
            { text: "單純對他點頭致意", nextNode: "ending_2" }
        ],
        progress: 70
    },
    // --- 結局 ---
    ending_1: {
        title: "《校園戀曲：序章》",
        desc: "在這個夏日的午後，你們聊得很投緣。雖然圖書館即將關門，但你們心裡都知道，這只是故事的開始。",
        isEnding: true
    },
    ending_2: {
        title: "《擦肩而過的友人》",
        desc: "那一刻的交會就像夏日的午後雷雨，來得快也去得快。雖然在那之後沒再見面，但在記憶裡永遠留下了那抹陽光。",
        isEnding: true
    },
    ending_3: {
        title: "《夏日的特別約定》",
        desc: "你們發現了彼此心靈契合的瞬間。夕陽下，你們約好明天同一時間，還在這個角落相見。",
        isEnding: true
    }
};

// --- 狀態管理 ---
let currentNode = "start";

const screens = {
    start: document.getElementById('start-screen'),
    story: document.getElementById('story-screen'),
    end: document.getElementById('end-screen')
};

const dom = {
    storyText: document.getElementById('story-text'),
    choicesContainer: document.getElementById('choices-container'),
    progressFill: document.getElementById('progress-fill'),
    endTitle: document.getElementById('end-title'),
    endDesc: document.getElementById('end-desc'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn')
};

// --- 初始化 ---
function init() {
    dom.startBtn.addEventListener('click', () => switchScreen('story'));
    dom.restartBtn.addEventListener('click', restartStory);
    updateStoryNode("start");
    startCanvasAnimation();
}

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function updateStoryNode(nodeKey) {
    const node = storyData[nodeKey];
    
    if (node.isEnding) {
        showEnding(node);
        return;
    }

    dom.storyText.innerText = node.text;
    dom.choicesContainer.innerHTML = "";
    dom.progressFill.style.width = `${node.progress}%`;

    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice.text;
        btn.className = "choice-btn";
        btn.onclick = () => updateStoryNode(choice.nextNode);
        dom.choicesContainer.appendChild(btn);
    });
}

function showEnding(ending) {
    dom.endTitle.innerText = ending.title;
    dom.endDesc.innerText = ending.desc;
    switchScreen('end');
}

function restartStory() {
    currentNode = "start";
    updateStoryNode("start");
    switchScreen('start');
}

// --- Canvas 動態背景 (落櫻/氣泡效果) ---
function startCanvasAnimation() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.angle = Math.random() * Math.PI * 2;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.angle) * 0.5;
            this.angle += 0.02;
            if (this.y > height) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 182, 193, ${this.alpha})`; // 粉嫩色
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

window.onload = init;

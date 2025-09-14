// オクターブ選択のON/OFF
function toggleOctave(oct) {
    const o = Number(oct);
    if (state.octaveFilter.includes(o)) {
        state.octaveFilter = state.octaveFilter.filter(x => x !== o);
    } else {
        state.octaveFilter = [...state.octaveFilter, o];
    }
    renderLevelMenu();
}

// 半音含めるON/OFF
function toggleSemitone() {
    state.includeSemitone = !state.includeSemitone;
    renderLevelMenu();
}
// 指番号を黒丸・白丸数字で表示する関数
function renderFingering(fingering, instrument) {
    // トランペット: 1-3, チューバ: 1-5
    const maxNum = instrument === 'tuba' ? 5 : 3;
    // 入力例: "13", "1-2", "0" など
    // 黒丸: ❶❷❸❹❺, 白丸: ①②③④⑤
    const black = ['❶','❷','❸','❹','❺'];
    const white = ['①','②','③','④','⑤'];
    let html = '';
    const fstr = String(fingering).trim();
    if (fstr === '0') {
        // 0は全て白丸
        for (let i = 1; i <= maxNum; i++) {
            html += `<span style=\"font-size:2em;margin:0 2px;\">${white[i-1]}</span>`;
        }
        return html;
    }
    let pressed = [];
    if (fingering.includes('-')) {
        pressed = fingering.split('-');
    } else {
        // 1～5の数字のみ抽出
        pressed = fingering.split('').filter(c => ['1','2','3','4','5'].includes(c));
    }
    for (let i = 1; i <= maxNum; i++) {
        if (pressed.includes(i.toString())) {
            html += `<span style=\"font-size:2.4em;font-weight:bold;margin:0 2px;\">${black[i-1]}</span>`;
        } else {
            html += `<span style=\"font-size:2em;margin:0 2px;\">${white[i-1]}</span>`;
        }
    }
    return html;
}
// オートモード切替
function toggleAutoMode() {
    state.autoMode = !state.autoMode;
    // 現在の画面に応じて再描画
    if (state.instrument && state.level) {
        renderQuestion();
    } else {
        renderMenu();
    }
}
// 楽器・レベル・音符データ（仮データ）
// 各音ごとに実音・移調音・指番号を持つデータ例
const instruments = {
    trumpet: {
        name: 'トランペット',
        notes: [
            { note: 'Gb3', real: 'E3', fingering: '123' },
            { note: 'G3', real: 'F3', fingering: '13' },
            { note: 'Ab3', real: 'F#3', fingering: '23' },
            { note: 'A3', real: 'G3', fingering: '12' },
            { note: 'Bb3', real: 'Ab3', fingering: '1' },
            { note: 'B3', real: 'A3', fingering: '2' },
            { note: 'C4', real: 'Bb3', fingering: '0' },
            { note: 'Db4', real: 'B3', fingering: '123' },
            { note: 'D4', real: 'C4', fingering: '13' },
            { note: 'Eb4', real: 'C#4', fingering: '23' },
            { note: 'E4', real: 'D4', fingering: '12' },
            { note: 'F4', real: 'Eb4', fingering: '1' },
            { note: 'Gb4', real: 'E4', fingering: '2' },
            { note: 'G4', real: 'F4', fingering: '0' },
            { note: 'Ab4', real: 'F#4', fingering: '23' },
            { note: 'A4', real: 'G4', fingering: '12' },
            { note: 'Bb4', real: 'Ab4', fingering: '1' },
            { note: 'B4', real: 'A4', fingering: '2' },
            { note: 'C5', real: 'Bb4', fingering: '0' },
            { note: 'Db5', real: 'B4', fingering: '12' },
            { note: 'D5', real: 'C5', fingering: '1' },
            { note: 'Eb5', real: 'C#5', fingering: '2' },
            { note: 'E5', real: 'D5', fingering: '0' },
            { note: 'F5', real: 'Eb5', fingering: '1' },
            { note: 'Gb5', real: 'E5', fingering: '2' },
            { note: 'G5', real: 'F5', fingering: '0' },
            { note: 'Ab5', real: 'F#5', fingering: '23' },
            { note: 'A5', real: 'G5', fingering: '12' },
            { note: 'Bb5', real: 'Ab5', fingering: '1' },
            { note: 'B5', real: 'A5', fingering: '2' },
            { note: 'C6', real: 'Bb5', fingering: '0' },
        ],
    },
    tuba: {
        name: 'チューバ',
        notes: [
            { note: 'Eb1', real: 'Eb1', fingering: '1' },
            { note: 'E1', real: 'E1', fingering: '1-2' },
            { note: 'F1', real: 'F1', fingering: '1' },
            { note: 'Gb1', real: 'Gb1', fingering: '2-3' },
            { note: 'G1', real: 'G1', fingering: '0' },
            { note: 'Ab1', real: 'Ab1', fingering: '2-3' },
            { note: 'A1', real: 'A1', fingering: '1-2' },
            { note: 'Bb1', real: 'Bb1', fingering: '1' },
            { note: 'B1', real: 'B1', fingering: '2' },
            { note: 'Cb2', real: 'Cb2', fingering: '2-3' },
            { note: 'C2', real: 'C2', fingering: '0' },
            { note: 'Db2', real: 'Db2', fingering: '1-2' },
            { note: 'D2', real: 'D2', fingering: '1-2' },
            { note: 'Eb2', real: 'Eb2', fingering: '1' },
            { note: 'E2', real: 'E2', fingering: '1' },
        ],
    },
};
const levels = {
    easy: { label: '初級', seconds: 6 },
    normal: { label: '中級', seconds: 4 },
    hard: { label: '上級', seconds: 2 },
};

let state = {
    instrument: null,
    level: null,
    currentNote: null,
    showAnswer: false,
    timer: null,
    autoMode: false,
    octaveFilter: [], // 例: [3,4,5]
    includeSemitone: false,
};

function renderMenu() {
    const app = document.getElementById('app');

    app.innerHTML = `
        <h2 class="center">楽器練習アプリ</h2>
        <div class="select-group">
            <span class="label">楽器を選択</span>
            <button class="menu-btn" onclick="selectInstrument('trumpet')">トランペット</button>
            <button class="menu-btn" onclick="selectInstrument('tuba')">チューバ</button>
        </div>
        <div class="center" style="margin-top:16px;">
            <button class="action-btn" onclick="toggleAutoMode()">
                オートモード: ${state.autoMode ? 'ON' : 'OFF'}
            </button>
        </div>
    `;
}

// --- グローバル関数定義 ---
function selectInstrument(inst) {
    state.instrument = inst;
    renderLevelMenu();
}
function renderLevelMenu() {
    const app = document.getElementById('app');
    // 楽器の音域からオクターブ一覧を抽出
    const notes = instruments[state.instrument].notes;
    const octaves = Array.from(new Set(notes.map(n => n.note.match(/(\d)$/) ? n.note.match(/(\d)$/)[1] : null).filter(Boolean))).sort();
    app.innerHTML = `
        <h2 class="center">${instruments[state.instrument].name}</h2>
        <div class="select-group">
            <span class="label">レベルを選択</span>
            <button class="menu-btn" onclick="selectLevel('easy')">初級</button>
            <button class="menu-btn" onclick="selectLevel('normal')">中級</button>
            <button class="menu-btn" onclick="selectLevel('hard')">上級</button>
        </div>
        <div class="select-group">
            <span class="label">オクターブを選択（複数可）</span>
            ${octaves.map(o => `
                <label style='margin-right:8px;'>
                    <input type="checkbox" value="${o}" onchange="toggleOctave(${o})" ${state.octaveFilter.includes(Number(o)) ? 'checked' : ''}> ${o}
                </label>
            `).join('')}
        </div>
        <div class="select-group">
            <label><input type="checkbox" onchange="toggleSemitone()" ${state.includeSemitone ? 'checked' : ''}> 半音も含める</label>
        </div>
        <button class="action-btn" onclick="renderMenu()">戻る</button>
    `;
}
function selectLevel(lv) {
    state.level = lv;
    nextQuestion();
}
function nextQuestion() {
    state.showAnswer = false;
    let notes = instruments[state.instrument].notes;
    // オクターブフィルタ
    if (state.octaveFilter.length > 0) {
        notes = notes.filter(n => state.octaveFilter.includes(Number((n.note.match(/(\d)$/)||[])[1])));
    }
    // 半音フィルタ
    if (!state.includeSemitone) {
        notes = notes.filter(n => !n.note.match(/[b#]/));
    }
    if (notes.length === 0) {
        alert('選択条件に合う音がありません');
        renderLevelMenu();
        return;
    }
    const noteObj = notes[Math.floor(Math.random() * notes.length)];
    state.currentNote = noteObj;
    renderQuestion();
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
        state.showAnswer = true;
        renderQuestion();
        if (state.autoMode) {
            // 答え表示後さらに2秒待って自動で次へ
            state.timer = setTimeout(() => {
                nextQuestion();
            }, 2000);
        }
    }, levels[state.level].seconds * 1000);
}
function getNoteFileName(note) {
    // 例: F#4 → F#4, Bb4 → Bb4
    // ただし、#やb以外の記号は使わない
    return note.replace('♯', '#').replace('♭', 'b');
}
// 音名（C#4など）→カタカナ表記（ド#4など）変換関数
function toJapaneseNoteName(note) {
    // C, D, E, F, G, A, B
    const base = {
        'C': 'ド',
        'D': 'レ',
        'E': 'ミ',
        'F': 'ファ',
        'G': 'ソ',
        'A': 'ラ',
        'B': 'シ',
    };
    // シャープ/フラット対応
    const m = note.match(/^([A-G])([b#]?)(\d)$/);
    if (!m) return note;
    let kana = base[m[1]] || m[1];
    if (m[2] === '#') kana += '♯';
    if (m[2] === 'b') kana += '♭';
    return kana + m[3];
}
function renderQuestion() {
    const app = document.getElementById('app');
    const noteObj = state.currentNote;
    if (!noteObj) return;
    // 画像ファイル名は "assets/[楽器名]_[音名].png" で仮定
    const imgSrc = `assets/${state.instrument}_${getNoteFileName(noteObj.note)}.png`;
    let answerHtml = '';
    if (state.showAnswer) {
        answerHtml = `<div>
            <div style="margin-bottom:6px;">指番号：<span style="display:inline-block;vertical-align:middle;">${renderFingering(noteObj.fingering, state.instrument)}</span></div>
            <div>記譜音：${toJapaneseNoteName(noteObj.note)}</div>
            <div>実音：${noteObj.real}</div>
        </div>`;
    }
    app.innerHTML = `
        <h2 class="center">${instruments[state.instrument].name} (${levels[state.level].label})</h2>
        <div class="center">
            <img src="${imgSrc}" alt="${noteObj.note}" class="note-img" onerror="this.style.display='none'">
        </div>
        <div class="center" style="min-height:2em;">
            ${answerHtml}
        </div>
        <button class="action-btn" onclick="nextQuestion()">次へ</button>
        <button class="action-btn" onclick="endSession()">終わり</button>
        <div class="center" style="margin-top:16px;">
            <button class="action-btn" onclick="toggleAutoMode()">
                オートモード: ${state.autoMode ? 'ON' : 'OFF'}
            </button>
        </div>
    `;
}
// ...existing code...

function endSession() {
    if (state.timer) clearTimeout(state.timer);
    state.instrument = null;
    state.level = null;
    state.currentNote = null;
    state.showAnswer = false;
    renderMenu();
}

// グローバル公開
window.selectInstrument = selectInstrument;
window.selectLevel = selectLevel;
window.nextQuestion = nextQuestion;
window.endSession = endSession;
// 初期表示
window.onload = renderMenu;

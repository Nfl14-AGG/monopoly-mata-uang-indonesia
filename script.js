document.addEventListener('DOMContentLoaded', async () => {
    // === DOM ELEMENTS ===
    const setupContainer = document.getElementById('setup-container');
    const gameContainer = document.getElementById('game-container');
    const playerInputs = document.getElementById('player-inputs');
    const startGameBtn = document.getElementById('start-game-btn');
    const boardElement = document.getElementById('board');
    const playersElement = document.getElementById('players');
    const currentPlayerTurnElement = document.getElementById('current-player-turn');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const payFineBtn = document.getElementById('pay-fine-btn');
    const diceResultElement = document.getElementById('dice-result');
    const buyPropertyBtn = document.getElementById('buy-property-btn');
    const endTurnBtn = document.getElementById('end-turn-btn');
    const certificateModal = document.getElementById('certificate-modal');
    const certificateContent = document.getElementById('certificate-content');
    const closeBtn = certificateModal.querySelector('.close-btn');
    const rateInfoElement = document.getElementById('rate-info');
    const cardModal = document.getElementById('card-modal');
    const cardModalContent = cardModal.querySelector('.card-modal-content');
    const cardOkBtn = document.getElementById('card-ok-btn');
    const assetsPanel = document.getElementById('assets-panel');
    const playerAssetsList = document.getElementById('player-assets-list');
    const parkingModal = document.getElementById('parking-modal');
    const parkingSelect = document.getElementById('parking-destination-select');
    const parkingConfirmBtn = document.getElementById('parking-confirm-btn');
    const buildingRuleSelect = document.getElementById('building-rule-select'); // Elemen baru

    // === GAME STATE ===
    let players = [];
    let activePlayers = 0;
    let currentPlayerIndex = 0;
    const boardSize = 40;
    let board = [];
    let exchangeRate = 16200; // Nilai default jika API gagal
    let consecutiveDoubles = 0;
    const playerColors = ['#E53935', '#1E88E5', '#43A047', '#FFB300'];
    let buildingRule = 'complex'; // Variabel baru untuk aturan ('complex' atau 'direct')

    // === CARD DECKS ===
    let chanceDeck = [];
    let communityChestDeck = [];
    let chanceDiscard = [];
    let communityChestDiscard = [];

    // === DATA (USD) ===
    const JAIL_FINE_USD = 50;
    const PASS_START_USD = 200;
    const boardData = [{
        "name": "Start",
        "type": "start"
    }, {
        "name": "Monas",
        "type": "property",
        "price": 60,
        "rent": [2, 10, 30, 90, 160, 250],
        "color": "#a52a2a",
        "houseCost": 50,
        "mortgage": 30
    }, {
        "name": "Dana Umum",
        "type": "community-chest"
    }, {
        "name": "Kota Tua",
        "type": "property",
        "price": 60,
        "rent": [4, 20, 60, 180, 320, 450],
        "color": "#a52a2a",
        "houseCost": 50,
        "mortgage": 30
    }, {
        "name": "Pajak Jalan",
        "type": "tax",
        "amount": 200
    }, {
        "name": "Stasiun Gambir",
        "type": "station",
        "price": 200,
        "mortgage": 100
    }, {
        "name": "Gedung Sate",
        "type": "property",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "color": "#add8e6",
        "houseCost": 50,
        "mortgage": 50
    }, {
        "name": "Kesempatan",
        "type": "chance"
    }, {
        "name": "Cihampelas Walk",
        "type": "property",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "color": "#add8e6",
        "houseCost": 50,
        "mortgage": 50
    }, {
        "name": "Lawang Sewu",
        "type": "property",
        "price": 120,
        "rent": [8, 40, 100, 300, 450, 600],
        "color": "#add8e6",
        "houseCost": 50,
        "mortgage": 60
    }, {
        "name": "Penjara / Kunjungan",
        "type": "jail"
    }, {
        "name": "Candi Borobudur",
        "type": "property",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "color": "#ffc0cb",
        "houseCost": 100,
        "mortgage": 70
    }, {
        "name": "PLN",
        "type": "utility",
        "price": 150,
        "mortgage": 75
    }, {
        "name": "Malioboro",
        "type": "property",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "color": "#ffc0cb",
        "houseCost": 100,
        "mortgage": 70
    }, {
        "name": "Keraton Yogyakarta",
        "type": "property",
        "price": 160,
        "rent": [12, 60, 180, 500, 700, 900],
        "color": "#ffc0cb",
        "houseCost": 100,
        "mortgage": 80
    }, {
        "name": "Stasiun Tugu",
        "type": "station",
        "price": 200,
        "mortgage": 100
    }, {
        "name": "Jembatan Ampera",
        "type": "property",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "color": "#ffa500",
        "houseCost": 100,
        "mortgage": 90
    }, {
        "name": "Dana Umum",
        "type": "community-chest"
    }, {
        "name": "Pulau Kemaro",
        "type": "property",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "color": "#ffa500",
        "houseCost": 100,
        "mortgage": 90
    }, {
        "name": "Danau Toba",
        "type": "property",
        "price": 200,
        "rent": [16, 80, 220, 600, 800, 1000],
        "color": "#ffa500",
        "houseCost": 100,
        "mortgage": 100
    }, {
        "name": "Parkir Bebas",
        "type": "free-parking"
    }, {
        "name": "Tanah Lot",
        "type": "property",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "color": "#ff0000",
        "houseCost": 150,
        "mortgage": 110
    }, {
        "name": "Kesempatan",
        "type": "chance"
    }, {
        "name": "Pantai Kuta",
        "type": "property",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "color": "#ff0000",
        "houseCost": 150,
        "mortgage": 110
    }, {
        "name": "Ubud",
        "type": "property",
        "price": 240,
        "rent": [20, 100, 300, 750, 925, 1100],
        "color": "#ff0000",
        "houseCost": 150,
        "mortgage": 120
    }, {
        "name": "Stasiun Pasar Turi",
        "type": "station",
        "price": 200,
        "mortgage": 100
    }, {
        "name": "Raja Ampat",
        "type": "property",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "color": "#ffff00",
        "houseCost": 150,
        "mortgage": 130
    }, {
        "name": "Pulau Padar",
        "type": "property",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "color": "#ffff00",
        "houseCost": 150,
        "mortgage": 130
    }, {
        "name": "PDAM",
        "type": "utility",
        "price": 150,
        "mortgage": 75
    }, {
        "name": "Taman Nasional Komodo",
        "type": "property",
        "price": 280,
        "rent": [24, 120, 360, 850, 1025, 1200],
        "color": "#ffff00",
        "houseCost": 150,
        "mortgage": 140
    }, {
        "name": "Masuk Penjara",
        "type": "go-to-jail"
    }, {
        "name": "Bunaken",
        "type": "property",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "color": "#008000",
        "houseCost": 200,
        "mortgage": 150
    }, {
        "name": "Wakatobi",
        "type": "property",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "color": "#008000",
        "houseCost": 200,
        "mortgage": 150
    }, {
        "name": "Dana Umum",
        "type": "community-chest"
    }, {
        "name": "Tana Toraja",
        "type": "property",
        "price": 320,
        "rent": [28, 150, 450, 1000, 1200, 1400],
        "color": "#008000",
        "houseCost": 200,
        "mortgage": 160
    }, {
        "name": "Stasiun Balapan",
        "type": "station",
        "price": 200,
        "mortgage": 100
    }, {
        "name": "Kesempatan",
        "type": "chance"
    }, {
        "name": "Bundaran HI",
        "type": "property",
        "price": 350,
        "rent": [35, 175, 500, 1100, 1300, 1500],
        "color": "#0000ff",
        "houseCost": 200,
        "mortgage": 175
    }, {
        "name": "Pajak Istimewa",
        "type": "tax",
        "amount": 100
    }, {
        "name": "GBK",
        "type": "property",
        "price": 400,
        "rent": [50, 200, 600, 1400, 1700, 2000],
        "color": "#0000ff",
        "houseCost": 200,
        "mortgage": 200
    }];

    const masterChanceCards = [{
        description: "Maju ke Start (Ambil Gaji)",
        action: "move",
        position: 0
    }, {
        description: "Masuk Penjara!",
        action: "go_to_jail"
    }, {
        description: "Maju ke Stasiun Gambir. Jika melewati Start, ambil gaji.",
        action: "move",
        position: 5
    }, {
        description: "Maju ke GBK.",
        action: "move",
        position: 39
    }, {
        description: "Maju 3 langkah.",
        action: "move_steps",
        steps: 3
    }, {
        description: "Mundur 3 langkah.",
        action: "move_steps",
        steps: -3
    }, {
        description: "Pergi ke Parkir Bebas.",
        action: "move",
        position: 20
    }, {
        description: "Bank membayar Anda $50.",
        action: "money",
        amount: 50
    }, {
        description: "Bayar denda ngebut $15.",
        action: "money",
        amount: -15
    }, {
        description: "Bayar perbaikan properti: $25 per rumah, $100 per hotel.",
        action: "repairs",
        house: 25,
        hotel: 100
    }, {
        description: "Anda terpilih jadi ketua. Bayar setiap pemain $50.",
        action: "pay_players",
        amount: 50
    }, {
        description: "Libur 1 putaran.",
        action: "skip_turns",
        turns: 1
    }];
    const masterCommunityChestCards = [{
        description: "Kesalahan bank, Anda dapat $200.",
        action: "money",
        amount: 200
    }, {
        description: "Masuk Penjara!",
        action: "go_to_jail"
    }, {
        description: "Bayar tagihan dokter $50.",
        action: "money",
        amount: -50
    }, {
        description: "Dari penjualan saham, Anda dapat $50.",
        action: "money",
        amount: 50
    }, {
        description: "Dapat $25 dari hadiah kontes.",
        action: "money",
        amount: 25
    }, {
        description: "Bayar uang sekolah $50.",
        action: "money",
        amount: -50
    }, {
        description: "Terima $100 warisan.",
        action: "money",
        amount: 100
    }, {
        description: "Dapat $10 dari setiap pemain untuk ulang tahun Anda.",
        action: "collect_from_players",
        amount: 10
    }, {
        description: "Bayar denda ke Bank $100.",
        action: "money",
        amount: -100
    }, {
        description: "Maju ke Start (Ambil Gaji)",
        action: "move",
        position: 0
    }, {
        description: "Pengembalian pajak, dapat $20.",
        action: "money",
        amount: 20
    }];

    // === FUNCTIONS ===

    // --- ASSET & CARD FUNCTIONS ---
    function updateAssetsPanel() {
        const player = players[currentPlayerIndex];
        if (!player || player.isBankrupt || player.properties.length === 0) {
            assetsPanel.style.display = 'none';
            return;
        }
        assetsPanel.style.display = 'block';
        playerAssetsList.innerHTML = '';
        player.properties.sort((a, b) => a - b).forEach(tileIndex => {
            const tile = board[tileIndex];
            const assetDiv = document.createElement('div');
            assetDiv.className = 'asset-item';
            let houseInfo = '';
            if (tile.houses > 0) {
                houseInfo = tile.houses === 5 ? ' (1 Hotel)' : ` (${tile.houses} Rumah)`;
            }
            assetDiv.innerHTML = `
                <div class="asset-color-bar" style="background-color: ${tile.color || '#888'}"></div>
                <div class="asset-info">
                    <strong>${tile.name}</strong>
                    <span>${houseInfo}</span>
                </div>
            `;
            playerAssetsList.appendChild(assetDiv);
        });
    }

    function shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function setupDecks() {
        chanceDeck = [...masterChanceCards];
        communityChestDeck = [...masterCommunityChestCards];
        shuffle(chanceDeck);
        shuffle(communityChestDeck);
        chanceDiscard = [];
        communityChestDiscard = [];
    }

    function drawCard(deckType) {
        let deck, discard;
        if (deckType === 'chance') {
            deck = chanceDeck;
            discard = chanceDiscard;
        } else {
            deck = communityChestDeck;
            discard = communityChestDiscard;
        }
        if (deck.length === 0) {
            showToast(`Tumpukan kartu ${deckType} habis. Mengocok ulang...`);
            deck.push(...discard);
            discard.length = 0;
            shuffle(deck);
        }
        const card = deck.pop();
        discard.push(card);
        return card;
    }

    function showCardModal(card, deckType) {
        cardModalContent.className = 'card-modal-content';
        const titleEl = cardModalContent.querySelector('.card-title');
        const iconEl = cardModalContent.querySelector('.card-icon');
        const descEl = cardModalContent.querySelector('.card-description');

        if (deckType === 'chance') {
            cardModalContent.classList.add('chance');
            titleEl.textContent = 'Kesempatan';
            iconEl.innerHTML = '<i class="fa-solid fa-question"></i>';
        } else {
            cardModalContent.classList.add('community-chest');
            titleEl.textContent = 'Dana Umum';
            iconEl.innerHTML = '<i class="fa-solid fa-box-archive"></i>';
        }

        descEl.textContent = card.description;
        cardModal.classList.add('show');
        cardOkBtn.onclick = () => {
            cardModal.classList.remove('show');
            executeCardAction(card);
        };
    }

    function executeCardAction(card) {
        const player = players[currentPlayerIndex];
        let endsTurnNow = true;

        switch (card.action) {
            case 'money':
                if (card.amount > 0) {
                    showToast(`${player.name} dapat ${formatRupiah(card.amount)}`, 'success');
                } else {
                    showToast(`${player.name} harus bayar ${formatRupiah(Math.abs(card.amount))}`, 'error');
                }
                player.money += card.amount;
                break;
            case 'move':
                movePlayerTo(card.position, card.position < player.position);
                endsTurnNow = false;
                break;
            case 'move_steps':
                movePlayer(card.steps);
                endsTurnNow = false;
                break;
            case 'go_to_jail':
                showToast(`${player.name} masuk penjara!`, 'error');
                goToJail(player);
                break;
            case 'pay_players':
                showToast(`Anda membayar ${formatRupiah(card.amount)} kepada setiap pemain.`, 'error');
                players.forEach(p => {
                    if (p !== player && !p.isBankrupt) {
                        payMoney(player, card.amount, p);
                    }
                });
                break;
            case 'collect_from_players':
                showToast(`Anda menerima ${formatRupiah(card.amount)} dari setiap pemain.`, 'success');
                players.forEach(p => {
                    if (p !== player && !p.isBankrupt) {
                        payMoney(p, card.amount, player);
                    }
                });
                break;
            case 'skip_turns':
                player.skipTurns = card.turns;
                showToast(`${player.name} tidak main selama ${card.turns} putaran.`);
                break;
            case 'repairs':
                let cost = 0;
                player.properties.forEach(pIndex => {
                    const prop = board[pIndex];
                    if (prop.houses === 5) cost += card.hotel;
                    else cost += prop.houses * card.house;
                });
                if (cost > 0) {
                    showToast(`${player.name} harus bayar ${formatRupiah(cost)} untuk perbaikan.`, 'error');
                    payMoney(player, cost);
                } else {
                     showToast(`Anda tidak punya bangunan untuk diperbaiki.`, 'info');
                }
                break;
        }
        updatePlayerDisplay();
        if (endsTurnNow) {
            setTimeout(endTurn, 500);
        }
    }

    // --- UTILITY & HELPER FUNCTIONS ---
    function showToast(message, type = "info") {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        let icon = "fa-solid fa-circle-info";
        if (type === "success") icon = "fa-solid fa-check-circle";
        if (type === "error") icon = "fa-solid fa-times-circle";
        toast.innerHTML = `<i class="${icon}"></i> <p>${message}</p>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 100);
        setTimeout(() => {
            toast.classList.remove("show");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 4000);
    }
    
    // =======================================================
    // === FUNGSI PENGAMBILAN KURS (SUDAH CUKUP BAIK) ========
    // =======================================================
    async function fetchExchangeRate() {
        startGameBtn.disabled = true;
        startGameBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat Kurs...';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        try {
            const response = await fetch("https://open.er-api.com/v6/latest/USD", {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data dari API kurs (Status: ${response.status}).`);
            }
            
            const data = await response.json();

            if (data.result === 'success' && data.rates.IDR) {
                exchangeRate = data.rates.IDR;
                rateInfoElement.textContent = `Kurs: 1 USD = ${formatRupiah(1, exchangeRate, false)}`;
                showToast('Kurs mata uang berhasil dimuat!', 'success');
            } else {
                throw new Error("API merespons dengan status gagal atau format tidak sesuai.");
            }

        } catch (error) {
            console.error("Gagal mengambil kurs, menggunakan nilai default.", error);
            rateInfoElement.textContent = `Gagal memuat. Menggunakan 1 USD = ${formatRupiah(1, exchangeRate, false)}`;
            
            if (error.name === 'AbortError') {
                showToast('Gagal memuat kurs (timeout), nilai default digunakan.', 'error');
            } else {
                showToast('Gagal memuat kurs, nilai default digunakan.', 'error');
            }

        } finally {
            clearTimeout(timeoutId);
            startGameBtn.disabled = false;
            startGameBtn.innerHTML = '<i class="fa-solid fa-play"></i> Mulai Permainan';
        }
    }

    const formatRupiah = (amountInUSD, rate = exchangeRate, useSymbol = true) => {
        const prefix = useSymbol ? "Rp " : "";
        return prefix + (amountInUSD * rate).toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const payMoney = (fromPlayer, amount, toPlayer = null) => {
        if (fromPlayer.money >= amount) {
            fromPlayer.money -= amount;
            if (toPlayer) {
                toPlayer.money += amount;
            }
            return true;
        }
        handleBankruptcy(fromPlayer, toPlayer);
        return false;
    };

    const handleBankruptcy = (bankruptPlayer, creditor) => {
        showToast(`${bankruptPlayer.name} telah bangkrut!`, "error");
        if (creditor) {
            creditor.money += bankruptPlayer.money;
            bankruptPlayer.properties.forEach(propIndex => {
                const prop = board[propIndex];
                prop.owner = creditor.id;
                creditor.properties.push(propIndex);
                prop.element.style.borderColor = creditor.color;
            });
             showToast(`${creditor.name} menerima semua aset dari ${bankruptPlayer.name}.`);
        } else { // Bangkrut karena Bank
            bankruptPlayer.properties.forEach(index => {
                const tile = board[index];
                tile.owner = null;
                tile.houses = 0;
                tile.mortgaged = false;
                tile.element.style.borderColor = "#ccc";
                tile.element.classList.remove("mortgaged");
                updateBoard(); // Hapus rumah/hotel dari papan
            });
             showToast(`Semua aset ${bankruptPlayer.name} dikembalikan ke Bank.`);
        }
        
        bankruptPlayer.money = 0;
        bankruptPlayer.properties = [];
        bankruptPlayer.isBankrupt = true;
        activePlayers--;
        document.querySelector(`.player-display[data-player-id="${bankruptPlayer.id}"]`)?.classList.add('bankrupt');
        document.getElementById(`player-${bankruptPlayer.id}`)?.remove();
        
        checkForWinner();
    };

    const checkForWinner = () => {
        if (activePlayers <= 1) {
            const winner = players.find(p => !p.isBankrupt);
            if (winner) {
                showToast(`Permainan Selesai! Pemenangnya adalah ${winner.name}!`, "success");
                rollDiceBtn.disabled = true;
                endTurnBtn.style.display = "none";
            }
        }
    };

    // === SETUP & GAME FLOW ===
    function setupGame() {
        const playerNames = Array.from(playerInputs.querySelectorAll("input")).map(input => input.value.trim()).filter(Boolean);
        if (playerNames.length < 2 || playerNames.length > 4) {
            showToast("Permainan ini untuk 2 hingga 4 pemain.", "error");
            return;
        }
        
        // --- PERUBAHAN: BACA ATURAN YANG DIPILIH ---
        buildingRule = buildingRuleSelect.value;
        showToast(`Permainan dimulai dengan aturan: ${buildingRule === 'direct' ? 'Bisa Langsung Membangun' : 'Perlu 1 Komplek'}.`, 'info');
        // --- AKHIR PERUBAHAN ---

        players = playerNames.map((name, index) => ({
            id: index,
            name: name,
            money: 1500,
            position: 0,
            color: playerColors[index],
            properties: [],
            inJail: false,
            jailTurns: 0,
            isBankrupt: false,
            skipTurns: 0
        }));
        activePlayers = players.length;
        setupContainer.style.display = "none";
        gameContainer.style.display = "flex";
        startGame();
    }

    function startGame() {
        setupDecks();
        createBoard();
        createPlayerPieces();
        currentPlayerIndex = 0;
        updatePlayerTurnInfo();
        updatePlayerDisplay();
        updateBoardHighlight();
        updateAssetsPanel();
    }

    function endTurn() {
        buyPropertyBtn.style.display = "none";
        endTurnBtn.style.display = "none";
        
        const currentPlayer = players[currentPlayerIndex];
        
        if (isDoubleRoll) {
            isDoubleRoll = false; // Reset status double roll
            // Jangan ganti pemain jika dapat dobel
        } else {
            consecutiveDoubles = 0;
             if (currentPlayer && currentPlayer.skipTurns > 0) {
                currentPlayer.skipTurns--;
                showToast(`${currentPlayer.name} masih libur, sisa ${currentPlayer.skipTurns} putaran.`);
            }
            // Pindah ke pemain berikutnya
            do {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            } while (players[currentPlayerIndex].isBankrupt && activePlayers > 1);
        }
        
        rollDiceBtn.disabled = false;
        diceResultElement.textContent = "";

        updatePlayerTurnInfo();
        updatePlayerDisplay();
        updateBoardHighlight();
        updateAssetsPanel();
        checkForWinner();
    }

    // === BOARD & PLAYER UI ===
    function createBoard() {
        const gridPositions = [
            ...Array.from({ length: 11 }, (_, i) => [10, 10 - i]),
            ...Array.from({ length: 9 }, (_, i) => [9 - i, 0]),
            ...Array.from({ length: 11 }, (_, i) => [0, i]),
            ...Array.from({ length: 9 }, (_, i) => [i + 1, 10]),
        ];

        boardData.forEach((tileData, index) => {
            const tileElement = document.createElement("div");
            tileElement.className = "tile";
            tileElement.id = `tile-${index}`;
            const [row, col] = gridPositions[index];
            tileElement.style.gridRow = `${row + 1}`;
            tileElement.style.gridColumn = `${col + 1}`;

            if (["property", "station", "utility"].includes(tileData.type)) {
                tileElement.addEventListener("click", () => showCertificate(index));
            } else if (["start", "jail", "free-parking", "go-to-jail"].includes(tileData.type)) {
                tileElement.classList.add("corner");
            }

            let tileContent = `
                ${tileData.color ? `<div class="color-bar" style="background-color:${tileData.color};"></div>` : ""}
                <div class="name">${tileData.name}</div>
                <div class="houses-container"></div>
            `;

            if (tileData.type === 'station') {
                 tileContent += `<i class="fa-solid fa-train" style="font-size:24px; margin: 5px 0;"></i>`;
            } else if (tileData.type === 'utility') {
                 tileContent += `<i class="fa-solid fa-lightbulb" style="font-size:24px; margin: 5px 0;"></i>`;
            } else if (tileData.type === 'chance') {
                 tileContent += `<i class="fa-solid fa-question" style="font-size:24px; margin: 5px 0; color: var(--chance-color)"></i>`;
            } else if (tileData.type === 'community-chest') {
                 tileContent += `<i class="fa-solid fa-box-archive" style="font-size:24px; margin: 5px 0; color: var(--chest-color)"></i>`;
            }


            tileContent += `${tileData.price ? `<div class="price">${formatRupiah(tileData.price)}</div>` : ""}`;
            tileElement.innerHTML = tileContent;
            
            boardElement.appendChild(tileElement);
            board.push({ ...tileData,
                owner: null,
                houses: 0,
                mortgaged: false,
                element: tileElement
            });
        });
    }

    function createPlayerPieces() {
        players.forEach(player => {
            const piece = document.createElement("div");
            piece.id = `player-${player.id}`;
            piece.className = "player";
            piece.style.backgroundColor = player.color;
            board[0].element.appendChild(piece);
        });
    }

    function updatePlayerPositions() {
        players.forEach((player, index) => {
            if (player.isBankrupt) return;
            const piece = document.getElementById(`player-${player.id}`);
            const tileElement = board[player.position].element;
            
            // Logika untuk menumpuk pion jika berada di petak yang sama
            const playersOnSameTile = players.filter(p => p.position === player.position && !p.isBankrupt);
            const playerIndexOnTile = playersOnSameTile.findIndex(p => p.id === player.id);
            
            const xOffset = 5 + (playerIndexOnTile % 2) * 25;
            const yOffset = 5 + Math.floor(playerIndexOnTile / 2) * 25;

            piece.style.left = `${xOffset}px`;
            piece.style.top = `${yOffset}px`;
            
            tileElement.appendChild(piece);
        });
    }

    function updatePlayerDisplay() {
        playersElement.innerHTML = "";
        players.forEach((player) => {
            const display = document.createElement("div");
            display.className = "player-display";
            display.dataset.playerId = player.id; // Tambahkan data-id untuk identifikasi
            if (player.id === currentPlayerIndex) display.classList.add("active");
            if (player.isBankrupt) display.classList.add("bankrupt");

            const tile = board[player.position];
            const locationName = player.inJail ? "Di Penjara" : (tile && tile.name) || "...";
            const moneyStatus = player.isBankrupt ? "Bangkrut" : formatRupiah(player.money);

            display.innerHTML = `
                <div class="player-main-info">
                    <strong style="color:${player.color};">${player.name}</strong>
                    <span>${moneyStatus}</span>
                </div>
                <div class="player-location">
                    <i class="fa-solid fa-map-marker-alt"></i>
                    <span>${locationName}</span>
                </div>
            `;
            playersElement.appendChild(display);
        });
    }


    function updatePlayerTurnInfo() {
        const player = players[currentPlayerIndex];
        if (!player || player.isBankrupt) return;
        currentPlayerTurnElement.textContent = `Giliran: ${player.name}`;
        rollDiceBtn.disabled = player.inJail || player.skipTurns > 0;
        payFineBtn.style.display = player.inJail ? "block" : "none";
        if (player.inJail) {
            payFineBtn.textContent = `Bayar Denda (${formatRupiah(JAIL_FINE_USD)})`;
        }
        endTurnBtn.style.display = (player.inJail || player.skipTurns > 0) ? "block" : "none";
    }

    function updateBoardHighlight() {
        document.querySelectorAll(".tile.highlight-active").forEach(el => el.classList.remove("highlight-active"));
        const player = players[currentPlayerIndex];
        if (player && !player.isBankrupt) {
            board[player.position].element.classList.add("highlight-active");
        }
    }

    // === GAMEPLAY LOGIC ===
    let isDoubleRoll = false;

    function rollDice() {
        buyPropertyBtn.style.display = "none";
        rollDiceBtn.disabled = true;
        endTurnBtn.style.display = "none";

        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;
        isDoubleRoll = die1 === die2;
        diceResultElement.textContent = `Dadu: ${die1} + ${die2} = ${total}${isDoubleRoll ? " (Kembar!)" : ""}`;
        const player = players[currentPlayerIndex];

        if (player.inJail) {
            if (isDoubleRoll) {
                showToast(`${player.name} bebas dari penjara karena dadu kembar!`, "success");
                player.inJail = false;
                player.jailTurns = 0;
                updatePlayerTurnInfo();
                movePlayer(total); // Tetap bergerak setelah keluar penjara
            } else {
                player.jailTurns++;
                if (player.jailTurns >= 3) {
                    showToast("Kesempatan habis! Anda harus membayar denda.", "error");
                    if (payMoney(player, JAIL_FINE_USD)) {
                        showToast(`${player.name} berhasil membayar denda dan keluar dari penjara.`);
                        player.inJail = false;
                        player.jailTurns = 0;
                        updatePlayerTurnInfo();
                        movePlayer(total);
                    } else {
                        showToast("Uang tidak cukup untuk bayar denda. Anda tetap di penjara.", "error");
                        endTurn(); // Gagal bayar, giliran berakhir
                    }
                } else {
                    showToast(`Gagal dapat dadu kembar. Sisa ${3 - player.jailTurns} kesempatan.`);
                    setTimeout(endTurn, 1000);
                }
            }
        } else {
            if (isDoubleRoll) {
                consecutiveDoubles++;
            } else {
                consecutiveDoubles = 0;
            }

            if (consecutiveDoubles >= 3) {
                showToast(`${player.name} dapat dadu kembar 3x berturut-turut. Masuk penjara!`, "error");
                goToJail(player);
                setTimeout(endTurn, 1000);
            } else {
                movePlayer(total);
                if (isDoubleRoll) {
                    showToast("Dadu kembar! Anda berhak main lagi.");
                    rollDiceBtn.disabled = false; // Boleh kocok lagi
                } else {
                    endTurnBtn.style.display = "block"; // Munculkan tombol akhiri giliran
                }
            }
        }
    }

    function movePlayer(steps) {
        const player = players[currentPlayerIndex];
        const oldPosition = player.position;
        player.position = (player.position + steps) % boardSize;
        
        // Cek jika melewati Start
        if (!player.inJail && (player.position < oldPosition && steps > 0)) {
            showToast(`${player.name} melewati Start, dapat ${formatRupiah(PASS_START_USD)}`, "success");
            player.money += PASS_START_USD;
        }
        
        updatePlayerPositions();
        updateBoardHighlight();
        updatePlayerDisplay(); // Update display untuk menunjukkan lokasi baru
        
        setTimeout(() => handleTileLanding(player), 500);
    }

    function movePlayerTo(newPosition, passedGo = false) {
        const player = players[currentPlayerIndex];
        const oldPosition = player.position;

        if (passedGo || (!player.inJail && newPosition < oldPosition)) {
            showToast(`${player.name} melewati Start, dapat ${formatRupiah(PASS_START_USD)}`, "success");
            player.money += PASS_START_USD;
        }
        player.position = newPosition;

        updatePlayerPositions();
        updateBoardHighlight();
        updatePlayerDisplay();
        
        setTimeout(() => handleTileLanding(player), 500);
    }

    function handleTileLanding(player) {
        const tile = board[player.position];
        let endTurnButtonNeeded = !isDoubleRoll; // Tombol end turn hanya muncul jika bukan dobel

        switch (tile.type) {
            case "start":
                showToast(`${player.name} berhenti di Start.`);
                break;
            case "chance":
            case "community-chest":
                endTurnButtonNeeded = false; // Kartu akan menentukan kapan giliran berakhir
                const card = drawCard(tile.type);
                setTimeout(() => showCardModal(card, tile.type), 300);
                break;
            case "property":
            case "station":
            case "utility":
                if (tile.owner === null && player.money >= tile.price) {
                    buyPropertyBtn.style.display = "block";
                } else if (tile.owner !== null && tile.owner !== player.id) {
                    payRent(player, tile);
                }
                break;
            case "tax":
                showToast(`${player.name} membayar ${tile.name} sebesar ${formatRupiah(tile.amount)}`, "error");
                payMoney(player, tile.amount);
                break;
            case "go-to-jail":
                showToast(`${player.name} masuk penjara!`, 'error');
                goToJail(player);
                endTurnButtonNeeded = false; // Langsung akhiri giliran
                setTimeout(endTurn, 500);
                break;
            case "jail":
                if (!player.inJail) showToast(`${player.name} hanya berkunjung ke penjara.`);
                break;
            case "free-parking":
                showToast(`${player.name} mendarat di Parkir Bebas!`, 'success');
                openParkingModal();
                endTurnButtonNeeded = false; // Modal akan menangani akhir giliran
                break;
        }

        if (endTurnButtonNeeded) {
            endTurnBtn.style.display = "block";
        }
        updatePlayerDisplay();
    }

    function goToJail(player) {
        player.position = 10; // Posisi petak penjara
        player.inJail = true;
        player.jailTurns = 0;
        consecutiveDoubles = 0; // Reset dadu kembar beruntun
        isDoubleRoll = false; // Reset status lemparan dobel
        
        updatePlayerPositions();
        updatePlayerTurnInfo();
        updateBoardHighlight();
        updatePlayerDisplay();
    }
    
    function openParkingModal() {
        parkingSelect.innerHTML = ''; // Kosongkan pilihan lama
        board.forEach((tile, index) => {
            if (["property", "station", "utility"].includes(tile.type)) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${tile.name} (${formatRupiah(tile.price)})`;
                parkingSelect.appendChild(option);
            }
        });
        parkingModal.classList.add('show');
    }

    const buyProperty = () => {
        const player = players[currentPlayerIndex];
        const tile = board[player.position];
        if (payMoney(player, tile.price)) {
            tile.owner = player.id;
            player.properties.push(player.position);
            tile.element.style.borderColor = player.color; // Gunakan border color solid
            tile.element.style.borderWidth = '3px';
            showToast(`${player.name} berhasil membeli ${tile.name}`, "success");
            updatePlayerDisplay();
            updateAssetsPanel();
        }
        buyPropertyBtn.style.display = "none";
    };

    const payRent = (renter, tile) => {
        const owner = players.find(p => p.id === tile.owner);
        if (!owner || owner.isBankrupt || tile.mortgaged) return;
        
        let rentAmount = 0;
        if (tile.type === "property") {
            rentAmount = tile.rent[tile.houses];
            // Sewa ganda jika punya satu set warna & tidak ada rumah/hotel
            if (tile.houses === 0 && ownsAllInGroup(owner, tile.color)) {
                rentAmount *= 2;
                showToast("Sewa ganda karena pemilik menguasai semua properti warna ini!", "info");
            }
        } else if (tile.type === "station") {
            const stationCount = owner.properties.filter(pIndex => board[pIndex].type === "station").length;
            rentAmount = 25 * Math.pow(2, stationCount - 1);
        } else if (tile.type === "utility") {
            const diceRoll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
            const utilityCount = owner.properties.filter(pIndex => board[pIndex].type === "utility").length;
            diceResultElement.textContent += ` (Sewa Utilitas: ${diceRoll})`;
            rentAmount = diceRoll * (utilityCount === 1 ? 4 : 10);
        }

        if (rentAmount > 0) {
            showToast(`${renter.name} bayar sewa ke ${owner.name} sebesar ${formatRupiah(rentAmount)}`, 'error');
            payMoney(renter, rentAmount, owner);
            updatePlayerDisplay();
        }
    };

    const ownsAllInGroup = (player, color) => {
        const groupTiles = board.filter(tile => tile.color === color);
        return groupTiles.every(tile => tile.owner === player.id);
    };

    const showCertificate = (tileIndex) => {
        const tile = board[tileIndex];
        const owner = players.find(p => p.id === tile.owner);

        let content = `<div class="cert-header" style="background-color:${tile.color || "#888"};"><h2 style="margin:0;">${tile.name}</h2></div><table>`;
        if (tile.type === "property") {
            content += `<tr><td>Sewa Tanah Kosong</td><td>${formatRupiah(tile.rent[0])}</td></tr>
                        <tr><td colspan="2" style="text-align:center; font-style:italic; font-size: 0.9em;">Sewa menjadi ganda jika semua properti warna ini dimiliki</td></tr>
                        <tr><td>Dengan 1 Rumah</td><td>${formatRupiah(tile.rent[1])}</td></tr>
                        <tr><td>Dengan 2 Rumah</td><td>${formatRupiah(tile.rent[2])}</td></tr>
                        <tr><td>Dengan 3 Rumah</td><td>${formatRupiah(tile.rent[3])}</td></tr>
                        <tr><td>Dengan 4 Rumah</td><td>${formatRupiah(tile.rent[4])}</td></tr>
                        <tr><td>Dengan 1 HOTEL</td><td>${formatRupiah(tile.rent[5])}</td></tr>
                        <tr style="background:#f2f2f2"><td>Harga Membangun</td><td>${formatRupiah(tile.houseCost)}</td></tr>`;
        } else if (tile.type === "station") {
            content += `<tr><td>Jika punya 1 Stasiun</td><td>${formatRupiah(25)}</td></tr>
                        <tr><td>Jika punya 2 Stasiun</td><td>${formatRupiah(50)}</td></tr>
                        <tr><td>Jika punya 3 Stasiun</td><td>${formatRupiah(100)}</td></tr>
                        <tr><td>Jika punya 4 Stasiun</td><td>${formatRupiah(200)}</td></tr>`;
        } else if (tile.type === "utility") {
             content += `<tr><td colspan="2" style="text-align:center;">Jika punya 1 Utilitas, sewa 4x nilai dadu.</td></tr>
                         <tr><td colspan="2" style="text-align:center;">Jika punya 2 Utilitas, sewa 10x nilai dadu.</td></tr>`;
        }
        
        content += `<tr style="background:#f2f2f2"><td>Nilai Gadai</td><td>${formatRupiah(tile.mortgage)}</td></tr></table>`;
        
        if (owner) {
             content += `<p>Dimiliki oleh: <strong style="color:${owner.color}">${owner.name}</strong></p>`;
        } else {
             content += `<p>Properti ini belum dimiliki.</p>`;
        }
        
        // --- PERUBAHAN: Tampilkan tombol bangun berdasarkan aturan ---
        if (owner && owner.id === currentPlayerIndex) {
            content += '<div class="cert-actions">';
            
            // Cek apakah pemain boleh membangun
            let canBuild = false;
            if (buildingRule === 'direct') {
                canBuild = true; // Boleh langsung bangun
            } else if (buildingRule === 'complex') {
                canBuild = ownsAllInGroup(owner, tile.color); // Harus punya 1 komplek
            }

            if (tile.type === "property" && !tile.mortgaged && canBuild) {
                if (tile.houses < 5) content += `<button onclick="window.buyHouse(${tileIndex})">Bangun</button>`;
                if (tile.houses > 0) content += `<button onclick="window.sellHouse(${tileIndex})">Jual</button>`;
            }
            if (!tile.mortgaged) {
                content += `<button onclick="window.toggleMortgage(${tileIndex})">Gadai</button>`
            } else {
                content += `<button onclick="window.toggleMortgage(${tileIndex})">Tebus Gadai</button>`
            }
            content += "</div>";
        }
        // --- AKHIR PERUBAHAN ---

        certificateContent.innerHTML = content;
        certificateModal.classList.add("show");
    };

    window.buyHouse = (tileIndex) => {
        const tile = board[tileIndex];
        const player = players[currentPlayerIndex];
        if (player.money >= tile.houseCost && tile.houses < 5) {

            // --- PERUBAHAN: Cek aturan sebelum membangun ---
            if (buildingRule === 'complex') {
                if (!ownsAllInGroup(player, tile.color)) {
                    showToast("Anda harus memiliki semua properti dalam satu warna untuk membangun.", "error");
                    return;
                }
                const groupTiles = board.filter(t => t.color === tile.color);
                const canBuildFairly = groupTiles.every(t => tile.houses <= t.houses);
                if (!canBuildFairly) {
                    showToast("Anda harus membangun secara merata di semua properti warna ini.", "error");
                    return;
                }
            }
            // --- AKHIR PERUBAHAN ---
            
            if (payMoney(player, tile.houseCost)) {
                tile.houses++;
                showToast("Bangunan berhasil dibeli!", "success");
                updateBoard();
                updatePlayerDisplay();
                updateAssetsPanel();
                showCertificate(tileIndex);
            }
        } else {
            showToast("Uang tidak cukup atau sudah ada hotel!", "error");
        }
    };

    window.sellHouse = (tileIndex) => {
        const tile = board[tileIndex];
        const player = players[currentPlayerIndex];
        if (tile.houses > 0) {
            player.money += tile.houseCost / 2;
            tile.houses--;
            showToast("Bangunan berhasil dijual.", "success");
            updateBoard();
            updatePlayerDisplay();
            updateAssetsPanel();
            showCertificate(tileIndex);
        }
    };

    window.toggleMortgage = (tileIndex) => {
        const tile = board[tileIndex];
        const player = players[currentPlayerIndex];
        if (tile.mortgaged) {
            const costToUnmortgage = Math.floor(tile.mortgage * 1.1);
            if (payMoney(player, costToUnmortgage)) {
                tile.mortgaged = false;
                tile.element.classList.remove("mortgaged");
                showToast(`${tile.name} berhasil ditebus.`, "success");
            } else {
                showToast("Uang tidak cukup untuk menebus!", "error");
            }
        } else {
            if (tile.houses > 0) {
                showToast("Jual semua bangunan di properti ini sebelum menggadaikan!", "error");
                return;
            }
            player.money += tile.mortgage;
            tile.mortgaged = true;
            tile.element.classList.add("mortgaged");
            showToast(`${tile.name} berhasil digadaikan.`, "success");
        }
        updatePlayerDisplay();
        updateAssetsPanel();
        showCertificate(tileIndex);
    };

    const updateBoard = () => {
        board.forEach(tile => {
            if (!tile.element) return;
            const housesContainer = tile.element.querySelector(".houses-container");
            if (!housesContainer) return;
            
            housesContainer.innerHTML = "";
            if (tile.houses > 0) {
                if (tile.houses === 5) {
                    housesContainer.innerHTML = '<div class="hotel" title="Hotel"></div>';
                } else {
                    for (let i = 0; i < tile.houses; i++) {
                        housesContainer.innerHTML += '<div class="house" title="Rumah"></div>';
                    }
                }
            }
        });
    };

    // === EVENT LISTENERS ===
    startGameBtn.addEventListener('click', setupGame);
    rollDiceBtn.addEventListener('click', rollDice);
    endTurnBtn.addEventListener('click', endTurn);
    buyPropertyBtn.addEventListener('click', buyProperty);
    payFineBtn.addEventListener('click', () => {
        const player = players[currentPlayerIndex];
        if (player.inJail && payMoney(player, JAIL_FINE_USD)) {
            player.inJail = false;
            player.jailTurns = 0;
            showToast(`${player.name} bebas dari penjara setelah membayar denda!`, "success");
            updatePlayerTurnInfo();
            updatePlayerDisplay();
        } else if (player.inJail) {
            showToast("Uang tidak cukup untuk membayar denda!", "error");
        }
    });
    
    parkingConfirmBtn.addEventListener('click', () => {
        const destinationIndex = parseInt(parkingSelect.value);
        if (!isNaN(destinationIndex)) {
            showToast(`Anda pindah ke ${board[destinationIndex].name}.`);
            movePlayerTo(destinationIndex);
            parkingModal.classList.remove('show');
            
            if (!isDoubleRoll) {
                setTimeout(endTurn, 500);
            }
        }
    });

    closeBtn.onclick = () => certificateModal.classList.remove("show");
    window.onclick = (event) => {
        if (event.target == certificateModal) {
            certificateModal.classList.remove("show");
        }
        if (event.target == cardModal) {
            cardModal.classList.remove("show");
            if (!isDoubleRoll) {
                endTurnBtn.style.display = 'block';
            }
        }
        if (event.target == parkingModal) {
            parkingModal.classList.remove('show');
            if (!isDoubleRoll) {
                 setTimeout(endTurn, 500);
            }
        }
    };
    
    // Memulai pengambilan kurs saat halaman dimuat
    fetchExchangeRate();
});
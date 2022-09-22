import { Client } from 'boardgame.io/client';
import { PodRacer } from './PodRacer';

export default class PodRacerClient {
    private client: any;
    private rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.client = Client({ game: PodRacer });
        this.client.start();
        this.rootElement = rootElement;

        this.createBoard();
        this.attachListeners();
        this.client.subscribe((state: any) => this.update(state));
    }

    createBoard() {
        const size = 5;
        const rows = [];
        for (let y = 0; y < size; y++) {
            const cells = [];
            for (let x = 0; x < size; x++) {
                cells.push(`<td class="cell" data-x="${x}" data-y="${y}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        this.rootElement.innerHTML = `
        <table>${rows.join('')}</table>
        <p class="winner"></p>
      `;
    }

    attachListeners() {
        const handleCellClick = (event: any) => {
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);
            this.client.moves.clickCell(x, y);
        };
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach((cell: HTMLTableCellElement) => {
            cell.onclick = handleCellClick;
        });
    }

    update(state: any) {
        const cells = Array.from(this.rootElement.querySelectorAll('.cell')) as HTMLTableCellElement[];

        cells.forEach((cell) => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);            
            const cellValue = state.G.cells[y][x];
            if (cellValue == null) cell.textContent = '';
            else if (cellValue == '0') cell.textContent = '▹';
            else cell.textContent = '▾';
        });
        const messageEl = this.rootElement.querySelector('.winner');
        if (state.ctx.gameover) {
            messageEl.textContent =
                state.ctx.gameover.winner !== undefined
                    ? 'Winner: ' + state.ctx.gameover.winner
                    : 'Draw!';
        } else {
            messageEl.textContent = '';
        }
    }
}
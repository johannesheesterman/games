import { INVALID_MOVE } from 'boardgame.io/core';

const SIZE = 3;
function getLane(ctx: any, cells: string[][], x: number, y: number): string[] {
    if (ctx.currentPlayer == '0') return cells[y];
    return cells.map(arr => arr[x]);
}

function clearLane(ctx: any, G: any, x: number, y: number) {
    if (ctx.currentPlayer == '0') {
        G.cells[y][G.cells[y].indexOf('0')] = null;
        return;
    }

    for (let i = 0; i < G.cells.length; i++) {
        if (G.cells[i][x] == '1') {
            G.cells[i][x] = null;
            return;
        }
    }
}

function isVictory(cells: string[][]): boolean {
    if (cells[SIZE + 1].filter(c => c != null).length == SIZE) return true;
    if (cells.map(arr => arr[SIZE + 1]).filter(c => c != null).length == SIZE) return true;
    return false;
}

function isValidMove(G: any, ctx: any, x: number, y: number): boolean {
    if (G.cells[y][x] !== null) return false;
    const lane = getLane(ctx, G.cells, x, y);
    const currentLanePos = lane.indexOf(ctx.currentPlayer);
    // Prevent click on corner nodes
    if (currentLanePos == -1) return false;

    const newLanePos = ctx.currentPlayer == '0' ? x : y;

    // Player can't move backwards
    if (newLanePos < currentLanePos) return false;
    // Player can only move 1 or 2 nodes
    if (newLanePos - currentLanePos > 2) return false;
    // Player can only move 2 nodes when jumping over other player
    if (newLanePos - currentLanePos == 2 && lane[newLanePos - 1] == null) return false;

    return true;
}

export const PodRacer = {
    setup: (ctx: any) => {
        const g = { cells: Array(SIZE + 2).fill(null) };
        for (let y = 0; y < SIZE + 2; y++) {
            g.cells[y] = Array(SIZE + 2).fill(null);
        }
        for (let i = 1; i < SIZE + 1; i++) {
            g.cells[i][0] = '0';
            g.cells[0][i] = '1';
        }
        return g;
    },

    turn: {
        minMoves: 1,
        maxMoves: 1,
    },

    moves: {
        clickCell: (G: any, ctx: any, x: number, y: number) => {
            if (!isValidMove(G, ctx, x, y)) return INVALID_MOVE;
            clearLane(ctx, G, x, y);
            G.cells[y][x] = ctx.currentPlayer;
        },
    },

    endIf: (G: any, ctx: any) => {
        if (isVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
    },
};
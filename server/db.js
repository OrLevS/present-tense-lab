// Tiny JSON-file database (no installs needed). One file: data/db.json.
// Collections: teacher, settings, students, assignments, progress, responses, events, notes.
// To move to a real database later, keep this interface (load/get/save) and swap the implementation.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSeed } from './seed.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || path.join(here, '..', 'data');
export const DB_FILE = path.join(DATA_DIR, 'db.json');

let db = null;
let saveTimer = null;

export function load() {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    db = buildSeed();
    writeNow();
    console.log('Created demo database with seed data →', DB_FILE);
  } else {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return db;
}

export function get() {
  return load();
}

function writeNow() {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 1), 'utf8');
  fs.renameSync(tmp, DB_FILE);
}

export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(writeNow, 150);
}

export function flush() {
  clearTimeout(saveTimer);
  if (db) writeNow();
}

export function reset() {
  db = buildSeed();
  writeNow();
  return db;
}

export const newId = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

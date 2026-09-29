import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { config } from './config';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly db: DatabaseSync;

  constructor() {
    const path = config.databasePath;
    if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        default_language TEXT NOT NULL DEFAULT 'pt',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY, session_id TEXT NOT NULL,
        title TEXT NOT NULL,
        language TEXT NOT NULL,
        course_id TEXT NOT NULL DEFAULT 'general',
        audience TEXT NOT NULL DEFAULT 'general',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS chats_owner ON chats(session_id, updated_at DESC);
      CREATE TABLE IF NOT EXISTS turns (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE, chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        request_id TEXT NOT NULL, user_text TEXT NOT NULL, assistant_text TEXT NOT NULL,
        output_json TEXT NOT NULL, created_at TEXT NOT NULL,
        UNIQUE(chat_id, request_id)
      );
      CREATE INDEX IF NOT EXISTS turns_chat ON turns(chat_id, sequence);
      CREATE TABLE IF NOT EXISTS friendships (
        id TEXT PRIMARY KEY,
        requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        addressee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'accepted',
        created_at TEXT NOT NULL,
        UNIQUE(requester_id, addressee_id)
      );
      CREATE INDEX IF NOT EXISTS friendships_requester ON friendships(requester_id, created_at DESC);
      CREATE INDEX IF NOT EXISTS friendships_addressee ON friendships(addressee_id, created_at DESC);
      CREATE TABLE IF NOT EXISTS friend_conversations (
        id TEXT PRIMARY KEY,
        user_a_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_b_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_a_id, user_b_id)
      );
      CREATE INDEX IF NOT EXISTS friend_conversations_a ON friend_conversations(user_a_id, updated_at DESC);
      CREATE INDEX IF NOT EXISTS friend_conversations_b ON friend_conversations(user_b_id, updated_at DESC);
      CREATE TABLE IF NOT EXISTS friend_messages (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE,
        conversation_id TEXT NOT NULL REFERENCES friend_conversations(id) ON DELETE CASCADE,
        sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS friend_messages_conversation ON friend_messages(conversation_id, sequence);
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        invite_code TEXT NOT NULL UNIQUE,
        max_members INTEGER NOT NULL DEFAULT 10,
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS groups_updated ON groups(updated_at DESC);
      CREATE TABLE IF NOT EXISTS group_members (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'member',
        joined_at TEXT NOT NULL,
        UNIQUE(group_id, user_id)
      );
      CREATE INDEX IF NOT EXISTS group_members_user ON group_members(user_id, joined_at DESC);
      CREATE TABLE IF NOT EXISTS group_messages (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE,
        group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS group_messages_group ON group_messages(group_id, sequence);
    `);
    this.migrate();
  }

  private migrate() {
    const sessionColumns = this.db.prepare('PRAGMA table_info(sessions)').all() as Array<{ name: string }>;
    if (!sessionColumns.some(column => column.name === 'user_id')) {
      this.db.exec('ALTER TABLE sessions ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE CASCADE');
    }

    const chatColumns = this.db.prepare('PRAGMA table_info(chats)').all() as Array<{ name: string }>;
    if (!chatColumns.some(column => column.name === 'course_id')) {
      this.db.exec("ALTER TABLE chats ADD COLUMN course_id TEXT NOT NULL DEFAULT 'general'");
    }
    if (!chatColumns.some(column => column.name === 'audience')) {
      this.db.exec("ALTER TABLE chats ADD COLUMN audience TEXT NOT NULL DEFAULT 'general'");
    }
    const chatForeignKeys = this.db.prepare('PRAGMA foreign_key_list(chats)').all();
    if (chatForeignKeys.length > 0) {
      this.db.exec(`
        PRAGMA foreign_keys = OFF;
        CREATE TABLE chats_new (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          title TEXT NOT NULL,
          language TEXT NOT NULL,
          course_id TEXT NOT NULL DEFAULT 'general',
          audience TEXT NOT NULL DEFAULT 'general',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        INSERT INTO chats_new (id, session_id, title, language, course_id, audience, created_at, updated_at)
          SELECT id, session_id, title, language, course_id, audience, created_at, updated_at FROM chats;
        DROP TABLE chats;
        ALTER TABLE chats_new RENAME TO chats;
        CREATE INDEX IF NOT EXISTS chats_owner ON chats(session_id, updated_at DESC);
        PRAGMA foreign_keys = ON;
      `);
    }
    const userColumns = this.db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
    if (!userColumns.some(column => column.name === 'username')) {
      this.db.exec('ALTER TABLE users ADD COLUMN username TEXT');
      this.ensureUsernames();
      this.db.exec('CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username)');
    }
    if (!userColumns.some(column => column.name === 'avatar_url')) {
      this.db.exec('ALTER TABLE users ADD COLUMN avatar_url TEXT');
    }
    if (!userColumns.some(column => column.name === 'default_language')) {
      this.db.exec("ALTER TABLE users ADD COLUMN default_language TEXT NOT NULL DEFAULT 'pt'");
    }
    this.db.exec('PRAGMA user_version = 2');
  }

  private slug(value: string) {
    const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return normalized.replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'user';
  }

  private ensureUsernames() {
    const users = this.db.prepare('SELECT id, name, username FROM users ORDER BY created_at ASC').all() as Array<{ id: string; name: string; username: string | null }>;
    const taken = new Set(users.map(user => user.username).filter(Boolean) as string[]);
    const update = this.db.prepare('UPDATE users SET username = ? WHERE id = ?');
    for (const user of users) {
      if (user.username) continue;
      const base = this.slug(user.name);
      let candidate = base;
      let suffix = 1;
      while (taken.has(candidate)) candidate = `${base}${suffix++}`;
      taken.add(candidate);
      update.run(candidate, user.id);
    }
  }

  transaction<T>(operation: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = operation();
      this.db.exec('COMMIT');
      return result;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  onModuleDestroy() { this.db.close(); }
}

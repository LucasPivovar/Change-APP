import { Body, CanActivate, Controller, ConflictException, ExecutionContext, Get, Injectable, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { Request } from 'express';
import { DatabaseService } from './database.service';

export type SessionRequest = Request & { sessionId: string; userId?: string };
const hash = (token: string) => createHash('sha256').update(token).digest('hex');
const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;
const normalizeEmail = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim().toLowerCase() : value;
export const normalizeUsernameValue = (value: string) => value.trim().replace(/^@+/, '').toLowerCase();
const normalizeUsername = ({ value }: { value: unknown }) => typeof value === 'string' ? normalizeUsernameValue(value) : value;
const passwordHash = (password: string, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(password, salt, 32).toString('hex')}`;
const verifyPassword = (password: string, stored: string) => {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 32);
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
};

class RegisterDto {
  @IsString() @Transform(trim) @MinLength(2) @MaxLength(80)
  name!: string;

  @ValidateIf((_object, value) => value !== undefined) @IsString() @Transform(normalizeUsername) @MinLength(3) @MaxLength(24) @Matches(/^[a-z0-9_]+$/)
  username?: string;

  @IsEmail() @Transform(normalizeEmail) @MaxLength(160)
  email!: string;

  @IsString() @MinLength(6) @MaxLength(120)
  password!: string;
}

class UpdateProfileDto {
  @ValidateIf((_object, value) => value !== undefined) @IsString() @Transform(trim) @MinLength(2) @MaxLength(80)
  name?: string;

  @ValidateIf((_object, value) => value !== undefined) @IsString() @Transform(normalizeUsername) @MinLength(3) @MaxLength(24) @Matches(/^[a-z0-9_]+$/)
  username?: string;

  @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(400000)
  avatarUrl?: string | null;

  @ValidateIf((_object, value) => value !== undefined) @IsIn(['pt', 'en', 'es', 'fr'])
  defaultLanguage?: string;
}

class LoginDto {
  @IsEmail() @Transform(normalizeEmail) @MaxLength(160)
  email!: string;

  @IsString() @MinLength(1) @MaxLength(120)
  password!: string;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly database: DatabaseService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const token = request.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
    if (!token) throw new UnauthorizedException('Sessão necessária.');
    const session = this.database.db.prepare('SELECT id, user_id FROM sessions WHERE token_hash = ?').get(hash(token));
    if (!session) throw new UnauthorizedException('Sessão inválida.');
    request.sessionId = session.id as string;
    request.userId = session.user_id as string | undefined;
    return true;
  }
}

@Controller('sessions')
export class SessionController {
  constructor(private readonly database: DatabaseService) {}

  @Post()
  create() {
    const token = randomBytes(32).toString('hex');
    this.database.db.prepare('INSERT INTO sessions (id, user_id, token_hash, created_at) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), null, hash(token), new Date().toISOString());
    return { token };
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly database: DatabaseService) {}

  private makeUsername(name: string) {
    const base = normalizeUsernameValue(name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_]+/g, '')).slice(0, 20) || 'user';
    let candidate = base;
    let suffix = 1;
    while (this.database.db.prepare('SELECT id FROM users WHERE username = ?').get(candidate)) {
      candidate = `${base}${suffix++}`;
    }
    return candidate;
  }

  private session(userId: string) {
    const token = randomBytes(32).toString('hex');
    this.database.db.prepare('INSERT INTO sessions (id, user_id, token_hash, created_at) VALUES (?, ?, ?, ?)')
      .run(randomUUID(), userId, hash(token), new Date().toISOString());
    return { token };
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    const id = randomUUID();
    const now = new Date().toISOString();
    const username = dto.username || this.makeUsername(dto.name);
    try {
      this.database.db.prepare('INSERT INTO users (id, name, username, email, password_hash, avatar_url, default_language, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(id, dto.name, username, dto.email, passwordHash(dto.password), null, 'pt', now);
    } catch (error) {
      const message = String((error as Error).message || '');
      if (message.includes('username')) throw new ConflictException('Este nome de usuário já está em uso.');
      throw new ConflictException('Este email já está cadastrado.');
    }
    return { user: { id, name: dto.name, username, email: dto.email, avatarUrl: null, defaultLanguage: 'pt' }, ...this.session(id) };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    const user = this.database.db.prepare('SELECT id, name, username, email, password_hash, avatar_url, default_language FROM users WHERE email = ?').get(dto.email) as
      | { id: string; name: string; username: string; email: string; password_hash: string; avatar_url: string | null; default_language: string }
      | undefined;
    if (!user || !verifyPassword(dto.password, user.password_hash)) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }
    return { user: { id: user.id, name: user.name, username: user.username, email: user.email, avatarUrl: user.avatar_url, defaultLanguage: user.default_language }, ...this.session(user.id) };
  }
}

@Controller('profile')
@UseGuards(SessionGuard)
export class ProfileController {
  constructor(private readonly database: DatabaseService) {}

  private getUser(userId: string) {
    return this.database.db.prepare('SELECT id, name, username, email, avatar_url AS avatarUrl, default_language AS defaultLanguage, created_at AS createdAt FROM users WHERE id = ?')
      .get(userId) as { id: string; name: string; username: string; email: string; avatarUrl: string | null; defaultLanguage: string; createdAt: string } | undefined;
  }

  private stats(userId: string) {
    const rows = this.database.db.prepare(`
      SELECT turns.created_at AS createdAt
      FROM turns
      JOIN chats ON chats.id = turns.chat_id
      WHERE chats.session_id = ?
      ORDER BY turns.created_at ASC
    `).all(userId) as Array<{ createdAt: string }>;
    const days = [...new Set(rows.map(row => row.createdAt.slice(0, 10)))].sort();
    let streak = 0;
    const seen = new Set(days);
    const cursor = new Date();
    while (seen.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    const activeSeconds = rows.length * 60;
    const friends = this.database.db.prepare(`
      SELECT COUNT(*) AS total FROM friendships
      WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)
    `).get(userId, userId)!.total as number;
    return { streakDays: streak, friends, practicedSeconds: activeSeconds, messageCount: rows.length };
  }

  @Get()
  get(@Req() req: SessionRequest) {
    if (!req.userId) throw new UnauthorizedException('Entre na conta para acessar o perfil.');
    const user = this.getUser(req.userId);
    if (!user) throw new UnauthorizedException('Usuário inválido.');
    return { user, stats: this.stats(req.userId) };
  }

  @Patch()
  update(@Req() req: SessionRequest, @Body() dto: UpdateProfileDto) {
    if (!req.userId) throw new UnauthorizedException('Entre na conta para editar o perfil.');
    const current = this.getUser(req.userId);
    if (!current) throw new UnauthorizedException('Usuário inválido.');
    const next = {
      name: dto.name ?? current.name,
      username: dto.username ?? current.username,
      avatarUrl: dto.avatarUrl === undefined ? current.avatarUrl : dto.avatarUrl,
      defaultLanguage: dto.defaultLanguage ?? current.defaultLanguage,
    };
    try {
      this.database.db.prepare('UPDATE users SET name = ?, username = ?, avatar_url = ?, default_language = ? WHERE id = ?')
        .run(next.name, next.username, next.avatarUrl, next.defaultLanguage, req.userId);
    } catch {
      throw new ConflictException('Este nome de usuário já está em uso.');
    }
    return { user: this.getUser(req.userId), stats: this.stats(req.userId) };
  }
}

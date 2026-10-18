import type { NextFunction, Request, Response } from 'express';

// Dwa konta testowe wpisane na sztywno (bez prawdziwego logowania).
// Użytkownika wybiera nagłówek X-User, domyślnie user1.
const USERS = ['user1', 'user2'];

export function currentUser(req: Request, res: Response, next: NextFunction) {
  const user = req.header('X-User') ?? 'user1';
  if (!USERS.includes(user)) {
    res.status(401).json({ error: 'Nieznany użytkownik' });
    return;
  }
  res.locals.user = user;
  next();
}

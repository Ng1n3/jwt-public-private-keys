import fs from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';
import path from 'path';

export interface JwtPayload {
  id: string;
  email: string;
}

export class JwtUtils {
  private static readonly ACCESS_TOKEN_EXPIRES_IN =
    process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  private static readonly REFRESH_TOKEN_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

  private static readonly PRIVATE_KEY_PATH =
    process.env.JWT_ACCESS_PRIVATE_KEY_PATH ?? '../auth/keys/private.pem';
  private static readonly PUBLIC_KEY_PATH =
    process.env.JWT_ACCESS_PUBLIC_KEY_PATH ?? '../auth/keys/public.pem';

  private static getPrivateKey(): string {
    try {
      return fs.readFileSync(path.resolve(this.PRIVATE_KEY_PATH), 'utf8');
    } catch (error) {
      throw new Error(
        `Failed to load access private key from ${this.PRIVATE_KEY_PATH}`
      );
    }
  }

  private static getPublicKey(): string {
    try {
      return fs.readFileSync(path.resolve(this.PUBLIC_KEY_PATH), 'utf8');
    } catch (error) {
      throw new Error(`Failed to load public key from ${this.PUBLIC_KEY_PATH}`);
    }
  }

  static generateAccessToken(payload: JwtPayload): string {
    const privateKey = this.getPrivateKey();
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    };
    return jwt.sign(payload, privateKey, options);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    const privateKey = this.getPrivateKey();
    const options: SignOptions = {
      algorithm: 'RS256',
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    };
    return jwt.sign(payload, privateKey, options);
  }

  static verifyAccessToken(token: string): JwtPayload {
    const publicKey = this.getPublicKey();
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    }) as JwtPayload;
  }

  static verifyRefreshToken(token: string): JwtPayload {
    const publicKey = this.getPublicKey();
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    }) as JwtPayload;
  }

  static generateTokenPair(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}

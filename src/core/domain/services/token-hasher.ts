export abstract class TokenHasher {
  abstract hash(rawToken: string): string;
}

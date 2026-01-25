import express, { Express, Request, Response, NextFunction } from 'express';
import * as http from 'http';
import { WebhookConfig } from '../config/WebhookConfig';
import { PortDetector } from './utils/PortDetector';
import { Validator } from './utils/Validator';
import { Router } from './Router';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { RateLimitMiddleware } from './middleware/RateLimitMiddleware';
import { IdempotencyMiddleware } from './middleware/IdempotencyMiddleware';
import { SecurityMiddleware } from './middleware/SecurityMiddleware';
import { ApiKeyManager } from '../auth/ApiKeyManager';
import { ErrorLogger } from '../logging/ErrorLogger';
import { WebhookError } from './types/Error';
import { ERROR_HTTP_STATUS } from './types/Response';

/**
 * Main webhook server
 */
export class WebhookServer {
  private app: Express;
  private server: http.Server | null = null;
  private port: number | null = null;
  private router: Router;
  private errorLogger: ErrorLogger;

  constructor(
    private config: WebhookConfig,
    private apiKeyManager: ApiKeyManager,
    errorLogger: ErrorLogger
  ) {
    this.app = express();
    this.router = new Router();
    this.errorLogger = errorLogger;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  /**
   * Setup middleware stack
   */
  private setupMiddleware(): void {
    // Body parser
    this.app.use(express.json({ limit: this.config.security.maxBodySize }));

    // Security middleware
    const securityMiddleware = new SecurityMiddleware(this.config.security);
    this.app.use(securityMiddleware.timeoutHandler());

    // Auth middleware
    const authMiddleware = new AuthMiddleware(
      this.apiKeyManager,
      this.config.security.maxFailedAuthAttempts,
      this.config.security.authBlockDuration
    );
    this.app.use(authMiddleware.middleware());

    // HTTPS validation
    this.app.use(securityMiddleware.httpsValidator());

    // Rate limiting
    const rateLimitMiddleware = new RateLimitMiddleware(this.config.rateLimits);
    this.app.use(rateLimitMiddleware.middleware());

    // Idempotency
    const idempotencyMiddleware = new IdempotencyMiddleware(this.config.idempotency);
    this.app.use(idempotencyMiddleware.middleware());
  }

  /**
   * Setup routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Main webhook endpoint
    this.app.post('/webhook/v1', async (req, res, next) => {
      try {
        // Validate request envelope
        const validatedRequest = Validator.validateRequest(req.body);
        req.body = validatedRequest;

        // Validate timestamp freshness
        Validator.validateTimestampFreshness(validatedRequest.meta.timestamp);

        // Route to handler
        await this.router.route(req, res

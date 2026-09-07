import { INestApplication, Injectable } from '@nestjs/common';

export type AppBootstrapHook = (app: INestApplication) => void;

/**
 * Collects application bootstrap hooks from modules - main.ts runs them once against the built
 * application, after NestFactory.create and before app.listen, so modules can configure the app
 * (e.g. mount Swagger) without main.ts knowing about them.
 */
@Injectable()
export class AppBootstrapService {
  private hooks: AppBootstrapHook[] = [];
  private hasRun = false;

  register(...hooks: AppBootstrapHook[]): void {
    if (this.hasRun) {
      throw new Error(
        'AppBootstrapService - can not register hooks after run()',
      );
    }
    this.hooks.push(...hooks);
  }

  run(app: INestApplication): void {
    if (this.hasRun) {
      throw new Error('AppBootstrapService - run() has already been called');
    }
    this.hasRun = true;
    for (const hook of this.hooks) {
      hook(app);
    }
  }
}

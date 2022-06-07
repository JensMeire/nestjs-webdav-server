import {
    DynamicModule,
    Global,
    Logger,
    Module,
    Provider,
  } from '@nestjs/common';
  import { createWebDAVServer } from './webdav.utils';
  import {
    WebDAVModuleAsyncOptions,
    WebDAVModuleOptionsFactory,
    WebDAVServerExtendedOptions,
  } from './webdav.interfaces';
  import {
    WEBDAV_MODULE_OPTIONS,
    WEBDAV_MODULE_PRIVILEGE_MANAGER,
    WEBDAV_MODULE_SERVER,
    WEBDAV_MODULE_USER_MANAGER,
  } from './webdav.constants';
  
  @Global()
  @Module({})
  export class WebDAVCoreModule {
    static forRoot(options: WebDAVServerExtendedOptions): DynamicModule {
      const webDAVOptionsProvider: Provider = {
        provide: WEBDAV_MODULE_OPTIONS,
        useValue: options,
      };
  
      const webDAVUserManagerProvider: Provider = {
        provide: WEBDAV_MODULE_USER_MANAGER,
        useValue: options.userManager,
      };
  
      const webDAVUserPrivilegeProvider: Provider = {
        provide: WEBDAV_MODULE_PRIVILEGE_MANAGER,
        useValue: options.privilegeManager,
      };
  
      const server = createWebDAVServer(options);
      server.start((success) => {
        success
          ? Logger.log(
              `WebDAV server listening om port ${server.options.port}`,
              'WebDAV',
            )
          : Logger.warn('WebDAV server not started', 'WebDAV');
      });
  
      const webDAVConnectionProvider: Provider = {
        provide: WEBDAV_MODULE_SERVER,
        useValue: server,
      };
  
      return {
        module: WebDAVCoreModule,
        providers: [
          webDAVOptionsProvider,
          webDAVConnectionProvider,
          webDAVUserManagerProvider,
          webDAVUserPrivilegeProvider,
        ],
        exports: [
          webDAVOptionsProvider,
          webDAVConnectionProvider,
          webDAVUserManagerProvider,
          webDAVUserPrivilegeProvider,
        ],
      };
    }
  
    /* forRootAsync */
    public static forRootAsync(options: WebDAVModuleAsyncOptions): DynamicModule {
      const webDAVServerProvider: Provider = {
        provide: WEBDAV_MODULE_SERVER,
        useFactory: (options: WebDAVServerExtendedOptions) => {
          return createWebDAVServer(options);
        },
        inject: [WEBDAV_MODULE_OPTIONS],
      };
  
      const webDAVUserManagerProvider: Provider = {
        provide: WEBDAV_MODULE_USER_MANAGER,
        useFactory: (options: WebDAVServerExtendedOptions) => {
          return options.userManager;
        },
        inject: [WEBDAV_MODULE_OPTIONS],
      };
  
      const webDAVUserPrivilegeProvider: Provider = {
        provide: WEBDAV_MODULE_PRIVILEGE_MANAGER,
        useFactory: (options: WebDAVServerExtendedOptions) => {
          return options.privilegeManager;
        },
        inject: [WEBDAV_MODULE_OPTIONS],
      };
  
      const webDAVOptionsProvider = this.createAsyncProviders(options);
  
      return {
        module: WebDAVCoreModule,
        imports: options.imports,
        providers: [
          ...webDAVOptionsProvider,
          webDAVServerProvider,
          webDAVUserPrivilegeProvider,
          webDAVUserManagerProvider,
        ],
        exports: [
          ...webDAVOptionsProvider,
          webDAVServerProvider,
          webDAVUserPrivilegeProvider,
          webDAVUserManagerProvider,
        ],
      };
    }
  
    public static createAsyncProviders(
      options: WebDAVModuleAsyncOptions,
      connection?: string,
    ): Provider[] {
      if (!(options.useExisting || options.useFactory || options.useClass)) {
        throw new Error(
          'Invalid configuration. Must provide useFactory, useClass or useExisting',
        );
      }
  
      if (options.useExisting || options.useFactory) {
        return [this.createAsyncOptionsProvider(options)];
      }
  
      return [
        this.createAsyncOptionsProvider(options),
        { provide: options.useClass, useClass: options.useClass },
      ];
    }
  
    public static createAsyncOptionsProvider(
      options: WebDAVModuleAsyncOptions,
    ): Provider {
      if (!(options.useExisting || options.useFactory || options.useClass)) {
        throw new Error(
          'Invalid configuration. Must provide useFactory, useClass or useExisting',
        );
      }
  
      if (options.useFactory) {
        return {
          provide: WEBDAV_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      }
  
      return {
        provide: WEBDAV_MODULE_OPTIONS,
        async useFactory(
          optionsFactory: WebDAVModuleOptionsFactory,
        ): Promise<WebDAVServerExtendedOptions> {
          return optionsFactory.createWebDAVModuleOptions();
        },
        inject: [options.useClass || options.useExisting],
      };
    }
  }
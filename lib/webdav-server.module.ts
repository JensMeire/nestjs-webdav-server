import { DynamicModule, Module } from '@nestjs/common';
import { v2 as webdav } from 'webdav-server';
import { WebDAVCoreModule } from './webdav-core.module';
import { WebDAVModuleAsyncOptions } from './webdav.interfaces';

@Module({})
export class WebDAVServerModule {
  public static forRoot(options: webdav.WebDAVServerOptions): DynamicModule {
    return {
      module: WebDAVServerModule,
      imports: [WebDAVCoreModule.forRoot(options)],
      exports: [WebDAVCoreModule],
    };
  }

  public static forRootAsync(options: WebDAVModuleAsyncOptions): DynamicModule {
    return {
      module: WebDAVServerModule,
      imports: [WebDAVCoreModule.forRootAsync(options)],
      exports: [WebDAVCoreModule],
    };
  }
}
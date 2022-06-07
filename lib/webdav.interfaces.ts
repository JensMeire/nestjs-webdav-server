import { ModuleMetadata, Type } from '@nestjs/common';
import { v2 as webdav } from 'webdav-server';

export interface WebDAVServerExtendedOptions
  extends webdav.WebDAVServerOptions {
  rootPath?: string;
  userManager?: webdav.IListUserManager | webdav.IUserManager;
}

export interface WebDAVModuleOptionsFactory {
  createWebDAVModuleOptions():
    | Promise<WebDAVServerExtendedOptions>
    | WebDAVServerExtendedOptions;
}

export interface WebDAVModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<WebDAVModuleOptionsFactory>;
  useExisting?: Type<WebDAVModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<WebDAVServerExtendedOptions> | WebDAVServerExtendedOptions;
}
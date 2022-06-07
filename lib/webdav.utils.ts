import { v2 as webdav } from 'webdav-server';
import { Logger } from '@nestjs/common';
import * as express from 'express';
import { WebDAVServerExtendedOptions } from './webdav.interfaces';

export const createWebDAVServer = (options?: WebDAVServerExtendedOptions) => {
  const server = new webdav.WebDAVServer(options);
  if (!options.rootPath) {
    server.start((success) => {
      success
        ? Logger.log(
            `WebDAV server listening om port ${server.options.port}`,
            'WebDAV',
          )
        : Logger.warn('WebDAV server not started', 'WebDAV');
    });
    return server;
  }
  const app = express();
  app.use(webdav.extensions.express(options.rootPath, server));
  app.listen(options.port, options.hostname, () => {
    Logger.log(
      `WebDAV server listening om port ${server.options.port} using express with rootPath: ${options.rootPath}`,
      'WebDAV',
    );
  });
  return server;
};
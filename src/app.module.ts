import { Module } from '@nestjs/common';
import { WebDAVServerModule } from '../lib/webdav-server.module';
import { v2 } from 'webdav-server';
import { AppService } from './app.service';

@Module({
  imports: [
    WebDAVServerModule.forRootAsync({
      useFactory: () => {
        const userManager = new v2.SimpleUserManager();
        const privilegeManager = new v2.SimplePathPrivilegeManager();

        return {
          port: 1234,
          rootPath: `/user/dav/v1/custompath`,
          privilegeManager: privilegeManager,
          httpAuthentication: new v2.HTTPBasicAuthentication(userManager),
          userManager: userManager,
        };
      },
      inject: [],
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }

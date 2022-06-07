import { Injectable } from "@nestjs/common";
import { InjectWebDAVServer, InjectWebDAVUserManager, InjectWebDAVPrivilegeManager } from "lib/webdav.decorators";
import { v2 as webdav } from 'webdav-server';

@Injectable()
export class AppService {
    constructor(@InjectWebDAVServer() private readonly _server: webdav.WebDAVServer,
        @InjectWebDAVUserManager() private readonly _userManager: webdav.SimpleUserManager,
        @InjectWebDAVPrivilegeManager() private readonly _privilegeManager: webdav.SimplePathPrivilegeManager) { }
}
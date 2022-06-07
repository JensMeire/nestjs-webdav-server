import { Inject } from '@nestjs/common';
import {
  WEBDAV_MODULE_PRIVILEGE_MANAGER,
  WEBDAV_MODULE_SERVER,
  WEBDAV_MODULE_USER_MANAGER,
} from './webdav.constants';

export const InjectWebDAVServer = () => {
  return Inject(WEBDAV_MODULE_SERVER);
};

export const InjectWebDAVUserManager = () => {
  return Inject(WEBDAV_MODULE_USER_MANAGER);
};

export const InjectWebDAVPrivilegeManager = () => {
  return Inject(WEBDAV_MODULE_PRIVILEGE_MANAGER);
};
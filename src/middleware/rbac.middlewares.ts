import { Permission } from 'accesscontrol';
import { Request, Response, NextFunction } from 'express';
import { AuthFailureError } from '../core/error.response';
import rbac from './role.middlewares';

export const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role_name = req.query.role as string ;
      if (!role_name) throw new AuthFailureError('Role not provided');

      // Dynamically handle permission based on the action string
      let permission: Permission;
      switch (action) {
        case 'read:any':
            permission = rbac.can(role_name).readAny(resource);
            break;
        case 'read:own':
            permission = rbac.can(role_name).readOwn(resource);
            break;
        case 'create:any':
            permission = rbac.can(role_name).createAny(resource);
            break;
        case 'create:own':
            permission = rbac.can(role_name).createOwn(resource);
            break;
        case 'update:any':
            permission = rbac.can(role_name).updateAny(resource);
            break;
        case 'update:own':
            permission = rbac.can(role_name).updateOwn(resource);
            break;
        case 'delete:any':
            permission = rbac.can(role_name).deleteAny(resource);
            break;
        case 'delete:own':
            permission = rbac.can(role_name).deleteOwn(resource);
            break;
        default:
            throw new AuthFailureError('Invalid action');
      }

      if (!permission.granted) {
        throw new AuthFailureError('You do not have enough permission...');
      }

        next();
    } catch (error) {
        next(error);
    }
  };
};

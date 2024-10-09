import Resource from "../models/resource.model"
import Role from "../models/role.model";

import { grants } from "../models/role.model";

export class RBACService{
    static createResource = async({ name = 'profile', slug = 'p00001', description = '' })=>{
        try {
            console.log('triggered here')
            const resource = await Resource.create({
                src_name: name,
                src_slug: slug,
                src_description: description 
            })
            return resource
        } catch (error) {
            console.log(error)
        }

    }
    static resourceList = async()=>{
        const resources = await Resource.aggregate([
            {            
                $project: {
                    _id: 0,
                    name:'$src_name',
                    slug:'$src_slug',
                    description:'$src_description',
                    resourceId:'$_id',
                    createdAt:1
                }
            }
        ])
        return resources
    }

    static createRole = async({
        name = 'shop',
        slug = 's00001',
        description = 'admin extend from shop or user',
        grants
    }:{
        name: string,
        slug: string,
        description: string,
        grants: grants[]
    })=>{
        try {
            const roles =await Role.create({
                rol_name: name,
                rol_slug: slug,
                rol_description: description,
                rol_grants: grants
            })
            return roles
        } catch (error) {
            console.log(error)
        }
    }

    static roleList =async ()=>{
        try {
            const roles = await Role.find()
            await Role.aggregate([
                {
                    $unwind:"$rol_grants"
                },
                {
                    $lookup:{
                        from: 'Resources',
                        localField:'rol_grants.resource',
                        foreignField:'_id',
                        as:'resource'
                    }
                },
                {
                    $unwind:"$resource"
                },
                {
                    $project:{
                        role:'$rol_name',
                        resource: '$resource.src_name',
                        action: '$rol_grants.actions',
                        attribute:'$rol_grants.attributes'
                    }
                },
                {
                    $unwind:"$action"
                },
                {
                    $project:{
                        _id:0,
                        role:1,
                        resource: 1,
                        action: '$actions',
                        attribute: 1
                    }
                },
            ])
            return roles
        } catch (error) {
            console.log(error)
        }
    }
}
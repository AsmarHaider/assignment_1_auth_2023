//these are the missing variables for dummy data.
import {AuthenticationAction, DatabaseAction, Permission} from "./permission";
import {Role} from "./role";

export const demoPermissions: Permission[] = [
    {
        id: '0d6179fc-bc2f-4a50-bfd8-4ce4d10680f4',
        name: 'Permission 1',
        effect: 'Allow',
        action: [DatabaseAction.READ],
        resource: 'Database1',
        description: 'Allows reading from Database1'
    },
    {
        id: '43f2ad9b-cafe-4175-ac26-ed7a5f1bf438',
        name: 'Permission 2',
        effect: 'Deny',
        action: [DatabaseAction.WRITE],
        resource: 'Database2',
        description: 'Denies writing to Database2'
    },
    {
        id: 'f9569347-80fb-454b-aea4-5d07781d7a7f',
        name: 'Permission 3',
        effect: 'Allow',
        action: [DatabaseAction.DELETE],
        resource: 'Database3',
        description: 'Allows deleting from Database3'
    },
    {
        id: '0475606e-62f9-43c1-a5f1-aff50a15f478',
        name: 'Permission 4',
        effect: 'Allow',
        action: [DatabaseAction.UPDATE],
        resource: 'Database4',
        description: 'Allows updating Database4'
    },
    {
        id: '2186acab-2660-42c2-9d4b-105624e90a75',
        name: 'Permission 5',
        effect: 'Deny',
        action: [AuthenticationAction.VERIFY],
        resource: 'AuthSystem',
        description: 'Denies verification in AuthSystem'
    },
    {
        id: 'ae06ef52-a5cc-4c23-9288-25f2f67ae42f',
        name: 'Permission 6',
        effect: 'Allow',
        action: [AuthenticationAction.CHANGE_PASSWORD],
        resource: 'AuthSystem',
        description: 'Allows changing password in AuthSystem'
    },
    {
        id: '2183ad84-2dae-46a8-a69b-73d040acd6bc',
        name: 'Permission 7',
        effect: 'Deny',
        action: [DatabaseAction.READ],
        resource: 'Database5',
        description: 'Denies reading from Database5'
    },
    {
        id: '88659aaa-4b2d-47a8-92b3-ae58b0779a4e',
        name: 'Permission 8',
        effect: 'Allow',
        action: [DatabaseAction.WRITE],
        resource: 'Database6',
        description: 'Allows writing to Database6'
    },
    {
        id: 'ed289381-23a6-4cff-b86d-3e0b423ca6a7',
        name: 'Permission 9',
        effect: 'Deny',
        action: [AuthenticationAction.RESET_PASSWORD],
        resource: 'AuthSystem',
        description: 'Denies password reset in AuthSystem'
    },
    {
        id: '55ca6fdf-a91a-4f1d-9a29-4c41096c74a6',
        name: 'Permission 10',
        effect: 'Allow',
        action: [AuthenticationAction.CREATE_USER],
        resource: 'AuthSystem',
        description: 'Allows creating users in AuthSystem'
    }
];

//we can also store it in key value form for fast fetching
export const demoRoles: Role[] = [
    {
        id: "9faaf9ba-464e-4c68-a901-630fc4de123b",
        name: "User",
        permissions: [],
    },
    {
        id: "346a3cce-49d4-4e3c-bade-a16ed44b98bb",
        name: "Administrator",
        permissions: [],
    },
    {
        id: "6f25f789-72f3-41e2-9561-b30ca19aa225",
        name: "Auditor",
        permissions: [],
    },
];
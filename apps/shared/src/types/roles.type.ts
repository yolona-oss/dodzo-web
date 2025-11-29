export enum Role {
    SUPER_ADMIN = 'super_admin',
    RESTAURANT_OWNER = 'restaurant_owner',
    RESTAURANT_MANAGER = 'restaurant_manager',
    DELIVERY_PERSON = 'delivery_person',
    EMPLOYEE = 'employee',
    CUSTOMER = 'customer'
}

export const __RoleNotCustomer = [
    Role.SUPER_ADMIN,
    Role.RESTAURANT_OWNER,
    Role.RESTAURANT_MANAGER,
    Role.DELIVERY_PERSON,
    Role.EMPLOYEE
]

export const __RoleAll = [
    Role.SUPER_ADMIN,
    Role.RESTAURANT_OWNER,
    Role.RESTAURANT_MANAGER,
    Role.DELIVERY_PERSON,
    Role.EMPLOYEE,
    Role.CUSTOMER
]

export interface CreateSupplierDto {
    name: string
    contactPerson: string
    email: string
    phone: string
    address: string
    paymentTerms: string
    meta: Record<string, any>
}

export interface UpdateSupplierDto extends CreateSupplierDto {
    isActive?: boolean
}

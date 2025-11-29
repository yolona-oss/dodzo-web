export enum DeliveryStatus {
    PENDING = 'pending',
    ASSIGNED = 'assigned',
    ACCEPTED = 'accepted',
    PICKED_UP = 'picked_up',
    IN_TRANSIT = 'in_transit',
    ARRIVED = 'arrived',
    DELIVERED = 'delivered',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

export enum DriverStatus {
    OFFLINE = 'offline',
    AVAILABLE = 'available',
    BUSY = 'busy',
    ON_BREAK = 'on_break'
}

export enum VehicleType {
    MOTORCYCLE = 'motorcycle',
    CAR = 'car',
    BICYCLE = 'bicycle',
    SCOOTER = 'scooter'
}

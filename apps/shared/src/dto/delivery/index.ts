import { DeliveryStatus, DriverStatus, VehicleType } from "../../types/delivery/index";

export class CreateDriverDto {
  userId: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleModel?: string;
  phoneNumber?: string;
}

export class UpdateDriverDto {
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  vehicleModel?: string;
  phoneNumber?: string;
  status?: DriverStatus;
  isActive?: boolean;
}

export class UpdateDriverLocationDto {
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  metadata?: Record<string, any>;
}

export class CreateDeliveryDto {
  orderId: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  customerName?: string;
  customerPhone?: string;
  deliveryNotes?: string;
  deliveryFee: number;
}

export class AssignDeliveryDto {
  deliveryId: string;
  driverId: string;
  estimatedDeliveryTime?: Date;
}

export class UpdateDeliveryStatusDto {
  deliveryId: string;
  status: DeliveryStatus;
  notes?: string;
  latitude?: number;
  longitude?: number;
  proofOfDelivery?: {
    signature?: string;
    photo?: string;
    notes?: string;
    receivedBy?: string;
  };
}

export class TrackDeliveryDto {
  deliveryId: string;
}

export class RateDeliveryDto {
  deliveryId: string;
  rating: number;
  feedback?: string;
}

export class GetNearbyDriversDto {
  latitude: number;
  longitude: number;
  radiusKm?: number; // Default 10km
}

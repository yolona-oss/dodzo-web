import { Migration } from '@mikro-orm/migrations';

export class Migration20251127165422 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "address" ("id" uuid not null, "country" varchar(255) not null, "city" varchar(255) not null, "street" varchar(255) not null, "house" int not null, "building" int null, "floor" int null, "room" int null, "postal_code" varchar(255) null, constraint "address_pkey" primary key ("id"));`);

    this.addSql(`create table "expense_category" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "parent_category_id" varchar(255) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "expense_category_pkey" primary key ("id"));`);

    this.addSql(`create table "images" ("id" uuid not null, "image" jsonb not null, "alt" varchar(255) null, "order" int not null default 0, "owner_type" text check ("owner_type" in ('user', 'product', 'category')) not null, "owner_id" varchar(255) null, "blank_type" text check ("blank_type" in ('user', 'product', 'category')) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "images_pkey" primary key ("id"));`);

    this.addSql(`create table "payment" ("id" varchar(255) not null, "provider" varchar(255) not null, "provider_payment_id" varchar(255) not null, "amount" int not null, "currency" varchar(255) not null, "captured" boolean not null default false, "created_at" timestamptz null, constraint "payment_pkey" primary key ("id"));`);

    this.addSql(`create table "supplier" ("id" varchar(255) not null, "name" varchar(255) not null, "contact_person" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "address" varchar(255) not null, "tax_id" varchar(255) not null, "payment_terms" varchar(255) not null, "metadata" jsonb null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "supplier_pkey" primary key ("id"));`);

    this.addSql(`create table "supply_item" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "sku" varchar(255) not null, "type" text check ("type" in ('raw_ingredient', 'complex_ingredient', 'packaging', 'consumable')) not null, "unit" text check ("unit" in ('kg', 'g', 'l', 'ml', 'pcs', 'pkg')) not null, "storage_instructions" jsonb null, "shelf_life" int null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "supply_item_pkey" primary key ("id"));`);
    this.addSql(`create index "supply_item_sku_index" on "supply_item" ("sku");`);
    this.addSql(`alter table "supply_item" add constraint "supply_item_sku_unique" unique ("sku");`);

    this.addSql(`create table "supplier_item" ("id" varchar(255) not null, "supplier_id" varchar(255) not null, "supply_item_id" varchar(255) not null, "supplier_sku" varchar(255) not null, "unit_price" numeric(10,2) not null, "currency" varchar(255) not null default 'USD', "minimum_order_quantity" numeric(10,2) null, "lead_time_days" int null, "is_preferred" boolean not null default false, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "supplier_item_pkey" primary key ("id"));`);

    this.addSql(`create table "ingredient_composition" ("id" varchar(255) not null, "complex_ingredient_id" varchar(255) not null, "supply_item_id" varchar(255) not null, "quantity" numeric(10,3) not null, "unit" text check ("unit" in ('kg', 'g', 'l', 'ml', 'pcs', 'pkg')) not null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "ingredient_composition_pkey" primary key ("id"));`);

    this.addSql(`create table "unit" ("id" varchar(255) not null, "name" varchar(255) not null, "symbol" varchar(255) not null, "ratio_to_base" real null, constraint "unit_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(255) null, "password_hash" varchar(255) null, "phone" varchar(255) null, "roles" text[] not null default '{customer}', "preferences" jsonb null, "providers" text[] not null default '{EMAIL}', "google_id" varchar(255) null, "email_verified" boolean not null default false, "phone_verified" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_phone_unique" unique ("phone");`);

    this.addSql(`create table "session" ("id" uuid not null, "user_id" varchar(255) not null, "type" text check ("type" in ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL')) not null default 'REFRESH', "token" varchar(255) not null, "device_info" varchar(255) not null, "ip_address" varchar(255) not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, constraint "session_pkey" primary key ("id"));`);

    this.addSql(`create table "driver" ("id" uuid not null, "user_id" varchar(255) not null, "vehicle_type" text check ("vehicle_type" in ('motorcycle', 'car', 'bicycle', 'scooter')) not null, "vehicle_number" varchar(255) not null, "vehicle_model" varchar(255) null, "phone_number" varchar(255) null, "status" text check ("status" in ('offline', 'available', 'busy', 'on_break')) not null default 'offline', "current_latitude" numeric(10,7) null, "current_longitude" numeric(10,7) null, "last_location_update" timestamptz null, "rating" numeric(3,1) not null default 0, "total_deliveries" int not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "driver_pkey" primary key ("id"));`);

    this.addSql(`create table "wschedule" ("id" uuid not null, "start_time" timestamptz not null, "end_time" timestamptz not null, "repeat_rule" varchar(255) null, constraint "wschedule_pkey" primary key ("id"));`);

    this.addSql(`create table "restaurant" ("id" varchar(255) not null, "name" varchar(255) not null, "slug" varchar(255) null, "timezone" varchar(255) null, "address_id" uuid not null, "schedule_id" uuid null, "status" text check ("status" in ('active', 'inactive', 'maintenance')) not null default 'active', "has_lounge" boolean not null default true, "has_delivery" boolean not null default true, "delivery_settings" jsonb null, constraint "restaurant_pkey" primary key ("id"));`);

    this.addSql(`create table "wishlist" ("id" varchar(255) not null, "user_id" varchar(255) not null, "restaurant_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "wishlist_pkey" primary key ("id"));`);
    this.addSql(`create index "wishlist_user_id_restaurant_id_index" on "wishlist" ("user_id", "restaurant_id");`);

    this.addSql(`create table "supply_order" ("id" varchar(255) not null, "order_number" varchar(255) not null, "supplier_id" varchar(255) not null, "restaurant_id" varchar(255) not null, "status" text check ("status" in ('draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled')) not null default 'draft', "order_date" timestamptz null, "expected_delivery_date" timestamptz null, "actual_delivery_date" timestamptz null, "total_amount" numeric(10,2) not null default 0, "currency" varchar(255) not null default 'USD', "meta" varchar(255) null, "invoice_number" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "supply_order_pkey" primary key ("id"));`);
    this.addSql(`create index "supply_order_order_number_index" on "supply_order" ("order_number");`);
    this.addSql(`alter table "supply_order" add constraint "supply_order_order_number_unique" unique ("order_number");`);

    this.addSql(`create table "supply_order_item" ("id" varchar(255) not null, "order_id" varchar(255) not null, "supplier_item_id" varchar(255) not null, "quantity_ordered" numeric(10,3) not null, "quantity_received" numeric(10,3) not null default 0, "unit_price" numeric(10,2) not null, "total_price" numeric(10,2) not null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "supply_order_item_pkey" primary key ("id"));`);

    this.addSql(`create table "batch" ("id" varchar(255) not null, "batch_number" varchar(255) not null, "supply_item_id" varchar(255) not null, "supply_order_id" varchar(255) null, "quantity" numeric(10,3) not null, "remaining_quantity" numeric(10,3) not null, "unit_cost" numeric(10,2) null, "expiration_date" timestamptz null, "received_date" timestamptz not null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "batch_pkey" primary key ("id"));`);

    this.addSql(`create table "stock_transfer" ("id" varchar(255) not null, "transfer_number" varchar(255) not null, "from_restaurant_id" varchar(255) not null, "to_restaurant_id" varchar(255) not null, "supply_item_id" varchar(255) not null, "quantity" numeric(10,3) not null, "unit" text check ("unit" in ('kg', 'g', 'l', 'ml', 'pcs', 'pkg')) not null, "requested_date" timestamptz not null, "shipped_date" timestamptz null, "received_date" timestamptz null, "status" varchar(255) not null default 'pending', "requested_by" varchar(255) null, "approved_by" varchar(255) null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "stock_transfer_pkey" primary key ("id"));`);

    this.addSql(`create table "restaurant_stock" ("id" varchar(255) not null, "restaurant_id" varchar(255) not null, "supply_item_id" varchar(255) not null, "current_stock" numeric(10,3) not null default 0, "min_stock_level" numeric(10,3) not null, "max_stock_level" numeric(10,3) null, "reorder_quantity" numeric(10,3) null, "last_restocked_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "restaurant_stock_pkey" primary key ("id"));`);
    this.addSql(`create index "restaurant_stock_restaurant_id_supply_item_id_index" on "restaurant_stock" ("restaurant_id", "supply_item_id");`);

    this.addSql(`create table "restaurant_batch" ("id" varchar(255) not null, "batch_number" varchar(255) not null, "restaurant_stock_id" varchar(255) not null, "source_batch_id" varchar(255) null, "quantity" numeric(10,3) not null, "remaining_quantity" numeric(10,3) not null, "unit_cost" numeric(10,2) null, "expiration_date" timestamptz null, "received_date" timestamptz not null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "restaurant_batch_pkey" primary key ("id"));`);

    this.addSql(`create table "stock_movement" ("id" varchar(255) not null, "restaurant_stock_id" varchar(255) not null, "batch_id" varchar(255) null, "type" text check ("type" in ('purchase', 'usage', 'waste', 'adjustment', 'return', 'transfer')) not null, "quantity" numeric(10,3) not null, "unit" text check ("unit" in ('kg', 'g', 'l', 'ml', 'pcs', 'pkg')) not null, "reference_id" varchar(255) null, "reference_type" varchar(255) null, "reason" varchar(255) null, "user_id" varchar(255) null, "cost_per_unit" numeric(10,2) null, "movement_date" timestamptz not null, "notes" varchar(255) null, "created_at" timestamptz not null, constraint "stock_movement_pkey" primary key ("id"));`);

    this.addSql(`create table "promotion" ("id" varchar(255) not null, "code" varchar(255) null, "name" varchar(255) not null, "rule" jsonb null, "start_at" timestamptz null, "end_at" timestamptz null, "is_active" boolean not null default true, "restaurant_id" varchar(255) null, constraint "promotion_pkey" primary key ("id"));`);

    this.addSql(`create table "order" ("id" varchar(255) not null, "user_id" varchar(255) not null, "restaurant_id" varchar(255) not null, "total_amount" numeric(10,2) not null, "status" varchar(255) not null default 'CREATED', "pickup_time" timestamptz null, "payment_id" varchar(255) null, "delivery_id" uuid null, "tip" numeric(10,2) not null default 0, "order_type" varchar(255) not null, "delivery_fee" numeric(10,2) not null default 0, "meta" jsonb null, "created_at" timestamptz not null, "closed_at" timestamptz null, "updated_at" timestamptz not null, constraint "order_pkey" primary key ("id"));`);

    this.addSql(`create table "delivery" ("id" uuid not null, "delivery_number" varchar(255) not null, "order_id" varchar(255) not null, "driver_id" uuid null, "status" text check ("status" in ('pending', 'assigned', 'accepted', 'picked_up', 'in_transit', 'arrived', 'delivered', 'failed', 'cancelled')) not null default 'pending', "pickup_address" varchar(255) not null, "pickup_latitude" numeric(10,7) not null, "pickup_longitude" numeric(10,7) not null, "delivery_address" varchar(255) not null, "delivery_latitude" numeric(10,7) not null, "delivery_longitude" numeric(10,7) not null, "customer_name" varchar(255) null, "customer_phone" varchar(255) null, "delivery_notes" varchar(255) null, "delivery_fee" numeric(10,2) not null, "estimated_distance" numeric(10,2) null, "estimated_duration" int null, "assigned_at" timestamptz null, "accepted_at" timestamptz null, "picked_up_at" timestamptz null, "delivered_at" timestamptz null, "estimated_delivery_time" timestamptz null, "actual_delivery_time" timestamptz null, "failure_reason" varchar(255) null, "proof_of_delivery" jsonb null, "rating" numeric(2,1) null, "feedback" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "delivery_pkey" primary key ("id"));`);
    this.addSql(`create index "delivery_delivery_number_index" on "delivery" ("delivery_number");`);
    this.addSql(`alter table "delivery" add constraint "delivery_delivery_number_unique" unique ("delivery_number");`);
    this.addSql(`create index "delivery_order_id_status_index" on "delivery" ("order_id", "status");`);

    this.addSql(`create table "delivery_status_history" ("id" uuid not null, "delivery_id" uuid not null, "status" text check ("status" in ('pending', 'assigned', 'accepted', 'picked_up', 'in_transit', 'arrived', 'delivered', 'failed', 'cancelled')) not null, "notes" varchar(255) null, "latitude" numeric(10,7) null, "longitude" numeric(10,7) null, "timestamp" timestamptz not null, "updated_by" varchar(255) null, constraint "delivery_status_history_pkey" primary key ("id"));`);

    this.addSql(`create table "delivery_location" ("id" uuid not null, "delivery_id" uuid not null, "latitude" numeric(10,7) not null, "longitude" numeric(10,7) not null, "accuracy" numeric(5,2) null, "speed" numeric(5,2) null, "heading" numeric(5,2) null, "altitude" numeric(5,2) null, "timestamp" timestamptz not null, "metadata" jsonb null, constraint "delivery_location_pkey" primary key ("id"));`);
    this.addSql(`create index "delivery_location_delivery_id_timestamp_index" on "delivery_location" ("delivery_id", "timestamp");`);

    this.addSql(`create table "expense" ("id" varchar(255) not null, "category_id" varchar(255) not null, "restaurant_id" varchar(255) null, "description" varchar(255) not null, "amount" numeric(10,2) not null, "currency" varchar(255) not null default 'USD', "expense_date" timestamptz not null, "supplier_id" varchar(255) null, "supply_order_id" varchar(255) null, "invoice_number" varchar(255) null, "receipt_url" varchar(255) null, "user_id" varchar(255) null, "metadata" jsonb null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "expense_pkey" primary key ("id"));`);

    this.addSql(`create table "category" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "parent_category_id" varchar(255) null, "restaurant_id" varchar(255) not null, constraint "category_pkey" primary key ("id"));`);

    this.addSql(`create table "product" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "sku" varchar(255) not null, "base_price" numeric(10,2) not null, "is_active" boolean not null default true, "category_id" varchar(255) not null, "restaurant_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_pkey" primary key ("id"));`);
    this.addSql(`create index "product_sku_index" on "product" ("sku");`);
    this.addSql(`alter table "product" add constraint "product_sku_unique" unique ("sku");`);

    this.addSql(`create table "wishlist_item" ("id" varchar(255) not null, "wishlist_id" varchar(255) not null, "product_id" varchar(255) not null, "qty" int not null, "meta" varchar(255) null, "unit_price" int null, "notify_on_available" boolean null, "total_price" int null, "is_promotion" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "wishlist_item_pkey" primary key ("id"));`);

    this.addSql(`create table "restaurant_product" ("id" varchar(255) not null, "restaurant_id" varchar(255) not null, "product_id" varchar(255) not null, "is_available" boolean not null default true, "available_for_delivery" boolean not null default true, "available_in_lounge" boolean not null default true, "price_override" numeric(10,2) null, "estimated_prep_time" int null, "customizations" jsonb null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "restaurant_product_pkey" primary key ("id"));`);
    this.addSql(`create index "restaurant_product_restaurant_id_product_id_index" on "restaurant_product" ("restaurant_id", "product_id");`);

    this.addSql(`create table "product_packaging" ("id" varchar(255) not null, "product_id" varchar(255) not null, "packaging_item_id" varchar(255) not null, "quantity" numeric(10,3) not null default 1, "is_required_for_delivery" boolean not null default true, "is_required_for_lounge" boolean not null default false, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_packaging_pkey" primary key ("id"));`);

    this.addSql(`create table "product_ingredient" ("id" varchar(255) not null, "product_id" varchar(255) not null, "supply_item_id" varchar(255) not null, "quantity" numeric(10,3) not null, "unit" text check ("unit" in ('kg', 'g', 'l', 'ml', 'pcs', 'pkg')) not null, "notes" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_ingredient_pkey" primary key ("id"));`);

    this.addSql(`create table "order_item" ("id" varchar(255) not null, "order_id" varchar(255) not null, "product_id" varchar(255) not null, "qty" int not null, "unit_price" int not null, "customizations" jsonb null, "total_price" int not null, "created_at" timestamptz not null, constraint "order_item_pkey" primary key ("id"));`);

    this.addSql(`create table "cart" ("id" varchar(255) not null, "user_id" varchar(255) not null, "is_active" boolean not null default true, "session_id" varchar(255) null, "restaurant_id" varchar(255) not null, "totals_snapshot" jsonb null, "expires_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_pkey" primary key ("id"));`);
    this.addSql(`create index "cart_user_id_restaurant_id_index" on "cart" ("user_id", "restaurant_id");`);

    this.addSql(`create table "cart_promotion" ("id" varchar(255) not null, "cart_id" varchar(255) not null, "promotion_id" varchar(255) not null, "result" jsonb null, constraint "cart_promotion_pkey" primary key ("id"));`);

    this.addSql(`create table "cart_item" ("id" varchar(255) not null, "cart_id" varchar(255) not null, "product_id" varchar(255) not null, "qty" int not null default 1, "meta" varchar(255) null, "unit_price" int null, "price_at_add" numeric(10,2) not null, "total_price" int null, "is_promotion" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_item_pkey" primary key ("id"));`);

    this.addSql(`create table "employee" ("id" varchar(255) not null, "user_id" varchar(255) not null, "restaurant_id" varchar(255) not null, "role" text check ("role" in ('driver', 'waiter', 'manager', 'chef', 'kitchener', 'cleaner')) not null, "schedule_id" uuid null, constraint "employee_pkey" primary key ("id"));`);

    this.addSql(`alter table "supplier_item" add constraint "supplier_item_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade;`);
    this.addSql(`alter table "supplier_item" add constraint "supplier_item_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "ingredient_composition" add constraint "ingredient_composition_complex_ingredient_id_foreign" foreign key ("complex_ingredient_id") references "supply_item" ("id") on update cascade;`);
    this.addSql(`alter table "ingredient_composition" add constraint "ingredient_composition_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "driver" add constraint "driver_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant" add constraint "restaurant_address_id_foreign" foreign key ("address_id") references "address" ("id") on update cascade;`);
    this.addSql(`alter table "restaurant" add constraint "restaurant_schedule_id_foreign" foreign key ("schedule_id") references "wschedule" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "wishlist" add constraint "wishlist_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "wishlist" add constraint "wishlist_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "supply_order" add constraint "supply_order_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade;`);
    this.addSql(`alter table "supply_order" add constraint "supply_order_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "supply_order_item" add constraint "supply_order_item_order_id_foreign" foreign key ("order_id") references "supply_order" ("id") on update cascade;`);
    this.addSql(`alter table "supply_order_item" add constraint "supply_order_item_supplier_item_id_foreign" foreign key ("supplier_item_id") references "supplier_item" ("id") on update cascade;`);

    this.addSql(`alter table "batch" add constraint "batch_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);
    this.addSql(`alter table "batch" add constraint "batch_supply_order_id_foreign" foreign key ("supply_order_id") references "supply_order" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "stock_transfer" add constraint "stock_transfer_from_restaurant_id_foreign" foreign key ("from_restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "stock_transfer" add constraint "stock_transfer_to_restaurant_id_foreign" foreign key ("to_restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "stock_transfer" add constraint "stock_transfer_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant_stock" add constraint "restaurant_stock_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "restaurant_stock" add constraint "restaurant_stock_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant_batch" add constraint "restaurant_batch_restaurant_stock_id_foreign" foreign key ("restaurant_stock_id") references "restaurant_stock" ("id") on update cascade;`);
    this.addSql(`alter table "restaurant_batch" add constraint "restaurant_batch_source_batch_id_foreign" foreign key ("source_batch_id") references "batch" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "stock_movement" add constraint "stock_movement_restaurant_stock_id_foreign" foreign key ("restaurant_stock_id") references "restaurant_stock" ("id") on update cascade;`);
    this.addSql(`alter table "stock_movement" add constraint "stock_movement_batch_id_foreign" foreign key ("batch_id") references "restaurant_batch" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "promotion" add constraint "promotion_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "order" add constraint "order_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "order" add constraint "order_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "order" add constraint "order_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "delivery" add constraint "delivery_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "delivery" add constraint "delivery_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "delivery_status_history" add constraint "delivery_status_history_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;`);

    this.addSql(`alter table "delivery_location" add constraint "delivery_location_delivery_id_foreign" foreign key ("delivery_id") references "delivery" ("id") on update cascade;`);

    this.addSql(`alter table "expense" add constraint "expense_category_id_foreign" foreign key ("category_id") references "expense_category" ("id") on update cascade;`);
    this.addSql(`alter table "expense" add constraint "expense_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "expense" add constraint "expense_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "expense" add constraint "expense_supply_order_id_foreign" foreign key ("supply_order_id") references "supply_order" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "category" add constraint "category_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);
    this.addSql(`alter table "product" add constraint "product_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "wishlist_item" add constraint "wishlist_item_wishlist_id_foreign" foreign key ("wishlist_id") references "wishlist" ("id") on update cascade;`);
    this.addSql(`alter table "wishlist_item" add constraint "wishlist_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "restaurant_product" add constraint "restaurant_product_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "restaurant_product" add constraint "restaurant_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "product_packaging" add constraint "product_packaging_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "product_packaging" add constraint "product_packaging_packaging_item_id_foreign" foreign key ("packaging_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "product_ingredient" add constraint "product_ingredient_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "product_ingredient" add constraint "product_ingredient_supply_item_id_foreign" foreign key ("supply_item_id") references "supply_item" ("id") on update cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "cart" add constraint "cart_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cart" add constraint "cart_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);

    this.addSql(`alter table "cart_promotion" add constraint "cart_promotion_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;`);
    this.addSql(`alter table "cart_promotion" add constraint "cart_promotion_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade;`);

    this.addSql(`alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;`);
    this.addSql(`alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);

    this.addSql(`alter table "employee" add constraint "employee_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "employee" add constraint "employee_restaurant_id_foreign" foreign key ("restaurant_id") references "restaurant" ("id") on update cascade;`);
    this.addSql(`alter table "employee" add constraint "employee_schedule_id_foreign" foreign key ("schedule_id") references "wschedule" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "courier" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "restaurant" drop constraint "restaurant_address_id_foreign";`);

    this.addSql(`alter table "expense" drop constraint "expense_category_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_payment_id_foreign";`);

    this.addSql(`alter table "supplier_item" drop constraint "supplier_item_supplier_id_foreign";`);

    this.addSql(`alter table "supply_order" drop constraint "supply_order_supplier_id_foreign";`);

    this.addSql(`alter table "expense" drop constraint "expense_supplier_id_foreign";`);

    this.addSql(`alter table "supplier_item" drop constraint "supplier_item_supply_item_id_foreign";`);

    this.addSql(`alter table "ingredient_composition" drop constraint "ingredient_composition_complex_ingredient_id_foreign";`);

    this.addSql(`alter table "ingredient_composition" drop constraint "ingredient_composition_supply_item_id_foreign";`);

    this.addSql(`alter table "batch" drop constraint "batch_supply_item_id_foreign";`);

    this.addSql(`alter table "stock_transfer" drop constraint "stock_transfer_supply_item_id_foreign";`);

    this.addSql(`alter table "restaurant_stock" drop constraint "restaurant_stock_supply_item_id_foreign";`);

    this.addSql(`alter table "product_packaging" drop constraint "product_packaging_packaging_item_id_foreign";`);

    this.addSql(`alter table "product_ingredient" drop constraint "product_ingredient_supply_item_id_foreign";`);

    this.addSql(`alter table "supply_order_item" drop constraint "supply_order_item_supplier_item_id_foreign";`);

    this.addSql(`alter table "session" drop constraint "session_user_id_foreign";`);

    this.addSql(`alter table "driver" drop constraint "driver_user_id_foreign";`);

    this.addSql(`alter table "wishlist" drop constraint "wishlist_user_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_user_id_foreign";`);

    this.addSql(`alter table "cart" drop constraint "cart_user_id_foreign";`);

    this.addSql(`alter table "employee" drop constraint "employee_user_id_foreign";`);

    this.addSql(`alter table "delivery" drop constraint "delivery_driver_id_foreign";`);

    this.addSql(`alter table "restaurant" drop constraint "restaurant_schedule_id_foreign";`);

    this.addSql(`alter table "employee" drop constraint "employee_schedule_id_foreign";`);

    this.addSql(`alter table "wishlist" drop constraint "wishlist_restaurant_id_foreign";`);

    this.addSql(`alter table "supply_order" drop constraint "supply_order_restaurant_id_foreign";`);

    this.addSql(`alter table "stock_transfer" drop constraint "stock_transfer_from_restaurant_id_foreign";`);

    this.addSql(`alter table "stock_transfer" drop constraint "stock_transfer_to_restaurant_id_foreign";`);

    this.addSql(`alter table "restaurant_stock" drop constraint "restaurant_stock_restaurant_id_foreign";`);

    this.addSql(`alter table "promotion" drop constraint "promotion_restaurant_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_restaurant_id_foreign";`);

    this.addSql(`alter table "expense" drop constraint "expense_restaurant_id_foreign";`);

    this.addSql(`alter table "category" drop constraint "category_restaurant_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_restaurant_id_foreign";`);

    this.addSql(`alter table "restaurant_product" drop constraint "restaurant_product_restaurant_id_foreign";`);

    this.addSql(`alter table "cart" drop constraint "cart_restaurant_id_foreign";`);

    this.addSql(`alter table "employee" drop constraint "employee_restaurant_id_foreign";`);

    this.addSql(`alter table "wishlist_item" drop constraint "wishlist_item_wishlist_id_foreign";`);

    this.addSql(`alter table "supply_order_item" drop constraint "supply_order_item_order_id_foreign";`);

    this.addSql(`alter table "batch" drop constraint "batch_supply_order_id_foreign";`);

    this.addSql(`alter table "expense" drop constraint "expense_supply_order_id_foreign";`);

    this.addSql(`alter table "restaurant_batch" drop constraint "restaurant_batch_source_batch_id_foreign";`);

    this.addSql(`alter table "restaurant_batch" drop constraint "restaurant_batch_restaurant_stock_id_foreign";`);

    this.addSql(`alter table "stock_movement" drop constraint "stock_movement_restaurant_stock_id_foreign";`);

    this.addSql(`alter table "stock_movement" drop constraint "stock_movement_batch_id_foreign";`);

    this.addSql(`alter table "cart_promotion" drop constraint "cart_promotion_promotion_id_foreign";`);

    this.addSql(`alter table "delivery" drop constraint "delivery_order_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_delivery_id_foreign";`);

    this.addSql(`alter table "delivery_status_history" drop constraint "delivery_status_history_delivery_id_foreign";`);

    this.addSql(`alter table "delivery_location" drop constraint "delivery_location_delivery_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_category_id_foreign";`);

    this.addSql(`alter table "wishlist_item" drop constraint "wishlist_item_product_id_foreign";`);

    this.addSql(`alter table "restaurant_product" drop constraint "restaurant_product_product_id_foreign";`);

    this.addSql(`alter table "product_packaging" drop constraint "product_packaging_product_id_foreign";`);

    this.addSql(`alter table "product_ingredient" drop constraint "product_ingredient_product_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_product_id_foreign";`);

    this.addSql(`alter table "cart_item" drop constraint "cart_item_product_id_foreign";`);

    this.addSql(`alter table "cart_promotion" drop constraint "cart_promotion_cart_id_foreign";`);

    this.addSql(`alter table "cart_item" drop constraint "cart_item_cart_id_foreign";`);

    this.addSql(`create table "courier" ("id" varchar(255) not null, "user_id" varchar(255) null, "name" varchar(255) null, "vehicle" varchar(255) null, "is_active" bool not null default true, constraint "courier_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "address" cascade;`);

    this.addSql(`drop table if exists "expense_category" cascade;`);

    this.addSql(`drop table if exists "images" cascade;`);

    this.addSql(`drop table if exists "payment" cascade;`);

    this.addSql(`drop table if exists "supplier" cascade;`);

    this.addSql(`drop table if exists "supply_item" cascade;`);

    this.addSql(`drop table if exists "supplier_item" cascade;`);

    this.addSql(`drop table if exists "ingredient_composition" cascade;`);

    this.addSql(`drop table if exists "unit" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "driver" cascade;`);

    this.addSql(`drop table if exists "wschedule" cascade;`);

    this.addSql(`drop table if exists "restaurant" cascade;`);

    this.addSql(`drop table if exists "wishlist" cascade;`);

    this.addSql(`drop table if exists "supply_order" cascade;`);

    this.addSql(`drop table if exists "supply_order_item" cascade;`);

    this.addSql(`drop table if exists "batch" cascade;`);

    this.addSql(`drop table if exists "stock_transfer" cascade;`);

    this.addSql(`drop table if exists "restaurant_stock" cascade;`);

    this.addSql(`drop table if exists "restaurant_batch" cascade;`);

    this.addSql(`drop table if exists "stock_movement" cascade;`);

    this.addSql(`drop table if exists "promotion" cascade;`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "delivery" cascade;`);

    this.addSql(`drop table if exists "delivery_status_history" cascade;`);

    this.addSql(`drop table if exists "delivery_location" cascade;`);

    this.addSql(`drop table if exists "expense" cascade;`);

    this.addSql(`drop table if exists "category" cascade;`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "wishlist_item" cascade;`);

    this.addSql(`drop table if exists "restaurant_product" cascade;`);

    this.addSql(`drop table if exists "product_packaging" cascade;`);

    this.addSql(`drop table if exists "product_ingredient" cascade;`);

    this.addSql(`drop table if exists "order_item" cascade;`);

    this.addSql(`drop table if exists "cart" cascade;`);

    this.addSql(`drop table if exists "cart_promotion" cascade;`);

    this.addSql(`drop table if exists "cart_item" cascade;`);

    this.addSql(`drop table if exists "employee" cascade;`);
  }

}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { WeekScheduleModule } from './week-schedule/week-schedule.module';
import { AddressBookModule } from './address-book/address-book.module';

@Module({
    imports: [
        DatabaseModule,
        WeekScheduleModule,
        AddressBookModule,
        ImageUploadModule
    ],
})
export class CommonModule {}

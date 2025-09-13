import { Module } from '@nestjs/common';

import { AddressBookService } from './address-book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AddressBookEntity]),
    ],
    providers: [AddressBookService],
    exports: [AddressBookService]
})
export class AddressBookModule { }

import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MenuService } from './menu.service';
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        CategoryModule,
        ProductsModule
    ],
    providers: [MenuService],
    exports: [MenuService]
})
export class MenuModule { }

import { Button } from '@/components/ui/button';
import { useCart } from './cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/utils/currency';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ICartItem } from '@dodzo-web/shared';

interface CartItemProps {
    item: ICartItem;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart();

    return (
        <div className="flex items-center gap-4 rounded-lg border p-4 md:flex-col md:items-start">
            <div className="relative h-24 w-24 md:h-32 md:w-full">
                <Image
                    src={item.product.primaryImage.url}
                    alt={item.product.title}
                    fill
                    className="object-cover rounded-md md:object-contain"
                />
            </div>
            <div className="flex flex-1 items-start justify-between gap-4 md:w-full md:flex-col">
                <div className="space-y-1">
                    <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:underline"
                    >
                        {item.product.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                    </p>
                </div>
                <div className="flex items-center gap-4 md:w-full md:justify-between">
                    <Select
                        value={item.quantity.toString()}
                        onValueChange={value =>
                            updateQuantity(item.product.id, Number(value))
                        }
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(10)].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-4">
                        <span className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

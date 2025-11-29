import React from "react";

import { Container } from "@/components/ui/container";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

function Home() {
    return (
        <Container className="mt-10">
            <div className="space-y-10 pb-10">
                <div className="flex flex-col gap-y-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Latest Products</h1>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`/?page=`}
                                    isActive={true}
                                />
                            </PaginationItem>

                            <div>
                                ХУЙ
                            </div>

                            <PaginationItem>
                                <PaginationNext
                                    href={`/?page=`}
                                    isActive={true}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </Container>
    );
}

export default Home;

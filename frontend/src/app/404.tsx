import { Button } from "@/components/ui/button";
import React from "react";

const Lost = () => {
    return (
        <div style={{ maxWidth: 500, marginInline: "auto" }}>
            <span>
                <h1 className="text-uppercase text-center">Nothing is here</h1>
                <h4 className="lead text-center">
                    You are seeing this because you are headed into abyss!⚫-_-
                </h4>
                <p className="text-muted text-center mt-3">
                    <Button href="/" className="text-uppercase">
                        go home
                    </Button>
                </p>
            </span>
        </div>
    );
};

export default Lost;

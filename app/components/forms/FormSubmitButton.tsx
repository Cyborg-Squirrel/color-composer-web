import { Button } from "@mantine/core";
import type { ReactNode } from "react";

interface IFormSubmitButtonProps {
    type?: "submit" | "button";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    loaderProps?: any;
    children?: ReactNode;
    variant?: "default" | "filled" | "light" | "outline";
    grow?: boolean;
    mt?: string;
    justify?: "flex-start" | "center" | "flex-end";
    isMobile?: boolean;
    "data-testid"?: string;
}

export const FormSubmitButton = ({
    onClick,
    disabled = false,
    loading = false,
    loaderProps = { type: 'dots' },
    children,
    isMobile = false,
    "data-testid": dataTestId,
}: IFormSubmitButtonProps) => {
    return (
        <Button
            data-testid={dataTestId}
            type="submit"
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            loaderProps={loaderProps}
            variant="submit"
            size={isMobile ? "md" : "sm"}
        >
            {children || "Submit"}
        </Button>
    );
};

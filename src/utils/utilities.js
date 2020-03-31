export const isBrowser = () => {
    return !(typeof document === "undefined" || typeof window === "undefined");
}   
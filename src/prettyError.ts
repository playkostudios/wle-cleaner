export function prettyError(err: unknown) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error(err);
    }
}
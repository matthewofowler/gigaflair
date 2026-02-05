import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    loadContext: AppLoadContext
) {
    let body = await renderToReadableStream(
        <ServerRouter context={routerContext} url={request.url} />,
        {
            signal: request.signal,
            onError(error: unknown) {
                // Log streaming rendering errors from inside the shell
                console.error(error);
                responseStatusCode = 500;
            },
        }
    );

    if (isbot(request.headers.get("user-agent") || "")) {
        await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    responseHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    responseHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    responseHeaders.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:;"
    );

    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}

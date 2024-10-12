# otel-observability-ws

## Summary

This codebase provides a set of sample applications that shall be instrumented with OpenTelemetry within a hands on workshop.

NOTE: The projects are only meant to be workshop resources and shall not be used as is in production!

## Prerequisites

To participate in the workshop, you will need the following things on your development machine:

- [node](https://nodejs.org/en) (version as of writing this: 20)
- [dotnet core sdk](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (version as of writing this: 8)
- a code editor for developing
  - TypeScript
  - C#

## Debugging quick start

By running the following commands inside the root directory of this repository you will be able to start all
the applications with hot reloading enabled, so that changes to the source code made during the workshop are
applied without the need to restart the applications.

```shell
dotnet watch --project ./apps/backends/user-api/UserApi.csproj
```

```shell
dotnet watch --project ./apps/backends/workshop-api/WorkshopApi.csproj
```

```shell
npm run dev --prefix ./apps/frontends/web
```

## Applications to instrument

This repository provides the following applications that interact with each other:

- the [workshop-api](./apps/backends/workshop-api/) is an ASP.NET Core API responsible for CRUD operations on workshops
- the [user-api](./apps/backends/user-api/) is an ASP.NET Core API responsible to get user information
- the [web](./apps/frontends/web) frontend is a Next.js application enabling users to view and manage the available workshops

The following diagram outlines how those applications interact with another:

// TODO: Add diagramm and description

## Additional resources

If you are interested in learning more, here are some links to start:

- [What is OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/)
- [What are traces and spans](https://opentelemetry.io/docs/concepts/signals/traces/)
- [What are logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [How to instrument ASP.NET Core apps](https://opentelemetry.io/docs/languages/net/getting-started/)
- [How to instrument Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)

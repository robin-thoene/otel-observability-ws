# otel-observability-ws

## Summary

This codebase provides a set of sample applications that shall be instrumented with OpenTelemetry within a hands on workshop.

NOTE: The projects are only meant to be workshop resources and shall not be used as is in production!

## Prerequisites

To participate in the workshop, you will need the following things on your development machine:

- [git](https://git-scm.com/)
- [node](https://nodejs.org/en) (version as of writing this: 20)
- [dotnet core sdk](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (version as of writing this: 8)
- a code editor for developing
  - TypeScript
  - C#
- a way to run containers, like [docker](https://www.docker.com/) or [podman](https://podman.io/)

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

## Results

You can find the instrumentation of the Next.js frontend [here](./apps/frontends/web/src/instrumentation.otel.ts), the
instrumentation of the user-api [here](./apps/backends/user-api/Program.cs) and the instrumentation of the workshop-api
[here](./apps/backends/workshop-api/Program.cs).

In this workshop we used Datadog as example. To run the dd-agent locally that forwards your data to Datadog, run the following
command:

Ensure you replace the value for the api key and the hostname so you can filter in Datadog.

```shell
docker run --rm --cgroupns host --pid host --name dd-agent -v /proc/:/host/proc/:ro -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro -e DD_SITE="datadoghq.eu" -e DD_ENV=localhost -e DD_API_KEY=YOUR-API-KEY -e DD_HOSTNAME=YOUR-HOSTNAME -testing -e DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT=0.0.0.0:4317 -e DD_OTLP_CONFIG_LOGS_ENABLED=true -e DD_LOGS_ENABLED=true  -p 4317:4317 gcr.io/datadoghq/agent:7
```

## Additional resources

If you are interested in learning more, here are some links to start:

- [What is OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/)
- [What are traces and spans](https://opentelemetry.io/docs/concepts/signals/traces/)
- [What are logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [How to instrument ASP.NET Core apps](https://opentelemetry.io/docs/languages/net/getting-started/)
- [How to instrument Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry)

import { NodeSDK } from "@opentelemetry/sdk-node";
import { Resource } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "workshop-management-web",
  }),
  spanProcessor: new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: "http://localhost:4317",
    }),
  ),
  instrumentations: [new UndiciInstrumentation()],
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator()],
  }),
});

sdk.start();
